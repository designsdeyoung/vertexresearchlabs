import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE = "https://vertexresearchlabs.com";
const LOGO_URL = "https://qgritvsluilqptgtvayv.supabase.co/storage/v1/object/public/email-assets/logo-avatar.png";
const REWARD_TIERS = [
  { points: 250, credit: 10, minCart: 75 },
  { points: 500, credit: 20, minCart: 100 },
  { points: 750, credit: 30, minCart: 120 },
  { points: 1000, credit: 40, minCart: 150 },
  { points: 1500, credit: 65, minCart: 200 },
  { points: 2000, credit: 90, minCart: 250 },
  { points: 3000, credit: 140, minCart: 350 },
  { points: 5000, credit: 250, minCart: 500 },
];

// Shared points header bar — shown at top of every email
function pointsHeader(balance: number, firstName: string) {
  const unlocked = [...REWARD_TIERS].reverse().find(t => balance >= t.points) || null;
  const next = REWARD_TIERS.find(t => balance < t.points) || null;
  const ptsToNext = next ? next.points - balance : 0;

  const rewardLine = unlocked
    ? `<span style="color:#ffd700;font-weight:700">🏆 $${unlocked.credit} OFF unlocked</span> &nbsp;·&nbsp; valid on orders $${unlocked.minCart}+`
    : next
    ? `<span style="color:#2DD4BF">${ptsToNext} pts</span> away from your first $${next.credit} reward`
    : `You've hit the top tier — max it out at checkout!`;

  return `
<div style="background:linear-gradient(135deg,#0d1f1c 0%,#0a1a17 100%);border-bottom:1px solid #1a3a34;padding:12px 24px;text-align:center">
  <span style="color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:600">
    ${firstName}'s Vertex Rewards
  </span>
  <div style="margin-top:4px">
    <span style="color:#2DD4BF;font-size:22px;font-weight:800">${balance.toLocaleString()}</span>
    <span style="color:#6b7280;font-size:13px"> pts</span>
    <span style="color:#374151;font-size:13px"> &nbsp;·&nbsp; </span>
    <span style="font-size:12px;color:#9ca3af">${rewardLine}</span>
  </div>
</div>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { orderId, trackingNumber, trackingUrl, toEmail, toName } = await req.json();
    if (!orderId) throw new Error("orderId required");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Load order + profile
    const { data: order } = await admin
      .from("orders")
      .select("*, profiles!orders_profile_id_fkey(id, full_name, email, points_balance)")
      .eq("id", orderId)
      .single();

    const profile = order?.profiles;
    const email = toEmail || profile?.email;
    const name = toName || profile?.full_name || "Researcher";
    if (!email) throw new Error("No email for order");

    const firstName = name.split(" ")[0];
    const balance = profile?.points_balance ?? 0;
    const tracking = trackingNumber || order?.tracking_number;
    const trackUrl = trackingUrl || order?.tracking_url;

    const items = (() => {
      try {
        return Array.isArray(order.items) ? order.items : JSON.parse(order.items || "[]");
      } catch { return []; }
    })();

    const itemRows = items.map((item: any) => {
      const name = item.productName || item.name || "Item";
      const size = item.size ? ` · ${item.size}` : "";
      const qty = item.quantity || 1;
      return `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #1f1f1f;color:#e5e7eb;font-size:13px">${name}${size}</td>
        <td style="padding:8px 0;border-bottom:1px solid #1f1f1f;color:#9ca3af;font-size:13px;text-align:center">×${qty}</td>
      </tr>`;
    }).join("");

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;background:#0d0d0d;border:1px solid #1f1f1f;border-radius:8px;overflow:hidden">

  ${pointsHeader(balance, firstName)}

  <!-- Logo -->
  <div style="text-align:center;padding:22px 0 4px">
    <img src="${LOGO_URL}" alt="Vertex Research Labs" width="52" height="52" style="display:inline-block;border-radius:12px"/>
    <div style="color:#2DD4BF;font-size:10px;letter-spacing:3px;font-weight:700;text-transform:uppercase;margin-top:8px">Vertex Research Labs</div>
  </div>

  <!-- Header -->
  <div style="padding:6px 28px 20px;border-bottom:1px solid #1a1a1a">
    <div style="font-size:28px;font-weight:800;color:#fff;line-height:1.2">📦 Your order has shipped, ${firstName}!</div>
    <div style="color:#9ca3af;font-size:14px;margin-top:8px">Order ${order?.order_number || orderId.slice(0,8)} is on its way via USPS Priority Mail. Watch it move in real time below.</div>
  </div>

  <!-- Live tracker CTA (our own animated tracker) -->
  <div style="padding:24px 28px;border-bottom:1px solid #1a1a1a;text-align:center">
    <div style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px">Tracking Number</div>
    <div style="background:#111;border:1px solid #2DD4BF33;border-radius:8px;padding:14px 20px;margin-bottom:16px">
      <span style="font-family:monospace;font-size:16px;font-weight:700;color:#fff;letter-spacing:1px">${tracking || "—"}</span>
    </div>
    <a href="${SITE}/track?t=${tracking}" style="display:inline-block;background:#2DD4BF;color:#000;font-weight:800;font-size:15px;padding:15px 40px;border-radius:8px;text-decoration:none;letter-spacing:0.3px">📡 Track My Package — Live</a>
    <div style="color:#4b5563;font-size:11px;margin-top:10px">Real-time progress · no login needed</div>
    ${trackUrl ? `<div style="margin-top:8px"><a href="${trackUrl}" style="color:#6b7280;font-size:11px;text-decoration:underline">or view on USPS.com</a></div>` : ""}
  </div>

  <!-- Items -->
  ${itemRows ? `<div style="padding:24px 28px;border-bottom:1px solid #1a1a1a">
    <div style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px">Your Items</div>
    <table style="width:100%;border-collapse:collapse">${itemRows}</table>
  </div>` : ""}

  <!-- Redeem CTA -->
  <div style="padding:24px 28px;border-bottom:1px solid #1a1a1a;text-align:center">
    <div style="color:#9ca3af;font-size:13px;margin-bottom:14px">
      You have <strong style="color:#2DD4BF">${balance.toLocaleString()} pts</strong> ready to use on your next order.
    </div>
    <a href="${SITE}/dashboard" style="display:inline-block;background:#111;border:1px solid #2DD4BF44;color:#2DD4BF;font-weight:700;font-size:13px;padding:11px 28px;border-radius:6px;text-decoration:none">View My Rewards →</a>
  </div>

  <!-- Footer -->
  <div style="padding:20px 28px;text-align:center">
    <div style="color:#374151;font-size:11px;line-height:1.8">
      Questions? <a href="mailto:info@vertexresearchlabs.com" style="color:#2DD4BF;text-decoration:none">info@vertexresearchlabs.com</a><br/>
      All products are for laboratory research use only.<br/>
      <a href="${SITE}" style="color:#4b5563;text-decoration:none">vertexresearchlabs.com</a>
    </div>
  </div>

</div>
</body></html>`;

    const resendKey = Deno.env.get("RESEND_API_KEY")!;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Vertex Research Labs <info@vertexresearchlabs.com>",
        reply_to: "info@vertexresearchlabs.com",
        to: [email],
        subject: `📦 Your order has shipped, ${firstName}! Track it live`,
        html,
      }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(result));

    return new Response(JSON.stringify({ success: true, email, resend: result }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("send-shipped-email error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
