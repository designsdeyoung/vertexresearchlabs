-- Track transactional emails per order so the Fulfillment page can show
-- what was sent, its status (sent/delivered/opened), and a preview.
CREATE TABLE IF NOT EXISTS email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  profile_id uuid,
  email_type text NOT NULL,        -- shipped | in_transit | out_for_delivery | delivered | invoice | order_confirmation
  recipient text NOT NULL,
  resend_id text,
  subject text,
  sent_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS email_log_order_idx ON email_log(order_id);
