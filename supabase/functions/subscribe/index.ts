import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
// First-order welcome discount. Must match the code wired into validate-discount.
const WELCOME_CODE = "VERTEX10";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubscribeRequest {
  email: string;
  /** When true, sends the welcome email containing the discount code. The
   *  exit-intent popup sets this; checkout consent does not (they already
   *  receive an order confirmation). */
  sendWelcome?: boolean;
  /** Where the contact came from — stored as a Resend audience note. */
  source?: string;
}

// Clean, text-forward welcome email. Kept deliberately light (minimal images,
// personal sender, plain layout, List-Unsubscribe header) so it lands in the
// primary inbox rather than the Promotions tab.
const welcomeHtml = (unsubscribeUrl: string) => `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
  <div style="border-bottom: 1px solid #e5e5e5; padding-bottom: 24px; margin-bottom: 24px;">
    <h1 style="font-size: 20px; font-weight: 600; margin: 0;">Vertex Research Labs</h1>
  </div>
  <p style="font-size: 15px; line-height: 1.6;">Welcome to the Vertex Research Labs community.</p>
  <p style="font-size: 15px; line-height: 1.6;">Use the code below at checkout to receive <strong>10% off your first order</strong>:</p>
  <div style="background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 6px; padding: 16px 24px; text-align: center; margin: 24px 0;">
    <span style="font-size: 24px; font-weight: 700; letter-spacing: 0.1em;">${WELCOME_CODE}</span>
  </div>
  <p style="font-size: 14px; color: #666; line-height: 1.6;">This code is valid for one-time use on your first order. All products are for verified research use only.</p>
  <p style="font-size: 14px; color: #666; line-height: 1.6;">Questions? Reply to this email or visit <a href="https://vertexresearchlabs.com" style="color: #0F6E56;">vertexresearchlabs.com</a>.</p>
  <div style="border-top: 1px solid #e5e5e5; padding-top: 20px; margin-top: 32px; font-size: 12px; color: #999;">
    <p>Vertex Research Labs · Research-grade peptides and analytical reference materials</p>
    <p>You're receiving this because you subscribed at vertexresearchlabs.com. <a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe</a></p>
  </div>
</div>`;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { email, sendWelcome = false }: SubscribeRequest = await req.json();
    const normalized = (email || "").trim().toLowerCase();

    if (!normalized || !EMAIL_RE.test(normalized)) {
      return json({ error: "Invalid email" }, 400);
    }

    // 1) Add to the account audience via the unified Contacts API — no audience
    //    id required (Resend places it in the default audience). Duplicates
    //    (409/422) aren't a failure; we still send the welcome email below.
    try {
      const res = await fetch("https://api.resend.com/contacts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalized, unsubscribed: false }),
      });
      if (!res.ok && res.status !== 409 && res.status !== 422) {
        console.warn("Resend contact add non-OK:", res.status, await res.text());
      }
    } catch (e) {
      console.warn("Resend contact add failed (continuing):", e);
    }

    // 2) Send the welcome + discount email (only when requested).
    if (sendWelcome) {
      const unsubscribeUrl = `mailto:info@vertexresearchlabs.com?subject=unsubscribe`;
      await resend.emails.send({
        from: "Vertex Research Labs <info@vertexresearchlabs.com>",
          replyTo: "info@vertexresearchlabs.com",
        to: [normalized],
        subject: "Your 10% discount code — welcome to Vertex Research Labs",
        html: welcomeHtml(unsubscribeUrl),
        headers: {
          "List-Unsubscribe": "<mailto:info@vertexresearchlabs.com?subject=unsubscribe>",
        },
      });
    }

    return json({ success: true });
  } catch (err) {
    console.error("subscribe error:", err);
    return json({ error: "Something went wrong" }, 500);
  }
};

serve(handler);
