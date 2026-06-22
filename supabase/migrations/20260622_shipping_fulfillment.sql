-- Add fulfillment / shipping fields to orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS tracking_url    TEXT,
  ADD COLUMN IF NOT EXISTS label_url       TEXT,
  ADD COLUMN IF NOT EXISTS carrier         TEXT DEFAULT 'USPS',
  ADD COLUMN IF NOT EXISTS fulfilled_at    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS easypost_shipment_id TEXT,
  ADD COLUMN IF NOT EXISTS shipping_name   TEXT,
  ADD COLUMN IF NOT EXISTS shipping_address1 TEXT,
  ADD COLUMN IF NOT EXISTS shipping_address2 TEXT,
  ADD COLUMN IF NOT EXISTS shipping_city   TEXT,
  ADD COLUMN IF NOT EXISTS shipping_state  TEXT,
  ADD COLUMN IF NOT EXISTS shipping_zip    TEXT;

-- Index for tracking number lookups (track page)
CREATE INDEX IF NOT EXISTS orders_tracking_number_idx ON public.orders (tracking_number);
