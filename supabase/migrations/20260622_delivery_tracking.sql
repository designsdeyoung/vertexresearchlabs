-- Delivery lifecycle tracking driven by EasyPost tracker webhooks
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delivery_detail TEXT,                  -- USPS message e.g. "Left at front door"
  ADD COLUMN IF NOT EXISTS out_for_delivery_email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delivered_email_sent_at TIMESTAMPTZ;
