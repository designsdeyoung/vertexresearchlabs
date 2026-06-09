/** First-order welcome discount code. Must match the code wired into the
 *  `validate-discount` and `subscribe` Supabase Edge Functions. */
export const WELCOME_DISCOUNT_CODE =
  (import.meta.env.VITE_DISCOUNT_CODE as string | undefined) || "VERTEX10";

export const WELCOME_DISCOUNT_PERCENT = 10;
