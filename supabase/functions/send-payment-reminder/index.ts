import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { to, customerName, orderNumber, items, total, paymentLink } = await req.json();
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;color:#f1f5f9;">
  <h1 style="color:#00b4d8;font-size:22px;margin:0 0 8px 0;">Complete your Vertex order</h1>
  <p style="color:#cbd5e1;font-size:15px;line-height:1.6;margin:0 0 16px 0;">Hi ${customerName || "there"},</p>
  <p style="color:#cbd5e1;font-size:15px;line-height:1.6;margin:0 0 20px 0;">
    Your order <strong style="color:#f1f5f9;">${orderNumber}</strong> (${items}) is reserved but hasn't been paid yet.
    Tap below to securely pay <strong style="color:#f1f5f9;">$${total.toFixed(2)}</strong> with debit/credit card. Apple Pay and Google Pay are also supported.
  </p>
  <p style="text-align:center;margin:32px 0;">
    <a href="${paymentLink}" style="background:#00b4d8;color:#0f172a;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;display:inline-block;">Complete Payment →</a>
  </p>
  <p style="color:#94a3b8;font-size:13px;line-height:1.6;">Once payment is received, your order ships within 1–2 business days.</p>
  <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin-top:24px;">Questions? Just reply to this email.</p>
  <p style="color:#64748b;font-size:12px;margin-top:32px;border-top:1px solid #334155;padding-top:16px;">Vertex Research Labs · For laboratory research use only</p>
</div></body></html>`;

    const result = await resend.emails.send({
      from: "Vertex Research Labs <orders@vertexresearchlabs.com>",
      to: [to],
      reply_to: "info@vertexresearchlabs.com",
      subject: `Complete your order ${orderNumber} — $${total.toFixed(2)}`,
      html,
    });

    return new Response(JSON.stringify(result), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
