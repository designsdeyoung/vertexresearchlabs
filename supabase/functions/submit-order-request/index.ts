import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Emergency manual-invoice checkout fallback.
// Creates an order with status "invoice_pending" (NOT paid, no points awarded,
// no Stripe), then emails the admin + the customer. Inventory is display-only
// in this project, so nothing is reserved or decremented.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "info@vertexresearchlabs.com"; // support@ does not exist; info@ is monitored
const SITE = "https://vertexresearchlabs.com";
const LOGO_URL = "https://qgritvsluilqptgtvayv.supabase.co/storage/v1/object/public/email-assets/logo-avatar.png";

// Temporary payment rails while card processing is paused. Offer several so the
// customer pays with whatever app they already have. Only `enabled` methods show.
// To add Cash App / Venmo: set the handle and flip enabled to true, then redeploy.
const PAYMENT_RECIPIENT = "Adam DeYoung";
interface PayMethod { id: string; label: string; emoji: string; to: string; hint: string; enabled: boolean; }
const PAYMENT_METHODS: PayMethod[] = [
  { id: "cashapp",   label: "Cash App",   emoji: "💵", to: "$CASHTAG_HERE", hint: "Open Cash App → Pay → enter the $cashtag", enabled: false },
  { id: "venmo",     label: "Venmo",      emoji: "🔵", to: "@HANDLE_HERE",  hint: "Open Venmo → Pay → enter the username", enabled: false },
  { id: "applecash", label: "Apple Cash", emoji: "🍏", to: "(727) 291-2893", hint: "iPhone Messages → send via Apple Cash to this number", enabled: true },
  { id: "zelle",     label: "Zelle",      emoji: "🏦", to: "(727) 291-2893", hint: "Bank app → Zelle → send to this number", enabled: true },
];
const PAYMENT_NOTE = `Payments go to ${PAYMENT_RECIPIENT} (owner of Vertex Research Labs) — that's the name you'll see. Always add your order number in the note so we can match your payment.`;

interface ReqItem { productId?: string; productName: string; size?: string; price: number; quantity: number; lineTotal: number; }
interface ReqBody {
  customer: {
    fullName: string; email: string; phoneNumber: string; organization?: string;
    addressLine1: string; addressLine2?: string; city: string; state: string; zipCode: string; country: string; notes?: string;
  };
  eligibilityType?: string | null;
  items: ReqItem[];
  subtotal: number; shipping: number; tax?: number; total: number;
  marketingConsent?: boolean;
}

const fmt = (n: number) => `$${Number(n || 0).toFixed(2)}`;

