# Subscribe & Save — Stripe Recurring Subscriptions

## Confirmed specs
- **Frequency:** every 30 days
- **Discount:** 10% off + 2x points (6 pts/$)
- **Stacking:** stacks with 3-pack discount and sitewide sale
- **Payment:** Stripe (using existing `STRIPE_SECRET_KEY` BYOK setup, no migration to built-in Stripe)

## Database
New table `public.subscriptions`:
- `id`, `profile_id`, `stripe_subscription_id` (unique), `stripe_customer_id`
- `status` (active/paused/canceled/past_due)
- `product_id`, `product_name`, `quantity`, `is_3pack`
- `unit_amount`, `interval_days` (default 30)
- `current_period_end`, `cancel_at_period_end`
- `shipping_address` (jsonb)
- `created_at`, `updated_at`
- RLS: users can SELECT their own; INSERT/UPDATE only via edge functions (service role)

## Cart context
- Add `isAutoship` flag to `CartItem`
- New `addAutoship(product, is3Pack)` action
- Recompute unit price: `basePrice × (1 - sitewideSale) × (1 - threePackIfApplicable) × 0.9` for autoship lines
- `hasAutoship` boolean exposed for checkout branching

## Product UI (ProductCard + ProductDetail)
- Radio toggle: "One-time purchase" / "Subscribe & Save 10% + 2x points (every 30 days)"
- Cyan accent badge when autoship selected
- "Add to Cart" / "Add 3-Pack" buttons honor the toggle

## Cart drawer
- Show "Autoship · every 30 days" label per autoship line
- Display 10% autoship discount in line price

## Checkout
- If `hasAutoship`, redirect to Stripe Checkout (subscription mode) via new edge function
- Mixed cart (one-time + autoship) → split: charge one-time via current PaymentIntent flow + create subscription separately
- For simplicity in v1: if any autoship is in cart, route entire flow to Stripe Checkout in `subscription` mode (one-time items become first-invoice add-ons). If user wants strict separation we can refactor later.

## Edge functions (new)
1. **`create-subscription-checkout`** — creates Stripe Customer (or reuses), creates Prices on the fly with `recurring.interval_count=30, interval=day`, creates Checkout Session in subscription mode, returns URL
2. **`stripe-subscription-webhook`** — handles `customer.subscription.created/updated/deleted`, `invoice.paid` (creates order rows, awards 2x points on each renewal)
3. **`manage-subscription`** — authenticated; cancel/pause/resume; calls Stripe API and updates row

## Dashboard
- New `SubscriptionsList` component on Dashboard
- Shows active autoships: product, next ship date, price, [Cancel] button
- Cancels via `manage-subscription` edge function

## Files
- New: `supabase/migrations/<ts>_subscriptions.sql`
- New: `supabase/functions/create-subscription-checkout/index.ts`
- New: `supabase/functions/stripe-subscription-webhook/index.ts`
- New: `supabase/functions/manage-subscription/index.ts`
- New: `src/components/dashboard/SubscriptionsList.tsx`
- Edit: `src/contexts/InquiryCartContext.tsx` (autoship flag + pricing)
- Edit: `src/components/ProductCard.tsx` (toggle)
- Edit: `src/pages/ProductDetail.tsx` (toggle)
- Edit: `src/components/InquiryCart.tsx` (autoship label)
- Edit: `src/pages/Checkout.tsx` (subscription branch)
- Edit: `src/pages/Dashboard.tsx` (subscriptions panel)

## User action required
After approval, you'll need to add a webhook endpoint in your Stripe dashboard pointing to the deployed `stripe-subscription-webhook` URL — I'll give you the exact URL and the events to subscribe to once it's deployed.
