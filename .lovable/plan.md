

# Add Bitcoin Payment Option to Checkout

## Overview
Add a Bitcoin (BTC) payment method to the checkout page. When selected, the customer sees your BTC wallet address with a QR code and copy-to-clipboard functionality. The order is submitted as "Pending BTC Payment" so you can manually verify the transaction.

## How It Works
- A **payment method selector** is added to the checkout form (Card/Invoice vs Bitcoin)
- When Bitcoin is selected, the checkout displays your BTC address, a QR code, and a copy button
- The order summary shows the USD total with a note to send equivalent BTC
- On submit, the order is saved with `payment_method: "bitcoin"` so you know to watch for the transaction
- The confirmation page reminds the customer to send BTC if they haven't already

## Technical Changes

### 1. Checkout Page (`src/pages/Checkout.tsx`)
- Add a payment method toggle (default "standard" vs "bitcoin")
- When "bitcoin" is selected, render a styled card with:
  - Your BTC address (stored as a constant)
  - A **QR code** generated via `qrcode.react` library (or a free API image)
  - A **copy address** button
  - A note: "Send the USD equivalent in BTC. Your order ships once payment is confirmed."
- Save `paymentMethod` in the order submission data

### 2. Order Confirmation Page (`src/pages/OrderConfirmation.tsx`)
- If payment method is "bitcoin", show a reminder card with the BTC address and instructions

### 3. Orders Table (database)
- Add a `payment_method` column (text, default `'standard'`) to the `orders` table so you can filter/track BTC orders

### 4. Confirmation Email (`supabase/functions/send-order-confirmation/index.ts`)
- Include BTC payment instructions in the email when `payment_method === 'bitcoin'`

## What I Need From You
- Your **BTC wallet address** to display on the checkout page

