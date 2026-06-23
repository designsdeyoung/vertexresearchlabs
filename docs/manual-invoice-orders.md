# Manual Invoice Orders (emergency checkout fallback)

While `VITE_MANUAL_INVOICE_MODE=true`, card checkout is hidden and customers
submit **order requests** instead of paying. These orders are created with
status `invoice_pending`, `paid_at = NULL`, `payment_method = 'manual_invoice'`,
and `points_earned = 0` (no points until paid). No inventory is reserved or
reduced (inventory is display-only in this project).

## View pending order requests

In the **Fulfillment** page (`/fulfillment`), pending requests appear under the
default **Unfulfilled** filter (the filter excludes shipped/delivered/cancelled,
so `invoice_pending` shows up).

### Or query Supabase directly

```sql
-- All open invoice requests, newest first
select
  order_number,
  shipping_name,
  total,
  status,
  created_at,
  (select email from profiles p where p.id = o.profile_id) as profile_email
from orders o
where status = 'invoice_pending'
order by created_at desc;
```

```sql
-- Full detail for one request (items, address)
select order_number, status, total, items,
       shipping_name, shipping_address1, shipping_address2,
       shipping_city, shipping_state, shipping_zip
from orders
where order_number = 'VRL-1000XX';
```

## Fulfilling a paid manual order

After you collect payment via the invoice you emailed:

```sql
-- Mark a manual order paid + ready to fulfill
update orders
set status = 'confirmed', paid_at = now()
where order_number = 'VRL-1000XX';
```

Points are NOT auto-credited for manual orders. If you want to credit loyalty
points after payment, add a `points_transactions` row and bump the profile
balance manually (same pattern used for cash orders).

## Turning card checkout back on

Set `VITE_MANUAL_INVOICE_MODE=false` (or remove it) in the environment and
redeploy. All Stripe code is intact behind the flag — nothing was deleted.

## Automated Zelle invoicing

When a customer submits an order request, the system **automatically** emails them
a clean invoice with Zelle payment instructions (and shows the same on the
confirmation page):

- **Send to:** (727) 291-2893
- **Recipient:** Vertex Research Labs
- **Amount:** the order total
- **Memo:** the order number (e.g. VRL-1000XX) — match incoming Zelle payments by this

No team action is needed to send the invoice. When the Zelle payment lands, mark
the order paid (see "Fulfilling a paid manual order" above) and the order ships.

To change the Zelle number/recipient, edit `ZELLE_PHONE` / `ZELLE_NAME` in
`supabase/functions/submit-order-request/index.ts` and redeploy that function.
