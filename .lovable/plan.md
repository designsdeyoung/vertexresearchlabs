

# Shareable Order Confirmation with Auto-Apply Discount Link

## Overview

After placing an order, customers will see a new "Share & Save" section on the order confirmation page with a pre-built shareable URL that includes their discount code. When someone clicks that link, the code auto-applies at checkout. The section also reinforces the email activation CTA for claiming rewards.

## What Changes

### 1. Pass the customer's referral code to the Order Confirmation page

- In `Checkout.tsx`, after the order is placed, fetch the customer's `referral_code` from the `award-points` response (it already returns profile data) or query it, and pass it via `navigate()` state to the confirmation page.
- The `award-points` edge function will be updated to include `referralCode` in its response payload so the confirmation page has it immediately.

### 2. Auto-apply discount code at Checkout from URL

- In `Checkout.tsx`, read a `?code=` (or `?discount=`) query parameter on mount.
- If present, auto-fill the discount code input and trigger validation automatically, so the 10% off is applied without the user having to type anything.
- This works alongside the existing `?ref=` capture for cookie-based tracking.

### 3. New "Share & Earn" section on Order Confirmation page

Add a prominent, shareable card between the Rewards card and "What Happens Next" with:

- **Shareable URL**: `https://vertexresearchlabs.lovable.app?ref=CODE&discount=CODE` -- pre-built with their personal code so it both captures the referral cookie AND auto-applies the discount at checkout.
- **Copy link button** and **Share via SMS / Email** buttons with pre-written messages like: "Use my code ADAM10 for 10% off at Vertex Research Labs!"
- **Explanation text**: "Share your code with friends -- they get 10% off, you earn 3x points on their order."
- The code displayed prominently in a copyable badge.

### 4. Strengthen the email activation CTA

- Make the "Check your email to activate your account" section more prominent with a slightly larger callout.
- Add text: "Activate your account to unlock your rewards dashboard and track your referral earnings."

## Files to Modify

| File | Change |
|---|---|
| `supabase/functions/award-points/index.ts` | Return `referralCode` in the response payload |
| `src/pages/Checkout.tsx` | Read `?discount=` param on mount, auto-fill and auto-validate the discount code field; pass `referralCode` to order confirmation |
| `src/pages/OrderConfirmation.tsx` | Add shareable referral section with copy link, SMS/email share buttons, and the customer's discount code; strengthen email activation CTA |

## Technical Details

**Shareable URL format:**
```
https://vertexresearchlabs.lovable.app?ref=ADAM10&discount=ADAM10
```
- `ref=ADAM10` -- captured by the existing `useReferralCapture` hook (stored in cookie/localStorage for 30 days)
- `discount=ADAM10` -- new param, read by Checkout on mount to auto-fill the discount code input and trigger validation

**Auto-apply flow in Checkout:**
- On mount, check `URLSearchParams` for `discount` param
- If found, set `discountCode` state and call `handleApplyDiscount()` after form email is available (needed for self-referral check)
- Show a toast: "Discount code ADAM10 applied!"

**Order Confirmation share section:**
- Only shown when the customer has a referral code (passed from checkout or fetched)
- Includes copy-to-clipboard for both the code and the full link
- SMS and email share buttons with pre-written messages
- Animated entry matching the existing page style
