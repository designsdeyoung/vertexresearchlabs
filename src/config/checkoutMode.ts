// Emergency manual-invoice checkout fallback.
// When VITE_MANUAL_INVOICE_MODE === "true", card/Stripe checkout is hidden and
// customers submit an order request that the team invoices manually.
// Flip the env var to "false" (or remove it) and redeploy to restore Stripe.
export const MANUAL_INVOICE_MODE =
  import.meta.env.VITE_MANUAL_INVOICE_MODE === "true";
