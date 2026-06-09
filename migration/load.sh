#!/usr/bin/env bash
# Restore the Lovable export into a fresh Supabase project.
# Usage: ./migration/load.sh "postgresql://postgres:PASSWORD@db.<ref>.supabase.co:5432/postgres"
set -euo pipefail

# psql from libpq (keg-only Homebrew install)
[ -x /opt/homebrew/opt/libpq/bin/psql ] && export PATH="/opt/homebrew/opt/libpq/bin:$PATH"

DB_URL="${1:?Pass the new Supabase DIRECT connection string as arg 1}"
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "==> 0. Sanity: can we connect, and is the schema present?"
psql "$DB_URL" -tAc "select 1" >/dev/null
HAS_PROFILES=$(psql "$DB_URL" -tAc "select to_regclass('public.profiles') is not null")
if [ "$HAS_PROFILES" != "t" ]; then
  echo "!! public.profiles not found — schema migrations haven't been applied yet."
  echo "   Apply them first (GitHub-linked deploy, or: supabase db push), then re-run."
  exit 1
fi

echo "==> 1. Generate auth.users INSERTs from users.csv (preserving original UUIDs)"
python3 - "$DIR/auth/users.csv" > "$DIR/auth/_auth_users.gen.sql" <<'PY'
import csv, sys, json
path = sys.argv[1]
def q(s):  # SQL-quote a string
    return "'" + s.replace("'", "''") + "'"
rows=[]
with open(path, newline='') as f:
    for r in csv.DictReader(f):
        uid=r["id"]; email=r["email"]
        confirmed = r.get("email_confirmed_at") or ""
        created = r.get("created_at") or ""
        meta = r.get("raw_user_meta_data") or "{}"
        confirmed_sql = q(confirmed) if confirmed.strip() else (q(created) if created.strip() else "now()")
        created_sql = q(created) if created.strip() else "now()"
        rows.append(
            "INSERT INTO auth.users "
            "(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,"
            "created_at,updated_at,raw_app_meta_data,raw_user_meta_data,is_super_admin,"
            "confirmation_token,recovery_token,email_change_token_new,email_change) VALUES "
            f"('00000000-0000-0000-0000-000000000000',{q(uid)},'authenticated','authenticated',"
            f"{q(email)},NULL,{confirmed_sql},{created_sql},now(),"
            "'{\"provider\":\"email\",\"providers\":[\"email\"]}'::jsonb,"
            f"{q(meta)}::jsonb,false,'','','','') ON CONFLICT (id) DO NOTHING;"
        )
print("\n".join(rows))
PY
echo "    generated $(grep -c INSERT "$DIR/auth/_auth_users.gen.sql") auth user rows"

echo "==> 2. Load everything in one transaction (triggers off so codes/order#s are preserved)"
psql "$DB_URL" -v ON_ERROR_STOP=1 <<SQL
BEGIN;
-- replica mode disables ALL triggers (FK checks + the referral_code/order_number
-- generators) so data loads in any order with codes/numbers preserved exactly.
SET session_replication_role = replica;

\i auth/_auth_users.gen.sql
\i data/profiles.sql
\i data/orders.sql
\i data/points_transactions.sql
\i data/referrals.sql
\i data/credits.sql
\i data/subscriptions.sql

SET session_replication_role = origin;

-- Continue order numbers from where Lovable left off (last_value was 100038)
SELECT setval('public.order_number_seq', $(cat "$DIR/seq.txt"), true);
COMMIT;
SQL

echo "==> 3. Verify row counts"
psql "$DB_URL" -c "select 'auth.users' t, count(*) from auth.users
  union all select 'profiles', count(*) from public.profiles
  union all select 'orders', count(*) from public.orders
  union all select 'points_transactions', count(*) from public.points_transactions
  union all select 'referrals', count(*) from public.referrals
  union all select 'credits', count(*) from public.credits
  union all select 'subscriptions', count(*) from public.subscriptions
  order by 1;"

echo "==> Done. Expected: auth.users 33, profiles 29, orders 40, points_transactions 58, referrals 5, credits 6, subscriptions 0."
echo "    (Storage logo + edge-function secrets are separate steps — see the runbook.)"
