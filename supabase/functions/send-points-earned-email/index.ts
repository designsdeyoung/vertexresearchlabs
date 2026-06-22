// Sends a "you just earned points" email after an order, showing balance,
// nearest unlock, and CTA to redeem. Used both for purchase points and referral bonuses.
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
    const { email, profileId, pointsEarned, reason, bcc } = await req.json();
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Lookup profile
    let profile;
    if (profileId) {
      const { data } = await admin.from("profiles")
        .select("id, email, full_name, points_balance")
        .eq("id", profileId).maybeSingle();
      profile = data;
    } else if (email) {
      const { data } = await admin.from("profiles")
        .select("id, email, full_name, points_balance")
        .ilike("email", email).maybeSingle();
      profile = data;
    }
    if (!profile) throw new Error("Profile not found");

    const balance = profile.points_balance;
    const firstName = (profile.full_name || "there").split(" ")[0];

    // Find best currently-unlocked tier and next tier
    const unlocked = [...REWARD_TIERS].reverse().find(t => balance >= t.points) || null;
    const next = REWARD_TIERS.find(t => balance < t.points) || null;
    const ptsToNext = next ? next.points - balance : 0;

    const unlockedBlock = unlocked
      ? `<div style="background:linear-gradient(135deg,#00B4D8,#0096b4);padding:18px;border-radius:8px;margin:18px 0">
          <div style="color:#001215;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:700">Currently Unlocked</div>
          <div style="color:#000;font-size:28px;font-weight:800;margin-top:4px">$${unlocked.credit} Vertex Credit</div>
          <div style="color:#001215;font-size:13px;margin-top:4px">Apply at checkout on any order $${unlocked.minCart}+</div>
        </div>`
      : `<div style="background:#111;border:1px solid #222;padding:18px;border-radius:8px;margin:18px 0">
          <div style="color:#888;font-size:13px">Earn ${250 - balance} more points to unlock your first $10 Vertex Credit.</div>
        </div>`;

    const nextBlock = next
      ? `<p style="color:#ccc;font-size:14px;margin:6px 0 22px">
          <strong style="color:#00B4D8">${ptsToNext} points</strong> away from <strong>$${next.credit} off</strong> — that's about $${Math.ceil(ptsToNext / 3)} more spent (or one referral) to unlock it.
        </p>`
      : `<p style="color:#ccc;font-size:14px;margin:6px 0 22px">You've hit the top tier — max it out at checkout.</p>`;

    const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;background:#0a0a0a;color:#fff;max-width:560px;margin:0 auto;padding:28px 24px">
  <div style="text-align:center;margin-bottom:24px">
    <div style="color:#00B4D8;font-size:11px;letter-spacing:3px;font-weight:700">VERTEX RESEARCH LABS</div>
  </div>
  <h1 style="color:#fff;font-size:26px;margin:0 0 8px;font-weight:800;line-height:1.2">
    🎉 Congrats ${firstName} — you just scored closer to free product.
  </h1>
  <p style="color:#bbb;font-size:15px;margin:0 0 20px">
    ${reason || `You just earned`} <strong style="color:#00B4D8">+${pointsEarned} points</strong>. Here's where you stand:
  </p>

  <div style="background:#111;border:1px solid #1f1f1f;padding:20px;border-radius:8px;text-align:center;margin:20px 0">
    <div style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:2px">Current Balance</div>
    <div style="color:#00B4D8;font-size:42px;font-weight:800;line-height:1;margin:8px 0">${balance.toLocaleString()}</div>
    <div style="color:#888;font-size:13px">loyalty points</div>
  </div>

  ${unlockedBlock}
  ${nextBlock}

  <div style="text-align:center;margin:28px 0">
    <a href="${SITE}/dashboard" style="background:#00B4D8;color:#000;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:700;display:inline-block">Redeem Your Points →</a>
  </div>

  <hr style="border:none;border-top:1px solid #1a1a1a;margin:28px 0"/>
  <p style="color:#888;font-size:13px;margin:0 0 12px;font-weight:600">Popular right now — stack more points:</p>
  <table width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 16px">
    <tr>
      <td style="padding:6px 6px 6px 0;width:33%">
        <a href="${SITE}/product/nad-plus-500" style="display:block;background:#111;border:1px solid #1f1f1f;padding:12px;border-radius:6px;text-decoration:none;color:#fff;text-align:center;font-size:13px;font-weight:600">NAD+ 500mg</a>
      </td>
      <td style="padding:6px;width:33%">
        <a href="${SITE}/product/bpc-157" style="display:block;background:#111;border:1px solid #1f1f1f;padding:12px;border-radius:6px;text-decoration:none;color:#fff;text-align:center;font-size:13px;font-weight:600">BPC-157</a>
      </td>
      <td style="padding:6px 0 6px 6px;width:33%">
        <a href="${SITE}/product/wolverine-blend" style="display:block;background:#111;border:1px solid #1f1f1f;padding:12px;border-radius:6px;text-decoration:none;color:#fff;text-align:center;font-size:13px;font-weight:600">Wolverine Blend</a>
      </td>
    </tr>
  </table>
  <p style="color:#666;font-size:12px;text-align:center;margin:8px 0 0">
    Tip: 3-packs save 15% AND multiply your points. <a href="${SITE}/shop" style="color:#00B4D8;text-decoration:none">Shop all →</a>
  </p>

  <hr style="border:none;border-top:1px solid #1a1a1a;margin:28px 0"/>
  <p style="color:#555;font-size:11px;text-align:center;margin:0">
    Research Use Only. Not for human consumption.<br/>
    Vertex Research Labs · <a href="${SITE}" style="color:#666">vertexresearchlabs.com</a>
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
        reply_to: "info@vertexresearchlabs.com",
        to: [profile.email],
        bcc: bcc ? [bcc] : undefined,
        subject: `+${pointsEarned} points — you're ${ptsToNext > 0 ? `${ptsToNext} away from $${next?.credit} off` : "at the top tier"}`,
        html,
      }),
    });
    const resendData = await resendRes.json();

    return new Response(JSON.stringify({ success: true, balance, resend: resendData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
