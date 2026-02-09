

# Merge Emails into One + Update Reward Program Copy

## Decision: One Email

Currently there are two separate emails sent after an order:
1. An immediate order confirmation (order details, no rewards info)
2. A delayed welcome/activation email 4 minutes later (rewards info, no order details)

Combining them into a single email is the better approach because:
- Reduces inbox clutter and confusion
- The magic link for account activation arrives immediately while the customer is still engaged
- One cohesive, premium-feeling email that covers everything: order receipt, points earned, how the program works, referral code, and account activation
- The 4-minute delay was designed to catch engagement, but immediate delivery with everything in one place is more effective

## What the Updated Email Will Include

The single email will flow top-to-bottom in this order:

1. **Header** -- Logo + "Order Confirmed" badge + order number
2. **Order Details** -- Product table, subtotal, discount (if applied), shipping, total
3. **Points Earned Banner** -- Large "+132 pts earned on this order" display
4. **Account Activation CTA** -- Magic link button: "Activate My Account" with copy explaining one-click access to rewards dashboard
5. **How Vertex Rewards Works** -- Updated program details:
   - Earn 3 points per $1 spent (6 pts with Autoship)
   - Redeem 500 pts for $20 credit
   - Share your code for 10% off for friends, 3x points for you
6. **Your Referral Code** -- Personalized NAME10 code with shareable link (auto-applies discount)
7. **Shipping Address** -- Same as current
8. **Research Disclaimer** -- Same as current
9. **Footer** -- Same as current

## Technical Changes

### 1. Update `send-order-confirmation/index.ts`

- Accept new fields: `pointsEarned`, `referralCode`, `isNewAccount`
- Generate a magic link (using Supabase admin API) when `isNewAccount` is true
- Add the rewards section, points banner, activation CTA, referral code, and program explanation to the HTML template
- Update all referral copy from "$15 off / 750 points" to "10% off / 3x points"
- Remove the delayed scheduling -- this email sends immediately

### 2. Update `award-points/index.ts`

- Pass `pointsEarned`, `referralCode`, and `isNewAccount` to the order confirmation function call
- Remove the separate call to `send-welcome-email` (no longer needed)
- The order confirmation edge function now handles everything in one email

### 3. Update `send-welcome-email/index.ts`

- Update the referral copy from "$15 off / 750 points" to "10% off / 3x points" as a fallback (in case it's still triggered for edge cases or existing users)
- Update the rewards table to match current program details

### 4. Update `Checkout.tsx`

- Pass `pointsEarned`, `referralCode`, and `isNewAccount` to the order confirmation API call so the email has all the data it needs

## Files to Modify

| File | Change |
|---|---|
| `supabase/functions/send-order-confirmation/index.ts` | Add rewards section, points banner, magic link CTA, referral code, and updated program copy to the customer email template; accept new fields |
| `supabase/functions/award-points/index.ts` | Pass rewards data to order confirmation call; remove separate welcome email call |
| `supabase/functions/send-welcome-email/index.ts` | Update referral copy to "10% off / 3x points" as fallback |
| `src/pages/Checkout.tsx` | Pass additional data (pointsEarned, referralCode, isNewAccount) through to the confirmation email |