async function sendEmail(resendKey: string, opts: { to: string; subject: string; html: string; replyTo?: string }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Vertex Research Labs <info@vertexresearchlabs.com>",
      reply_to: opts.replyTo || "info@vertexresearchlabs.com",
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
    }),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, json };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body: ReqBody = await req.json();
    const { customer, items, subtotal, shipping, total } = body;
    const tax = body.tax || 0;

    if (!customer?.email || !customer?.fullName || !Array.isArray(items) || items.length === 0) {
      throw new Error("Missing required fields: customer name/email and items");
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Link to a profile so the customer's email is stored and tracking emails
    // (shipped / in-transit / delivered) can reach them. Silently create an
    // account if none exists — same pattern as paid orders.
    let profileId: string | null = null;
    try {
      const email = customer.email.trim();
      const { data: existingUsers } = await admin.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find((u) => (u.email || "").toLowerCase() === email.toLowerCase());

      let userId = existingUser?.id ?? null;
      if (!userId) {
        const { data: newUser } = await admin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { full_name: customer.fullName },
        });
        userId = newUser?.user?.id ?? null;
      }

      if (userId) {
        const { data: prof } = await admin
          .from("profiles").select("id").eq("user_id", userId).maybeSingle();
        if (prof) {
          profileId = prof.id;
        } else {
          const { data: newProf } = await admin
            .from("profiles")
            .insert({ user_id: userId, email, full_name: customer.fullName, points_balance: 0, lifetime_points: 0 })
            .select("id").single();
          profileId = newProf?.id ?? null;
        }
      }
    } catch (e) {
      console.error("profile link/create failed (non-fatal):", e);
      // Fall back to email-only profile match so we still link if possible
      try {
        const { data: prof } = await admin.from("profiles").select("id").ilike("email", customer.email).maybeSingle();
        profileId = prof?.id ?? null;
      } catch (_) { /* noop */ }
    }

    // Create the order — NOT paid, no points, manual-invoice payment method
    const { data: order, error: orderErr } = await admin
      .from("orders")
      .insert({
        profile_id: profileId,
        items: JSON.stringify(items),
        subtotal,
        shipping,
        total,
        credit_applied: 0,
        points_earned: 0,
        status: "invoice_pending",
        is_autoship: false,
        payment_method: "manual_invoice",
        paid_at: null,
        shipping_name: customer.fullName,
        shipping_address1: customer.addressLine1,
        shipping_address2: customer.addressLine2 || null,
        shipping_city: customer.city,
        shipping_state: customer.state,
        shipping_zip: customer.zipCode,
      })
      .select("id, order_number")
      .single();

    if (orderErr) throw new Error(`Failed to create order request: ${orderErr.message}`);

    const orderRef = order.order_number || order.id.slice(0, 8);
    const resendKey = Deno.env.get("RESEND_API_KEY")!;
    const enabledMethods = PAYMENT_METHODS.filter((m) => m.enabled);
    const methodsSummary = enabledMethods.map((m) => `${m.label} ${m.to}`).join(" · ");

    const itemRowsAdmin = items.map((i) =>
      `<tr><td style="padding:4px 8px;border-bottom:1px solid #eee">${i.productName}${i.size ? ` · ${i.size}` : ""}</td><td style="padding:4px 8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td><td style="padding:4px 8px;border-bottom:1px solid #eee;text-align:right">${fmt(i.lineTotal)}</td></tr>`
    ).join("");

    const addr = [customer.addressLine1, customer.addressLine2, `${customer.city}, ${customer.state} ${customer.zipCode}`, customer.country].filter(Boolean).join("<br/>");

    // 1) Admin notification
    const adminHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111">
  <h2 style="margin:0 0 4px">🧾 New Order Request (manual invoice)</h2>
  <p style="color:#666;margin:0 0 16px">Order ${orderRef} · status <strong>invoice_pending</strong> · Supabase ID <code>${order.id}</code></p>
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
    <thead><tr><th style="text-align:left;padding:4px 8px;border-bottom:2px solid #000">Item</th><th style="padding:4px 8px;border-bottom:2px solid #000">Qty</th><th style="text-align:right;padding:4px 8px;border-bottom:2px solid #000">Total</th></tr></thead>
    <tbody>${itemRowsAdmin}</tbody>
  </table>
  <table style="width:100%;margin-bottom:16px">
    <tr><td style="text-align:right;color:#666">Subtotal</td><td style="text-align:right;width:90px">${fmt(subtotal)}</td></tr>
    <tr><td style="text-align:right;color:#666">Shipping</td><td style="text-align:right">${fmt(shipping)}</td></tr>
    ${tax ? `<tr><td style="text-align:right;color:#666">Tax</td><td style="text-align:right">${fmt(tax)}</td></tr>` : ""}
    <tr><td style="text-align:right;font-weight:700;border-top:2px solid #000;padding-top:4px">Total</td><td style="text-align:right;font-weight:700;border-top:2px solid #000;padding-top:4px">${fmt(total)}</td></tr>
  </table>
  <h3 style="margin:0 0 6px">Customer</h3>
  <p style="margin:0 0 16px;line-height:1.6">
    <strong>${customer.fullName}</strong><br/>
    ${customer.email}<br/>
    ${customer.phoneNumber || "no phone"}<br/>
    ${customer.organization ? customer.organization + "<br/>" : ""}
    <br/>${addr}
  </p>
  ${customer.notes ? `<p style="background:#f5f5f5;padding:10px;border-radius:6px"><strong>Notes:</strong> ${customer.notes}</p>` : ""}
  <p style="background:#eafaf3;padding:10px;border-radius:6px;color:#0f6e56;font-size:13px">
    ✅ A payment invoice for <strong>${fmt(total)}</strong> was automatically emailed to the customer. Options: ${methodsSummary} · memo ${orderRef}.
    When the payment lands, mark the order paid: <code>update orders set status='confirmed', paid_at=now() where order_number='${orderRef}';</code>
  </p>
