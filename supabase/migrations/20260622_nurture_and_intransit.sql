-- In-transit tracking email + 21-day reorder nurture
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS in_transit_email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reorder_nurture_sent_at TIMESTAMPTZ;

-- Backfill protection: mark all existing orders older than 18 days as
-- already-nurtured so enabling the daily cron does NOT blast the backlog.
-- Orders from the last 18 days stay eligible and will nurture at their day-21 mark.
UPDATE orders
SET reorder_nurture_sent_at = NOW()
WHERE created_at < NOW() - INTERVAL '18 days'
  AND reorder_nurture_sent_at IS NULL;
