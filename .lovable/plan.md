## Two things to do

### 1. Remove Bitcoin from the site
The site is already wired to Stripe-only at checkout (`paymentMethod = "stripe"`), but leftover Bitcoin code/UI still exists. I'll clean these up:

- **Delete** `src/components/checkout/BitcoinReminder.tsx` (unused component, hardcoded BTC address)
- **`src/pages/TrackOrder.tsx`** — remove the "Awaiting Bitcoin payment confirmation" yellow banner block (lines 252–256)
- **`src/pages/OrderConfirmation.tsx`** — remove the leftover "BitcoinReminder removed" comment
- **`supabase/functions/send-order-confirmation/index.ts`** — strip the entire Bitcoin payment instructions HTML block (around lines 272–280) and any `paymentMethod === 'bitcoin'` branches
- Confirm no other references remain via search

### 2. Why Tiffany's order email didn't arrive
I checked her order in the database:

- **Order:** VRL-100026, total $119.70, **status: `pending`**, `payment_method: "standard"`, `stripe_payment_intent_id: null`, `paid_at: null`
- There are **zero edge function logs** for `send-order-confirmation` matching her order or email

**What this means:** She filled out the checkout form and the order row was created (via `award-points`), but **she never completed the Stripe payment step**. The "Continue to Payment" flow never reached `handleStripeSuccess`, which is what fires the confirmation email. So no email was sent — to her or to you — because the payment was never submitted.

This is also why `payment_method` is `"standard"` (the column default) instead of `"stripe"` — the order was inserted before payment, but the payment intent never came back successful.

**She needs to complete checkout again and actually submit the card payment.** Lauryn's friend likely abandoned at the Stripe card form. I'll also note: the current flow creates the order row *before* Stripe success, which is why these "ghost" pending orders pile up. I can optionally fix that as a follow-up (only insert the order after Stripe confirms), but that's a bigger change — let me know if you want it.

### Files changed
- `src/components/checkout/BitcoinReminder.tsx` (delete)
- `src/pages/TrackOrder.tsx`
- `src/pages/OrderConfirmation.tsx`
- `supabase/functions/send-order-confirmation/index.ts`
