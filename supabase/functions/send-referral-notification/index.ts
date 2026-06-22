import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

const SITE = "https://vertexresearchlabs.com";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const {
      referrerProfileId,
      referrerEmail,
      customerName,
      customerEmail,
      subtotal,
      pointsEarned,
      multiplier,
      newBalance,
      isFirstReferral,
    } = await req.json();

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Lookup referrer profile for personalization
    let referrer: { email: string; full_name: string | null; points_balance: number } | null = null;
    if (referrerProfileId) {
      const { data } = await admin
        .from("profiles")
        .select("email, full_name, points_balance")
        .eq("id", referrerProfileId)
        .maybeSingle();
      referrer = data;
    }

    const toEmail = referrer?.email || referrerEmail;
    if (!toEmail) throw new Error("No referrer email");

    const balance = newBalance ?? referrer?.points_balance ?? pointsEarned;
    const referrerFirstName = (referrer?.full_name || "there").split(" ")[0];

    // Customer display: first name + last initial for privacy
    const nameParts = (customerName || customerEmail || "").trim().split(" ");
    const customerDisplay = nameParts.length >= 2
      ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
      : nameParts[0] || "your referral";

    // Best unlocked tier
    const unlocked = [...REWARD_TIERS].reverse().find((t) => balance >= t.points) || null;
    const next = REWARD_TIERS.find((t) => balance < t.points) || null;
    const ptsToNext = next ? next.points - balance : 0;

    const unlockedBlock = unlocked
      ? `<div style="background:linear-gradient(135deg,#00B4D8,#0096b4);padding:18px 20px;border-radius:10px;margin:20px 0;text-align:center">
          <div style="color:#001215;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;margin-bottom:6px">Unlocked Reward</div>
          <div style="color:#000;font-size:30px;font-weight:900;line-height:1">$${unlocked.credit} Vertex Credit</div>
          <div style="color:#001215;font-size:12px;margin-top:6px">Apply at checkout on any order $${unlocked.minCart}+</div>
        </div>`
      : `<div style="background:#111;border:1px solid #222;padding:16px 20px;border-radius:10px;margin:20px 0;text-align:center">
          <div style="color:#888;font-size:13px"><strong style="color:#00B4D8">${250 - balance}</strong> more points to unlock your first $10 Vertex Credit.</div>
        </div>`;

    const nextLine = next
      ? `<p style="color:#bbb;font-size:13px;margin:0 0 24px;text-align:center">
          <strong style="color:#00B4D8">${ptsToNext} pts</strong> away from unlocking <strong style="color:#fff">$${next.credit} off</strong>
        </p>`
      : `<p style="color:#bbb;font-size:13px;margin:0 0 24px;text-align:center">You've hit the top reward tier. Redeem at checkout!</p>`;

    const subjectSuffix = isFirstReferral
      ? `${customerDisplay} just placed their first order using your code`
      : `${customerDisplay} reordered — you earned ${pointsEarned} more pts`;

    const headlineVerb = isFirstReferral ? "just placed their first order" : "reordered";

    const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#0a0a0a;color:#fff;max-width:580px;margin:0 auto;padding:32px 24px">

  <!-- Brand header -->
  <div style="text-align:center;margin-bottom:28px">
    <div style="color:#00B4D8;font-size:11px;letter-spacing:3px;font-weight:700;margin-bottom:4px">VERTEX RESEARCH LABS</div>
    <div style="width:40px;height:2px;background:#00B4D8;margin:0 auto"></div>
  </div>

  <!-- Hero -->
  <div style="background:#0f1e22;border:1px solid #1a3a42;border-radius:12px;padding:28px 24px;margin-bottom:24px;text-align:center">
    <div style="font-size:36px;margin-bottom:12px">💸</div>
    <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0 0 8px;line-height:1.2">
      ${referrerFirstName}, your referral ${headlineVerb}!
    </h1>
    <p style="color:#8ecfdb;font-size:15px;margin:0">
      <strong style="color:#fff">${customerDisplay}</strong> shopped with your code
      ${multiplier > 3 ? `— you're earning at <strong style="color:#00B4D8">${multiplier}×</strong> the standard rate` : ""}
    </p>
  </div>

  <!-- Points earned this order -->
  <div style="background:#111;border:1px solid #1f1f1f;border-radius:10px;padding:20px 24px;margin-bottom:16px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <div>
        <div style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px">Their order subtotal</div>
        <div style="color:#fff;font-size:22px;font-weight:700">$${subtotal.toFixed(2)}</div>
      </div>
      <div style="color:#444;font-size:20px">×</div>
      <div style="text-align:center">
        <div style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px">Your multiplier</div>
        <div style="color:#00B4D8;font-size:22px;font-weight:700">${multiplier}×</div>
      </div>
      <div style="color:#444;font-size:20px">=</div>
      <div style="text-align:right">
        <div style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px">Points earned</div>
        <div style="color:#00B4D8;font-size:22px;font-weight:800">+${pointsEarned.toLocaleString()}</div>
      </div>
    </div>
    <div style="border-top:1px solid #222;padding-top:12px;display:flex;justify-content:space-between;align-items:center">
      <div style="color:#888;font-size:12px">New balance</div>
      <div style="color:#fff;font-size:20px;font-weight:800">${balance.toLocaleString()} <span style="color:#666;font-size:14px;font-weight:400">pts</span></div>
    </div>
  </div>

  ${unlockedBlock}
  ${nextLine}

  <!-- CTA -->
  <div style="text-align:center;margin:28px 0">
    <a href="${SITE}/dashboard" style="background:#00B4D8;color:#000;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:800;font-size:15px;display:inline-block;letter-spacing:0.5px">
      View My Rewards →
    </a>
  </div>

  <!-- Referral reminder -->
  <div style="background:#111;border:1px solid #1f1f1f;border-radius:10px;padding:18px 20px;margin-bottom:24px">
    <div style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;font-weight:700">Keep earning — share your code</div>
    <p style="color:#ccc;font-size:14px;margin:0 0 10px">
      Every time anyone uses your code you earn <strong style="color:#00B4D8">${multiplier}× points</strong> on their order — for life.
    </p>
    <p style="color:#555;font-size:12px;margin:0">
      Share your link: <a href="${SITE}?ref=${referrerEmail}" style="color:#00B4D8;text-decoration:none">${SITE}?ref=[your-code]</a>
    </p>
  </div>

  <hr style="border:none;border-top:1px solid #1a1a1a;margin:24px 0"/>
  <p style="color:#555;font-size:11px;text-align:center;margin:0;line-height:1.6">
    Research Use Only. Not for human consumption.<br/>
    Vertex Research Labs · <a href="${SITE}" style="color:#666;text-decoration:none">vertexresearchlabs.com</a>
  </p>
</div>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Vertex Research Labs <info@vertexresearchlabs.com>",
        to: [toEmail],
        subject: `🔥 +${pointsEarned} pts — ${subjectSuffix}`,
        html,
      }),
    });

    const resendData = await resendRes.json();
    return new Response(JSON.stringify({ success: true, resend: resendData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("send-referral-notification error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
