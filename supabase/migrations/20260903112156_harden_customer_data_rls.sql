-- Prevent an authenticated customer from directly changing rewards/referral state.
-- RLS limits the row; column privileges limit what may change within that row.
REVOKE UPDATE ON TABLE public.profiles FROM authenticated;
GRANT UPDATE (
  full_name,
  email,
  phone_number,
  organization,
  address_line1,
  address_line2,
  city,
  state,
  zip_code,
  country,
  updated_at
) ON TABLE public.profiles TO authenticated;

-- Preserve an auditable record of the organization and research-use representation.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS research_organization text,
  ADD COLUMN IF NOT EXISTS research_use_acknowledged_at timestamptz;

COMMENT ON COLUMN public.orders.research_organization IS
  'Organization named by the purchaser during qualified procurement.';
COMMENT ON COLUMN public.orders.research_use_acknowledged_at IS
  'Server-recorded time the purchaser submitted the research-use representation.';

-- These operational tables are only accessed by service-role Edge Functions.
-- Keep them unavailable through the public Data API and enforce RLS as defense
-- in depth for every table in the exposed public schema.
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_overrides ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.email_log FROM anon, authenticated;
REVOKE ALL ON TABLE public.referral_overrides FROM anon, authenticated;
