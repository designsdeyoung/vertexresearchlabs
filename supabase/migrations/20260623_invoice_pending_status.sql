-- Emergency manual-invoice checkout fallback: allow the "invoice_pending" order status
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status = ANY (ARRAY['pending','confirmed','shipped','delivered','cancelled','invoice_pending']));
