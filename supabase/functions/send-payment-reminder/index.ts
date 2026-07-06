import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Friendly "complete your order" reminder for an unpaid manual-invoice order.
// Re-sends the Apple Cash / Zelle payment instructions. Input: { orderNumber, bcc? }.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE = "https://vertexresearchlabs.com";
const LOGO_URL = "https://qgritvsluilqptgtvayv.supabase.co/storage/v1/object/public/email-assets/logo-avatar.png";
const ZELLE_PHONE = "(727) 291-2893";
const PAYMENT_NOTE = "Payments go to Adam DeYoung (owner of Vertex Research Labs) — that's the name you'll see. Add your order number in the note so we can match your payment.";
const METHODS = [
  { emoji: "🏦", label: "Zelle", to: `Adam DeYoung · ${ZELLE_PHONE}` },
  { emoji: "🍏", label: "Apple Cash", to: ZELLE_PHONE },
  { emoji: "💵", label: "Cash App", to: "$adamwdeyoung" },
  { emoji: "🅥", label: "Venmo", to: "@itsadamd" },
];
const fmt = (n: number) => `$${Number(n || 0).toFixed(2)}`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { orderNumber, bcc } = await req.json();
    if (!orderNumber) throw new Error("orderNumber required");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: order } = await admin
      .from("orders")
      .select("id, order_number, total, items, paid_at, shipping_name, profiles!orders_profile_id_fkey(email, full_name)")
      .eq("order_number", orderNumber)
      .maybeSingle();
    if (!order) throw new Error("order not found");
    if (order.paid_at) throw new Error("order is already paid");

    const profile = (order as any).profiles;
    const email = profile?.email;
    if (!email) throw new Error("no email on file for this order");
    const firstName = (profile?.full_name || order.shipping_name || "there").split(" ")[0];
    const orderRef = order.order_number;
    const total = Number(order.total);

    const items = (() => {
      try { return Array.isArray(order.items) ? order.items : JSON.parse(order.items || "[]"); }
      catch { return []; }
    })();
    const itemRows = items.map((i: any) =>
      `<tr><td style="padding:6px 0;border-bottom:1px solid #1f1f1f;color:#e5e7eb;font-size:13px">${i.productName || i.name || "Item"}${i.size ? ` · ${i.size}` : ""}</td><td style="padding:6px 0;border-bottom:1px solid #1f1f1f;color:#9ca3af;font-size:13px;text-align:center">×${i.quantity || 1}</td></tr>`
    ).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;background:#0d0d0d;border:1px solid #1f1f1f;border-radius:8px;overflow:hidden">
  <div style="text-align:center;padding:24px 0 6px">
    <img src="${LOGO_URL}" alt="Vertex Research Labs" width="52" height="52" style="display:inline-block;border-radius:12px"/>
    <div style="color:#2DD4BF;font-size:10px;letter-spacing:3px;font-weight:700;text-transform:uppercase;margin-top:8px">Vertex Research Labs</div>
  </div>
  <div style="padding:6px 28px 18px;border-bottom:1px solid #1a1a1a">
    <div style="font-size:23px;font-weight:800;color:#fff;line-height:1.25">Just a reminder, ${firstName} 👋</div>
    <div style="color:#9ca3af;font-size:14px;margin-top:8px;line-height:1.6">
      Your order <strong style="color:#fff">${orderRef}</strong> is reserved, but it <strong style="color:#fff">will not ship until payment is received.</strong>
      Send it with any option below and we'll get it moving right away.
    </div>
  </div>
  ${itemRows ? `<div style="padding:18px 28px;border-bottom:1px solid #1a1a1a"><div style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px">Your Order</div><table style="width:100%;border-collapse:collapse">${itemRows}</table></div>` : ""}
  <div style="padding:24px 28px;border-bottom:1px solid #1a1a1a">
    <div style="background:linear-gradient(135deg,#0d2620 0%,#0a1a17 100%);border:1px solid #1f4d42;border-radius:12px;padding:24px">
      <div style="color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;margin-bottom:14px;text-align:center">Pay by any of these</div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <tr><td style="text-align:left;color:#9ca3af;font-size:13px;padding:6px 0;border-bottom:1px solid #1a3a34">Amount</td><td style="text-align:right;color:#ffd700;font-size:20px;font-weight:900;padding:6px 0;border-bottom:1px solid #1a3a34">${fmt(total)}</td></tr>
        <tr><td style="text-align:left;color:#9ca3af;font-size:13px;padding:6px 0">Note / memo</td><td style="text-align:right;color:#fff;font-size:14px;font-weight:700;padding:6px 0">${orderRef}</td></tr>
      </table>
      ${METHODS.map((m) => `<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:#0a1714;border:1px solid #16302a;border-radius:8px;padding:11px 14px;margin-bottom:8px"><span style="color:#e5e7eb;font-size:14px;font-weight:700">${m.emoji} ${m.label}</span><span style="color:#2DD4BF;font-size:14px;font-weight:800;font-family:monospace">${m.to}</span></div>`).join("")}
      <div style="color:#6b7280;font-size:11px;margin-top:12px;line-height:1.5;text-align:center">Send <strong style="color:#9ca3af">${fmt(total)}</strong> with any option above and put <strong style="color:#9ca3af">${orderRef}</strong> in the note.</div>
      <div style="color:#4b5563;font-size:10px;margin-top:10px;padding-top:10px;border-top:1px solid #1a3a34;line-height:1.5;text-align:center">${PAYMENT_NOTE}</div>
    </div>
    <p style="color:#2DD4BF;font-size:12px;margin-top:14px;text-align:center;line-height:1.6;font-weight:600">📦 Orders ship within 24 hours of confirmed payment — fast 2–3 day USPS shipping anywhere in the 48 US states.</p>
    <p style="color:#6b7280;font-size:12px;margin-top:8px;text-align:center;line-height:1.6">Already paid? Just reply to this email and we'll get it shipped. No card has been charged. Thank you!</p>
  </div>
  <div style="padding:18px 28px;text-align:center">
    <div style="color:#374151;font-size:11px;line-height:1.8">
      Questions? <a href="mailto:info@vertexresearchlabs.com" style="color:#2DD4BF;text-decoration:none">info@vertexresearchlabs.com</a><br/>
      All products are for laboratory research use only. Not for human or veterinary use.<br/>
      <a href="${SITE}" style="color:#4b5563;text-decoration:none">vertexresearchlabs.com</a>
    </div>
  </div>
</div></body></html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Vertex Research Labs <info@vertexresearchlabs.com>",
        reply_to: "info@vertexresearchlabs.com",
        to: [email],
        ...(bcc ? { bcc: Array.isArray(bcc) ? bcc : [bcc] } : {}),
        subject: `Reminder: complete your Vertex order ${orderRef} — ${fmt(total)}`,
        html,
      }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(result));

    try {
      await admin.from("email_log").insert({
        order_id: order.id, email_type: "payment_reminder", recipient: email,
        resend_id: result?.id || null, subject: `Reminder: complete your Vertex order ${orderRef}`,
      });
    } catch (_) { /* non-fatal */ }

    return new Response(JSON.stringify({ success: true, email, resend: result }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("send-payment-reminder error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
