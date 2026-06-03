# Migration Export Manifest

Generated: 2026-06-03

## Public schema data (INSERT statements, generated via `pg_dump --data-only --column-inserts`)

Restore order (profiles first to satisfy FKs):

| File | Table | Rows |
|------|-------|------|
| `data/profiles.sql` | `public.profiles` | 29 |
| `data/orders.sql` | `public.orders` | 40 |
| `data/points_transactions.sql` | `public.points_transactions` | 58 |
| `data/referrals.sql` | `public.referrals` | 5 |
| `data/credits.sql` | `public.credits` | 6 |
| `data/subscriptions.sql` | `public.subscriptions` | 0 |

All columns preserved exactly (JSON, timestamps, nulls). Each file is a self-contained `INSERT` set with no schema DDL.

## Auth

| File | Source | Rows |
|------|--------|------|
| `auth/users.csv` | `auth.users` | 33 |

Columns: `id, email, email_confirmed_at, created_at, raw_user_meta_data`.

**Important:** This export contains only the public-readable identity columns. Password hashes (`encrypted_password`), session/refresh tokens, identities, factors, and other rows in the `auth` schema are NOT accessible from this environment — Supabase blocks the `auth` schema from the SQL editor / agent. To migrate full auth state (including password hashes so existing users can keep their passwords / magic-link history), you must:

1. Open the source Supabase project's SQL Editor while logged in as project owner, OR
2. Use the Supabase CLI with the service-role key / direct DB connection:
   ```
   pg_dump "$DB_URL" --schema=auth --data-only --inserts > auth_full.sql
   ```
   Then load into the destination project (you may need `--disable-triggers`).

The CSV here is sufficient to recreate user rows in the destination (one-time invite/magic-link flow), but will not preserve passwords.

## Storage

| File | Bucket | Object | Content-Type | Size |
|------|--------|--------|--------------|------|
| `storage/logo.png` | `email-assets` (public) | `logo.png` | `image/png` | 274,764 bytes |

See `storage/manifest.json` for machine-readable metadata. Re-upload with:
```
supabase storage cp ./logo.png ss:///email-assets/logo.png
```

## Sequences

| File | Sequence | Value |
|------|----------|-------|
| `seq.txt` | `public.order_number_seq` | `100038` (last_value, is_called=true — next nextval() returns 100039) |

After restoring data, run:
```sql
SELECT setval('public.order_number_seq', 100038, true);
```

## What is NOT in this export

- Schema DDL (tables, functions, triggers, RLS policies) — get from `supabase/migrations/`
- Edge functions — get from `supabase/functions/`
- Secrets — re-add manually in destination project (names listed in earlier migration inventory)
- `auth.users` password hashes / identities / sessions (see Auth note above)
- Other Supabase-managed schemas (`storage`, `realtime`, `vault`, `supabase_functions`)
