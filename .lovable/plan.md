## Current setup (recap)

**Tiers (`src/hooks/useRewards.ts`)** — 7 fixed tiers, points → credit, with cart minimums:
- 500 pts → $20 (min $100)
- 750 pts → $30 (min $120)
- 1,000 pts → $40 (min $150)
- 1,500 pts → $65 (min $200)
- 2,000 pts → $90 (min $250)
- 3,000 pts → $140 (min $350)
- 5,000 pts → $250 (min $500)

**Earning:** 3 pts/$ standard, 6 pts/$ on autoship, 3× referral bonus.

**Today's redemption flow (the problem):**
1. User goes to `/rewards` or `/dashboard` → sees `RewardsLadder` → clicks **Redeem** on a tier *before* shopping.
2. That call (`redeem-credit` edge function) immediately deducts points and creates a `credits` row (one active at a time, 12-month expiry).
3. At checkout, `CreditRedemption` shows the pre-created credit, applies it if cart hits the min.
4. If cart is too small or they picked the wrong tier → confusion (the recent Emily Farrow case).

`CreditRedemption` already supports inline redeem at checkout for logged-in users with no active credit, but the dashboard/rewards page promotes the "redeem early" flow as the primary path.

---

## What changes

**Checkout becomes the only place to redeem.** Dashboard and Rewards page become *read-only* progress views. Real-time points feed at checkout for everyone — `0 pts` for new users, live balance for returning ones — with a Domino's-style ladder of "what your points unlock right now."

### 1. Strip redemption from Dashboard & Rewards page
- `src/components/dashboard/RewardsLadder.tsx`: remove the **Redeem** button, `handleRedeem`, `redeem-credit` call, and the active-credit toast logic. Keep the visual ladder (locked / unlocked checkmarks, tier labels, points needed) and add a small footer line: *"Redeem your points at checkout."*
- `src/pages/Rewards.tsx`: any "Redeem now" CTA → change copy/links to "Shop now" pointing at `/#products`. Tier table stays as marketing/education only.
- Keep the `redeem-credit` edge function untouched (still called from checkout).

### 2. Beef up `CreditRedemption` at checkout
File: `src/components/checkout/CreditRedemption.tsx`

- **Always render the panel** when on checkout — even at 0 pts and even for guests with no email yet. Today it hides if guest+no credits or member+below first tier; remove those early-returns.
- **Real-time balance header**, prominent:
  - Logged in → live `pointsBalance` from `profile` (already passed in).
  - Guest → debounced `lookup-credits` by email already returns `pointsBalance`; surface that number too (today it's discarded). For empty/invalid email, show `0 pts` placeholder + hint *"Sign in or enter your email to load your rewards."*
- **Tier ladder, Domino's style**, always visible:
  - All 7 tiers listed with state per tier:
    - **Locked** — not enough points. Show `X pts to unlock` with a thin progress bar to that tier.
    - **Unlocked but cart too small** — show `Add $X to cart to use`.
    - **Ready** — green "Redeem & apply" button, one click → calls `redeem-credit`, deducts points, creates credit, auto-applies to the order (current behavior).
  - If an active credit already exists, collapse the ladder and show the "credit applied / available" row as today.
- Guest redeem path: current `redeem-credit` edge function requires a JWT. For guests we **don't** allow redeem pre-account — instead, show the ladder with a *"Sign in to redeem"* CTA next to unlocked tiers (magic-link modal). After payment the existing post-checkout account creation kicks in; on next order their points are live.

### 3. Copy & nav cleanup
- Header / dashboard CTAs that say "Redeem points" → "View rewards" or removed.
- `src/pages/Dashboard.tsx` `RewardsLadder` section subtitle → *"Your points unlock credits at checkout."*
- Order confirmation page: keep the "you earned X pts" celebration (no change needed).

### 4. No DB / schema changes
- `credits`, `points_transactions`, `profiles.points_balance`, `redeem_reward_credit` RPC — all stay as-is.
- Tier values in `useRewards.ts` and the matching RPC table — unchanged (you didn't ask to retune them; flag if you want different point-to-credit ratios).

---

## Files touched

```text
src/components/dashboard/RewardsLadder.tsx   (remove redeem, display-only)
src/pages/Rewards.tsx                        (CTAs → Shop now)
src/pages/Dashboard.tsx                      (subtitle copy)
src/components/checkout/CreditRedemption.tsx (always-on ladder + live balance + guest state)
supabase/functions/lookup-credits/index.ts   (no change — already returns pointsBalance)
```

## Open question

Want me to keep the current 7 tiers exactly, or retune (e.g. add a low entry like 250 pts → $10 so brand-new users see something almost-unlocked, more Domino's-like)? Default: keep tiers as-is.