</div>`;

    const adminRes = await sendEmail(resendKey, {
      to: ADMIN_EMAIL,
      subject: `🧾 Order Request ${orderRef} — ${customer.fullName} — ${fmt(total)}`,
      html: adminHtml,
      replyTo: customer.email,
    });

    // 2) Customer confirmation
    const custItemRows = items.map((i) =>
      `<tr><td style="padding:6px 0;border-bottom:1px solid #1f1f1f;color:#e5e7eb;font-size:13px">${i.productName}${i.size ? ` · ${i.size}` : ""}</td><td style="padding:6px 0;border-bottom:1px solid #1f1f1f;color:#9ca3af;font-size:13px;text-align:center">×${i.quantity}</td><td style="padding:6px 0;border-bottom:1px solid #1f1f1f;color:#9ca3af;font-size:13px;text-align:right">${fmt(i.lineTotal)}</td></tr>`
    ).join("");

    const custHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;background:#0d0d0d;border:1px solid #1f1f1f;border-radius:8px;overflow:hidden">

  <!-- Logo -->
  <div style="text-align:center;padding:24px 0 6px">
    <img src="${LOGO_URL}" alt="Vertex Research Labs" width="52" height="52" style="display:inline-block;border-radius:12px"/>
    <div style="color:#2DD4BF;font-size:10px;letter-spacing:3px;font-weight:700;text-transform:uppercase;margin-top:8px">Vertex Research Labs</div>
  </div>

  <!-- Header -->
  <div style="padding:6px 28px 18px;border-bottom:1px solid #1a1a1a">
    <div style="font-size:24px;font-weight:800;color:#fff;line-height:1.2">Your invoice — ${orderRef}</div>
    <div style="color:#9ca3af;font-size:14px;margin-top:8px;line-height:1.5">
      Thank you, ${customer.fullName.split(" ")[0]}! Your order is reserved. To complete it,
      please send payment by <strong style="color:#fff">Zelle</strong> using the instructions below.
    </div>
  </div>

  <!-- Items -->
  <div style="padding:20px 28px;border-bottom:1px solid #1a1a1a">
    <div style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px">Order Summary</div>
    <table style="width:100%;border-collapse:collapse">${custItemRows}</table>
    <table style="width:100%;margin-top:10px">
      <tr><td style="text-align:right;color:#9ca3af;font-size:13px;padding:2px 0">Subtotal</td><td style="text-align:right;color:#e5e7eb;font-size:13px;width:90px">${fmt(subtotal)}</td></tr>
      <tr><td style="text-align:right;color:#9ca3af;font-size:13px;padding:2px 0">Shipping</td><td style="text-align:right;color:#e5e7eb;font-size:13px">${fmt(shipping)}</td></tr>
      ${tax ? `<tr><td style="text-align:right;color:#9ca3af;font-size:13px;padding:2px 0">Tax</td><td style="text-align:right;color:#e5e7eb;font-size:13px">${fmt(tax)}</td></tr>` : ""}
      <tr><td style="text-align:right;color:#fff;font-weight:700;font-size:15px;padding-top:6px;border-top:1px solid #1f1f1f">Total Due</td><td style="text-align:right;color:#2DD4BF;font-weight:800;font-size:15px;padding-top:6px;border-top:1px solid #1f1f1f">${fmt(total)}</td></tr>
    </table>
  </div>

  <!-- Payment instructions — pay by any enabled method -->
  <div style="padding:24px 28px;border-bottom:1px solid #1a1a1a">
    <div style="background:linear-gradient(135deg,#0d2620 0%,#0a1a17 100%);border:1px solid #1f4d42;border-radius:12px;padding:24px">
      <div style="color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;margin-bottom:14px;text-align:center">Pay by any of these</div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <tr><td style="text-align:left;color:#9ca3af;font-size:13px;padding:6px 0;border-bottom:1px solid #1a3a34">Amount</td><td style="text-align:right;color:#ffd700;font-size:20px;font-weight:900;padding:6px 0;border-bottom:1px solid #1a3a34">${fmt(total)}</td></tr>
        <tr><td style="text-align:left;color:#9ca3af;font-size:13px;padding:6px 0">Note / memo</td><td style="text-align:right;color:#fff;font-size:14px;font-weight:700;padding:6px 0">${orderRef}</td></tr>
      </table>
      ${enabledMethods.map((m) => `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:#0a1714;border:1px solid #16302a;border-radius:8px;padding:11px 14px;margin-bottom:8px">
          <span style="color:#e5e7eb;font-size:14px;font-weight:700">${m.emoji} ${m.label}</span>
          <span style="color:#2DD4BF;font-size:14px;font-weight:800;font-family:monospace">${m.to}</span>
        </div>`).join("")}
      <div style="color:#6b7280;font-size:11px;margin-top:12px;line-height:1.5;text-align:center">
        Send <strong style="color:#9ca3af">${fmt(total)}</strong> with any option above and put
        <strong style="color:#9ca3af">${orderRef}</strong> in the note so we can match your order.
      </div>
      <div style="color:#4b5563;font-size:10px;margin-top:10px;padding-top:10px;border-top:1px solid #1a3a34;line-height:1.5;text-align:center">${PAYMENT_NOTE}</div>
    </div>
    <p style="color:#6b7280;font-size:12px;margin-top:14px;text-align:center;line-height:1.6">
      Once we receive your Zelle payment, your order ships within 1 business day and your loyalty points are credited. No card has been charged.
    </p>
  </div>

  <!-- Footer -->
  <div style="padding:18px 28px;text-align:center">
    <div style="color:#374151;font-size:11px;line-height:1.8">
      Questions or paid already? Reply to this email or contact <a href="mailto:info@vertexresearchlabs.com" style="color:#2DD4BF;text-decoration:none">info@vertexresearchlabs.com</a><br/>
      All products are for laboratory research use only. Not for human or veterinary use.<br/>
      <a href="${SITE}" style="color:#4b5563;text-decoration:none">vertexresearchlabs.com</a>
    </div>
  </div>
</div></body></html>`;

    const invoiceSubject = `Your Vertex Research Labs invoice ${orderRef} — ${fmt(total)} (pay by app)`;
    const custRes = await sendEmail(resendKey, {
      to: customer.email,
      subject: invoiceSubject,
      html: custHtml,
    });

    try {
      await admin.from("email_log").insert({
        order_id: order.id, profile_id: profileId,
        email_type: "invoice", recipient: customer.email,
        resend_id: custRes.json?.id || null, subject: invoiceSubject,
      });
    } catch (_) { /* logging is non-fatal */ }

    return new Response(JSON.stringify({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      adminEmailSent: adminRes.ok,
      customerEmailSent: custRes.ok,
      payment: {
        amount: total,
        memo: orderRef,
        note: PAYMENT_NOTE,
        methods: enabledMethods.map((m) => ({ id: m.id, label: m.label, emoji: m.emoji, to: m.to })),
      },
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("submit-order-request error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
