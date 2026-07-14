import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Sends a customer a one-tap magic-login email that drops them straight into
// their account with their points ready to redeem. Input: { profileId | email, bcc? }.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE = "https://vertexresearchlabs.com";
const LOGO_URL = "https://qgritvsluilqptgtvayv.supabase.co/storage/v1/object/public/email-assets/logo-avatar.png";
const REWARD_TIERS = [
  { points: 250, credit: 10, minCart: 75 }, { points: 500, credit: 20, minCart: 100 },
  { points: 750, credit: 30, minCart: 120 }, { points: 1000, credit: 40, minCart: 150 },
  { points: 1500, credit: 65, minCart: 200 }, { points: 2000, credit: 90, minCart: 250 },
  { points: 3000, credit: 140, minCart: 350 }, { points: 5000, credit: 250, minCart: 500 },
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { profileId, email, bcc, addProductId, addQty, productLabel, unitPrice } = await req.json();
    if (!profileId && !email) throw new Error("profileId or email required");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const sel = "id, email, full_name, points_balance, magic_token";
    const { data: profile } = profileId
      ? await admin.from("profiles").select(sel).eq("id", profileId).maybeSingle()
      : await admin.from("profiles").select(sel).ilike("email", email).maybeSingle();
    if (!profile?.email) throw new Error("profile/email not found");
    if (!profile.magic_token) throw new Error("profile has no magic_token");

    const firstName = (profile.full_name || "there").split(" ")[0];
    const balance = profile.points_balance ?? 0;
    const qty = addQty ?? 1;
    const loginUrl = addProductId
      ? `${SITE}/magic?t=${profile.magic_token}&add=${encodeURIComponent(addProductId)}&qty=${qty}`
      : `${SITE}/magic?t=${profile.magic_token}`;
    const unlocked = [...REWARD_TIERS].reverse().find((t) => balance >= t.points) || null;
    const next = REWARD_TIERS.find((t) => balance < t.points) || null;

    const orderSubtotal = productLabel && unitPrice ? unitPrice * qty : null;
    const gapToMin = orderSubtotal !== null && unlocked ? Math.max(unlocked.minCart - orderSubtotal, 0) : null;

    const pickBlock = orderSubtotal !== null
      ? `<div style="background:#111;border:1px solid #1f1f1f;border-radius:12px;padding:18px 22px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between">
           <div style="text-align:left">
             <div style="color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700">Picked out for you</div>
             <div style="color:#e5e7eb;font-size:15px;font-weight:700;margin-top:3px">${qty}× ${productLabel}</div>
           </div>
           <div style="color:#2DD4BF;font-size:17px;font-weight:800">$${orderSubtotal.toFixed(2)}</div>
         </div>
         ${gapToMin !== null
            ? gapToMin > 0
              ? `<div style="color:#9ca3af;font-size:12px;margin:-6px 0 14px">Add $${gapToMin.toFixed(2)} more to your cart to unlock your $${unlocked!.credit} credit (min. order $${unlocked!.minCart})</div>`
              : `<div style="color:#2DD4BF;font-size:12px;margin:-6px 0 14px">You're over the minimum — apply your $${unlocked!.credit} credit at checkout!</div>`
            : ""}`
      : "";

    const rewardBlock = unlocked
      ? `<div style="background:linear-gradient(135deg,#0d2620 0%,#0a1a17 100%);border:1px solid #1f4d42;border-radius:12px;padding:22px;text-align:center;margin-bottom:18px">
           <div style="color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;margin-bottom:6px">You've unlocked</div>
           <div style="color:#ffd700;font-size:34px;font-weight:900;line-height:1">$${unlocked.credit} OFF</div>
           <div style="color:#9ca3af;font-size:13px;margin-top:6px">Ready to use now · min. order $${unlocked.minCart}</div>
         </div>`
      : `<div style="background:#111;border:1px solid #1f1f1f;border-radius:12px;padding:22px;text-align:center;margin-bottom:18px">
           <div style="color:#e5e7eb;font-size:15px;font-weight:700">You have ${balance.toLocaleString()} points</div>
           ${next ? `<div style="color:#9ca3af;font-size:13px;margin-top:4px">${(next.points - balance).toLocaleString()} more to unlock $${next.credit} off</div>` : ""}
         </div>`;

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;background:#0d0d0d;border:1px solid #1f1f1f;border-radius:8px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#0d1f1c 0%,#0a1a17 100%);border-bottom:1px solid #1a3a34;padding:12px 24px;text-align:center">
    <span style="color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:600">${firstName}'s Vertex Rewards</span>
    <div style="margin-top:4px"><span style="color:#2DD4BF;font-size:24px;font-weight:800">${balance.toLocaleString()}</span><span style="color:#6b7280;font-size:13px"> points</span></div>
  </div>
  <div style="text-align:center;padding:24px 0 6px">
    <img src="${LOGO_URL}" alt="Vertex Research Labs" width="52" height="52" style="display:inline-block;border-radius:12px"/>
    <div style="color:#2DD4BF;font-size:10px;letter-spacing:3px;font-weight:700;text-transform:uppercase;margin-top:8px">Vertex Research Labs</div>
  </div>
  <div style="padding:8px 28px 4px">
    <div style="font-size:25px;font-weight:800;color:#fff;line-height:1.25">${productLabel ? `Your ${productLabel} is waiting, ${firstName} 🔬` : `Ready to order, ${firstName}? 🔬`}</div>
    <div style="color:#9ca3af;font-size:14px;margin-top:8px;line-height:1.6">Your points are loaded and waiting. Tap below to log in instantly — no password — and they'll apply at checkout${productLabel ? ", with your pick already in the cart" : ""}.</div>
  </div>
  <div style="padding:18px 28px 24px;text-align:center">
    ${pickBlock}
    ${rewardBlock}
    <a href="${loginUrl}" style="display:inline-block;background:#2DD4BF;color:#000;font-weight:800;font-size:15px;padding:15px 40px;border-radius:8px;text-decoration:none;letter-spacing:0.3px">${productLabel ? "Log in &amp; shop my pick →" : "Log in &amp; shop with my points →"}</a>
    <div style="color:#4b5563;font-size:11px;margin-top:10px">One tap — no password needed · points never expire</div>
  </div>
  <div style="padding:18px 28px;text-align:center;border-top:1px solid #1a1a1a">
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
        to: [profile.email],
        ...(bcc ? { bcc: Array.isArray(bcc) ? bcc : [bcc] } : {}),
        subject: productLabel
          ? `${firstName}, your ${qty}x ${productLabel} pick is ready — log in & shop`
          : `${firstName}, your ${balance.toLocaleString()} points are ready — log in & shop`,
        html,
      }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(result));

    return new Response(JSON.stringify({ success: true, email: profile.email, balance, resend: result }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("send-points-login-email error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
