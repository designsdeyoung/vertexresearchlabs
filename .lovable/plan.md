

# Make BTC the Only Payment Method — Streamlined Flow

## Concept
Remove the payment method selector entirely. The checkout collects shipping info and submits the order as before. After submission, the order confirmation page prominently displays the BTC payment instructions. This is the "order first, pay second" flow you described.

## Changes

### 1. Remove BitcoinPayment component from Checkout (`src/pages/Checkout.tsx`)
- Remove the `BitcoinPayment` import and usage (lines 19, 472-476)
- Remove the `paymentMethod` state — hardcode it to `"bitcoin"` everywhere it's referenced (submission body, navigation state)
- Remove the `CreditCard` icon from the submit button; relabel to "Submit Order Request"
- Keep everything else (discount codes, credit redemption, notes, confirmation checkbox)

### 2. Update Order Confirmation (`src/pages/OrderConfirmation.tsx`)
- The `BitcoinReminder` component already renders when `paymentMethod === "bitcoin"` — since it's now always bitcoin, move it higher on the page (right after the success header, before rewards)
- Make the BTC section more prominent: larger QR code, clearer call-to-action

### 3. Clean up BitcoinPayment component
- Delete `src/components/checkout/BitcoinPayment.tsx` (no longer needed since there's no selector)

### 4. Edge function (`send-order-confirmation`)
- Already includes BTC instructions when `payment_method === 'bitcoin'` — no changes needed since all orders are now bitcoin

### Files Modified
- `src/pages/Checkout.tsx` — remove payment selector, hardcode bitcoin
- `src/pages/OrderConfirmation.tsx` — promote BTC reminder to top of page
- `src/components/checkout/BitcoinPayment.tsx` — delete

