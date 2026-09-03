import { supabase } from "@/integrations/supabase/client";

/**
 * Typed client-side helpers for the email + audience features.
 *
 * IMPORTANT: the Resend API key is server-side only. These helpers never touch
 * it — they invoke Supabase Edge Functions (Deno) which hold the secret and
 * call Resend. Transactional order confirmations are sent from
 * `src/lib/finalizeOrder.ts` via the existing `send-order-confirmation`
 * function and are intentionally not duplicated here.
 */

/** Add an email to the Resend audience. `sendWelcome` also fires the welcome +
 *  discount email (used by the exit-intent popup; checkout consent omits it). */
export async function subscribeEmail(
  email: string,
  opts: { sendWelcome?: boolean; source?: string } = {},
): Promise<{ error?: string }> {
  const { error } = await supabase.functions.invoke("subscribe", {
    body: { email, sendWelcome: opts.sendWelcome ?? false, source: opts.source },
  });
  return error ? { error: error.message } : {};
}

/** Broadcast a new-compound announcement to a list of emails (admin use). */
export async function announceNewCompound(params: {
  emails: string[];
  compoundName: string;
  compoundUrl: string;
}): Promise<void> {
  const { error } = await supabase.functions.invoke("send-new-compound-announcement", { body: params });
  if (error) console.error("announceNewCompound failed:", error);
}
