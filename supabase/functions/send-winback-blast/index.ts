import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE = "https://vertexresearchlabs.com";
const LOGO_URL = "https://qgritvsluilqptgtvayv.supabase.co/storage/v1/object/public/email-assets/logo-avatar.png";

const REWARD_TIERS = [
  { points: 250, credit: 10 },
  { points: 500, credit: 20 },
  { points: 750, credit: 30 },
  { points: 1000, credit: 40 },
  { points: 1500, credit: 65 },
  { points: 2000, credit: 90 },
  { points: 3000, credit: 140 },
  { points: 5000, credit: 250 },
];

function bestUnlockedTier(balance: number) {
  return [...REWARD_TIERS].reverse().find(t => balance >= t.points) || null;
}

// Subject lines intentionally avoid dollar signs and "free" to stay out of Promotions
function buildSubjectLine(firstName: string, balance: number): string {
  const tier = bestUnlockedTier(balance);
  if (tier) return `${firstName}, you've got ${balance.toLocaleString()} points here`;
  return `${firstName} — your ${balance.toLocaleString()} points are waiting`;
}

function buildPlainText(opts: { firstName: string; balance: number; magicLink: string }): string {
  const { firstName, balance, magicLink } = opts;
  const tier = bestUnlockedTier(balance);
  const nextTier = REWARD_TIERS.find(t => balance < t.points);

  return `Hey ${firstName},

Wanted to reach out — you have ${balance.toLocaleString()} loyalty points in your account that you can put toward your next order.
${tier ? `\nYour current balance unlocks $${tier.credit} off, good on anything in the store. Free USPS shipping on orders $99 or more.\n` : `\nYou're ${(250 - balance).toLocaleString()} points away from your first reward. One order gets you there.\n`}
${nextTier ? `${REWARD_TIERS.find(t => balance < t.points)!.points - balance} more points puts you at $${nextTier.credit} off.\n` : ""}
Lots in stock right now — GHK-Cu, BPC-157, NAD+, Retatrutide, TB-500, and more.

Use your points here (logs you straight in):
${magicLink}

Thank you for your continued research support — it genuinely means a lot to us.

— Adam
Vertex Research Labs
${SITE}

Research Use Only. Not for human consumption.
Unsubscribe: ${SITE}/unsubscribe`;
}

function buildEmailHtml(opts: { firstName: string; balance: number; magicLink: string }): string {
  const { firstName, balance, magicLink } = opts;
  const tier = bestUnlockedTier(balance);
  const nextTier = REWARD_TIERS.find(t => balance < t.points);
  const ptsToNext = nextTier ? nextTier.points - balance : 0;

  const rewardBlock = tier
    ? `<div style="background:linear-gradient(135deg,#00B4D8,#0096b4);padding:20px 22px;border-radius:8px;margin:20px 0">
        <div style="color:#001215;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700">Your Unlocked Reward</div>
        <div style="color:#000;font-size:32px;font-weight:800;line-height:1.1;margin:6px 0">$${tier.credit} Vertex Credit</div>
        <div style="color:#00252b;font-size:13px">Good on anything sitewide — applies at checkout automatically.${nextTier ? ` ${ptsToNext.toLocaleString()} more points unlocks $${nextTier.credit} off.` : ''}</div>
      </div>`
    : `<div style="background:#111;border:1px solid #1f1f1f;padding:18px 20px;border-radius:8px;margin:20px 0">
        <div style="color:#888;font-size:13px">You're <strong style="color:#00B4D8">${(250 - balance).toLocaleString()} points</strong> away from your first $10 off. One order gets you there.</div>
      </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;-webkit-text-size-adjust:100%">
<div style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;background:#0a0a0a;color:#fff;max-width:560px;margin:0 auto;padding:28px 24px">

  <!-- Logo + wordmark -->
  <div style="text-align:center;margin-bottom:28px">
    <img src="${LOGO_URL}" alt="Vertex Research Labs" width="52" height="52"
         style="display:block;width:52px;height:52px;border-radius:50%;object-fit:cover;margin:0 auto 12px" />
    <div style="color:#00B4D8;font-size:10px;letter-spacing:3px;font-weight:700;text-transform:uppercase">Vertex Research Labs</div>
  </div>

  <!-- Greeting + headline -->
  <p style="color:#bbb;font-size:15px;margin:0 0 6px">Hey ${firstName},</p>
  <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0 0 16px;line-height:1.3">
    Don't let your ${balance.toLocaleString()} points go to waste.
  </h1>

  <!-- Points balance card -->
  <div style="background:#111;border:1px solid #1f1f1f;padding:20px;border-radius:8px;text-align:center;margin:0 0 4px">
    <div style="color:#666;font-size:11px;text-transform:uppercase;letter-spacing:2px">Your Balance</div>
    <div style="color:#00B4D8;font-size:44px;font-weight:800;line-height:1;margin:8px 0">${balance.toLocaleString()}</div>
    <div style="color:#888;font-size:13px">loyalty points</div>
  </div>

  <!-- Reward block -->
  ${rewardBlock}

  <!-- Body -->
  <p style="color:#bbb;font-size:15px;line-height:1.7;margin:0 0 24px">
    We've got a lot in stock right now — GHK-Cu, BPC-157, NAD+, Retatrutide, TB-500, Semax, and more. Your points apply to anything, sitewide. Free USPS shipping on orders over $99.
  </p>

  <!-- CTA -->
  <div style="text-align:center;margin:0 0 28px">
    <a href="${magicLink}"
       style="display:inline-block;background:#00B4D8;color:#000;font-size:16px;font-weight:700;text-decoration:none;padding:15px 36px;border-radius:6px;letter-spacing:0.2px">
      Use my points →
    </a>
    <p style="color:#555;font-size:12px;margin:10px 0 0">One click logs you straight in — no password needed.</p>
  </div>

  <!-- Product grid -->
  <hr style="border:none;border-top:1px solid #1a1a1a;margin:0 0 18px"/>
  <p style="color:#888;font-size:13px;font-weight:600;margin:0 0 10px">Popular right now:</p>
  <table width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 6px">
    <tr>
      <td style="padding:0 5px 6px 0;width:33%">
        <a href="${SITE}/product/retatrutide" style="display:block;background:#111;border:1px solid #1f1f1f;padding:11px 8px;border-radius:6px;text-decoration:none;color:#fff;text-align:center;font-size:13px;font-weight:600">Retatrutide</a>
      </td>
      <td style="padding:0 5px 6px;width:33%">
        <a href="${SITE}/product/mots-c" style="display:block;background:#111;border:1px solid #1f1f1f;padding:11px 8px;border-radius:6px;text-decoration:none;color:#fff;text-align:center;font-size:13px;font-weight:600">MOTS-C</a>
      </td>
      <td style="padding:0 0 6px 5px;width:33%">
        <a href="${SITE}/product/ghk-cu" style="display:block;background:#111;border:1px solid #1f1f1f;padding:11px 8px;border-radius:6px;text-decoration:none;color:#fff;text-align:center;font-size:13px;font-weight:600">GHK-Cu</a>
      </td>
    </tr>
    <tr>
      <td style="padding:0 5px 0 0;width:33%">
        <a href="${SITE}/product/nad-plus" style="display:block;background:#111;border:1px solid #1f1f1f;padding:11px 8px;border-radius:6px;text-decoration:none;color:#fff;text-align:center;font-size:13px;font-weight:600">NAD+</a>
      </td>
      <td style="padding:0 5px;width:33%">
        <a href="${SITE}/product/klow" style="display:block;background:#111;border:1px solid #1f1f1f;padding:11px 8px;border-radius:6px;text-decoration:none;color:#fff;text-align:center;font-size:13px;font-weight:600">KLOW Blend</a>
      </td>
      <td style="padding:0 0 0 5px;width:33%">
        <a href="${SITE}/product/wolverine-blend" style="display:block;background:#111;border:1px solid #1f1f1f;padding:11px 8px;border-radius:6px;text-decoration:none;color:#fff;text-align:center;font-size:13px;font-weight:600">Wolverine</a>
      </td>
    </tr>
  </table>

  <!-- Disclaimer -->
  <p style="color:#666;font-size:12px;margin:16px 0 0;font-style:italic">For research use only. Not for human consumption.</p>

  <!-- Sign-off -->
  <hr style="border:none;border-top:1px solid #1a1a1a;margin:20px 0"/>
  <p style="color:#888;font-size:14px;line-height:1.7;margin:0 0 4px">Thank you for your continued research support — it genuinely means a lot.</p>
  <p style="color:#777;font-size:14px;margin:0 0 24px">— Adam<br/>Vertex Research Labs</p>

  <!-- Footer -->
  <p style="color:#444;font-size:11px;text-align:center;margin:0;line-height:1.8">
    <a href="${SITE}" style="color:#555;text-decoration:none">vertexresearchlabs.com</a>
    &nbsp;·&nbsp;
    <a href="${SITE}/unsubscribe" style="color:#444;text-decoration:none">Unsubscribe</a>
  </p>
</div>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { preview = false, preview_email, dry_run = false, limit, bcc, target_email } = body;

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const FROM = "Adam @ Vertex Research Labs <info@vertexresearchlabs.com>";
    const LIST_UNSUB = `<${SITE}/unsubscribe>`;

    if (preview) {
      if (!preview_email) {
        return new Response(JSON.stringify({ error: "preview_email required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const fakeBalance = 750;
      const fakeFirst = "Alex";
      const fakeLink = `${SITE}/shop`;

      const subject = buildSubjectLine(fakeFirst, fakeBalance);
      const html = buildEmailHtml({ firstName: fakeFirst, balance: fakeBalance, magicLink: fakeLink });
      const text = buildPlainText({ firstName: fakeFirst, balance: fakeBalance, magicLink: fakeLink });

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          to: [preview_email],
          subject: `[PREVIEW] ${subject}`,
          html,
          text,
          headers: {
            "List-Unsubscribe": LIST_UNSUB,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        }),
      });
      const data = await res.json();
      return new Response(JSON.stringify({ success: true, mode: "preview", subject, resend: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let profilesQuery = admin
      .from("profiles")
      .select("id, email, full_name, points_balance, user_id")
      .gt("points_balance", 0);

    if (target_email) profilesQuery = profilesQuery.ilike("email", target_email);
    if (limit) profilesQuery = profilesQuery.limit(Number(limit));

    const { data: profiles, error: pErr } = await profilesQuery;
    if (pErr) throw pErr;

    const results: { email: string; status: string; subject?: string; error?: string }[] = [];

    for (const profile of profiles ?? []) {
      try {
        const firstName = (profile.full_name || "there").split(" ")[0];
        const balance: number = profile.points_balance;

        const magicLink = `${SITE}/shop`;

        const subject = buildSubjectLine(firstName, balance);
        const html = buildEmailHtml({ firstName, balance, magicLink });
        const text = buildPlainText({ firstName, balance, magicLink });

        if (dry_run) {
          results.push({ email: profile.email, status: "dry_run", subject });
          continue;
        }

        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: FROM,
            to: [profile.email],
            bcc: bcc ? [bcc] : undefined,
            subject,
            html,
            text,
            headers: {
              "List-Unsubscribe": LIST_UNSUB,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            },
          }),
        });
        const resendData = await resendRes.json();
        results.push({ email: profile.email, status: resendData.id ? "sent" : "error", subject });
      } catch (e: any) {
        results.push({ email: profile.email, status: "error", error: e.message });
      }
    }

    return new Response(
      JSON.stringify({ success: true, total: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
