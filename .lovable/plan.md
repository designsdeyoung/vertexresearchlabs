

# Personalized Discount Codes (NAME10 System)

## What Changes

Replace the current auto-generated referral codes (e.g., `VX-5088CF`) with personalized codes based on the user's first name + "10" (e.g., `ADAM10`, `LAURYN10`).

**New referral/discount behavior:**
- The person using the code gets **10% off** their order (replaces the current flat $15 off)
- The code owner (referrer) earns **3x points** on the referred order's subtotal value (replaces the current flat 750 points)

---

## How It Works

**Example:** Adam shares his code `ADAM10`. His friend places a $200 order.
- Friend gets 10% off = **$20 discount**
- Adam earns 3x points on $200 = **600 points**

On a $400 order:
- Friend saves **$40**
- Adam earns **1,200 points**

This scales naturally -- bigger orders reward both parties more.

---

## Technical Changes

### 1. Database: Update referral code generation trigger

Replace the `generate_referral_code()` function to build codes from the user's first name:
- Extract first name from `full_name`, uppercase it, append `10`
- Handle duplicates by adding a number suffix (e.g., `ADAM10`, `ADAM102`, `ADAM103`)
- Fallback to `VX-XXXXXX` format if no name is available

Update existing profiles to regenerate codes in the new format.

### 2. Checkout: Add discount code input field

- Add a "Discount Code" text input on the checkout page
- When a code is entered, validate it against the `profiles.referral_code` column
- If valid, apply 10% off the subtotal and display the discount in the order summary
- The code can work alongside OR replace the current `?ref=` URL-based capture (both paths feed into the same logic)

### 3. Edge Function (award-points): Update referral reward logic

- Instead of awarding a flat 750 points to the referrer, calculate **3x the referred order's subtotal** (e.g., $200 order = 600 points)
- Apply the 10% discount to the order total when a valid code is used
- Record the discount amount on the order

### 4. Dashboard Referral Section: Update messaging

- Change the share text from "$15 off" to "10% off"
- Display the personalized code prominently (e.g., "Your code: ADAM10")
- Update SMS/email share templates with the new discount language

### 5. Referral Capture: Support both URL and manual code entry

- Keep the existing `?ref=CODE` URL capture for link sharing
- Add manual code entry at checkout for people who received the code verbally or via text
- Both methods feed into the same validation and discount logic

---

## Files to Modify

| File | Change |
|---|---|
| Database migration | New `generate_referral_code()` trigger + update existing codes |
| `src/pages/Checkout.tsx` | Add discount code input, validate against DB, apply 10% off |
| `supabase/functions/award-points/index.ts` | 3x points for referrer instead of flat 750; handle discount |
| `src/components/dashboard/ReferralSection.tsx` | Update copy: "10% off" instead of "$15 off", show code prominently |
| `src/hooks/useRewards.ts` | Update `REFERRAL_POINTS` constant and add referral multiplier |
| `src/components/checkout/CreditRedemption.tsx` | Fix empty percentage display bug |

