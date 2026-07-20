// One-off admin tool: create a manual cash order, account, award points, and send magic link
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const body = await req.json();
    const {
      email,
      fullName,
      items,
      subtotal,
      shipping = 0,
      total,
      discountAmount = 0,
      discountCode = null,
      pointsEarned,
      shippingAddress = null,
      // When the order was physically for someone else (e.g. a friend/family
      // member) but the points go to this account holder, name them here so the
      // email reads "Thank you for <orderForName>'s order".
      orderForName = null,
      // Standing rule: BCC the ops inbox on manually-sent customer emails.
      bcc = "designsdeyoung@gmail.com",
    } = body;

    if (!email || !fullName) {
      return new Response(
        JSON.stringify({ error: "email and fullName are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Find or create auth user. listUsers() is paginated (50/page), so a
    // first-page-only lookup misses users once the base grows — check the
    // profiles table first, then walk every page before creating.
    let userId: string | undefined;
    const { data: profRows } = await admin
      .from("profiles")
      .select("user_id")
      .ilike("email", email)
      .not("user_id", "is", null)
      .limit(1);
    userId = profRows?.[0]?.user_id ?? undefined;
    for (let page = 1; !userId; page++) {
      const { data: list, error: luErr } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
      if (luErr) throw luErr;
      userId = list?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
      if (!list?.users?.length || list.users.length < 1000) break;
    }
    if (!userId) {
      const { data: newUser, error: cuErr } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });
      if (cuErr) throw cuErr;
      userId = newUser.user!.id;
    }

    // 2. Find or create profile
    let { data: profile } = await admin
      .from("profiles")
      .select("id, points_balance, lifetime_points")
      .eq("user_id", userId)
      .maybeSingle();
    if (!profile) {
      const { data: np, error: pErr } = await admin
        .from("profiles")
        .insert({ user_id: userId, email, full_name: fullName, points_balance: 0, lifetime_points: 0 })
        .select("id, points_balance, lifetime_points")
        .single();
      if (pErr) throw pErr;
      profile = np;
    }

    // 3. Insert order (store the shipping address so it can be fulfilled)
    const { data: order, error: oErr } = await admin
      .from("orders")
      .insert({
        profile_id: profile.id,
        items: JSON.stringify(items),
        subtotal,
        shipping,
        total,
        credit_applied: 0,
        points_earned: pointsEarned,
        status: "confirmed",
        is_autoship: false,
        payment_method: "cash",
        discount_amount: discountAmount,
        discount_code: discountCode,
        paid_at: new Date().toISOString(),
        shipping_name: shippingAddress?.name ?? fullName,
        shipping_address1: shippingAddress?.address1 ?? null,
        shipping_address2: shippingAddress?.address2 ?? null,
        shipping_city: shippingAddress?.city ?? null,
        shipping_state: shippingAddress?.state ?? null,
        shipping_zip: shippingAddress?.zip ?? null,
      })
      .select("id, order_number")
      .single();
    if (oErr) throw oErr;

    // 4. Award points
    await admin.from("points_transactions").insert({
      profile_id: profile.id,
      amount: pointsEarned,
      type: "purchase",
      description: `Order ${order.order_number} — cash, 3× bonus`,
      order_reference: order.id,
    });
    await admin
      .from("profiles")
      .update({
        points_balance: profile.points_balance + pointsEarned,
        lifetime_points: profile.lifetime_points + pointsEarned,
      })
      .eq("id", profile.id);

    // 5. Generate magic link
    const { data: linkData, error: lErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: "https://vertexresearchlabs.com/dashboard" },
    });
    if (lErr) throw lErr;
    const magicLink = linkData.properties?.action_link;

    // 6. Build the tailored thank-you email
    const REWARD_TIERS = [
      { points: 250, credit: 10, minCart: 75 }, { points: 500, credit: 20, minCart: 100 },
      { points: 750, credit: 30, minCart: 120 }, { points: 1000, credit: 40, minCart: 150 },
      { points: 1500, credit: 65, minCart: 200 }, { points: 2000, credit: 90, minCart: 250 },
      { points: 3000, credit: 140, minCart: 350 }, { points: 5000, credit: 250, minCart: 500 },
    ];
    const firstName = fullName.split(" ")[0];
    const newBalance = (profile.points_balance ?? 0) + pointsEarned;
    const unlocked = [...REWARD_TIERS].reverse().find((t) => newBalance >= t.points) || null;
    const nextTier = REWARD_TIERS.find((t) => newBalance < t.points) || null;

    const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
    const itemRows = (items || [])
      .map((i: any) => `<tr>
        <td style="padding:6px 0;color:#e5e7eb;font-size:14px">${i.quantity}× ${i.productName}${i.size ? ` · ${i.size}` : ""}</td>
        <td style="padding:6px 0;color:#e5e7eb;font-size:14px;text-align:right">${fmt(i.lineTotal ?? (i.price * i.quantity))}</td>
      </tr>`)
      .join("");

    const orderForLine = orderForName
      ? `Thank you for <strong style="color:#fff">${orderForName}'s</strong> order — we've credited the loyalty points to your Vertex account. 🎉`
      : `Thank you for your order — we've credited your loyalty points. 🎉`;

    const offersBlock = unlocked
      ? `<div style="background:linear-gradient(135deg,#0d2620 0%,#0a1a17 100%);border:1px solid #1f4d42;border-radius:12px;padding:20px;text-align:center;margin:18px 0">
           <div style="color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;margin-bottom:6px">Available to redeem now</div>
           <div style="color:#ffd700;font-size:30px;font-weight:900;line-height:1">$${unlocked.credit} OFF</div>
           <div style="color:#9ca3af;font-size:13px;margin-top:6px">On your next order · min. order $${unlocked.minCart}</div>
           ${nextTier ? `<div style="color:#6b7280;font-size:12px;margin-top:8px">${(nextTier.points - newBalance).toLocaleString()} more points unlocks $${nextTier.credit} off</div>` : ""}
         </div>`
      : `<div style="background:#111;border:1px solid #1f1f1f;border-radius:12px;padding:20px;text-align:center;margin:18px 0">
           <div style="color:#e5e7eb;font-size:15px;font-weight:700">${newBalance.toLocaleString()} points and climbing</div>
           ${nextTier ? `<div style="color:#9ca3af;font-size:13px;margin-top:4px">${(nextTier.points - newBalance).toLocaleString()} more to unlock $${nextTier.credit} off</div>` : ""}
         </div>`;

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;background:#0d0d0d;border:1px solid #1f1f1f;border-radius:8px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#0d1f1c 0%,#0a1a17 100%);border-bottom:1px solid #1a3a34;padding:14px 24px;text-align:center">
    <span style="color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:600">${firstName}'s Vertex Rewards</span>
    <div style="margin-top:4px"><span style="color:#2DD4BF;font-size:26px;font-weight:800">${newBalance.toLocaleString()}</span><span style="color:#6b7280;font-size:13px"> points</span></div>
  </div>
  <div style="padding:24px 28px 4px">
    <div style="font-size:23px;font-weight:800;color:#fff;line-height:1.3">${orderForName ? `Points added, ${firstName} 🔬` : `Thanks, ${firstName} 🔬`}</div>
    <div style="color:#9ca3af;font-size:14px;margin-top:8px;line-height:1.6">${orderForLine}</div>
  </div>
  <div style="padding:8px 28px 4px">
    <div style="background:#111;border:1px solid #1f1f1f;border-radius:12px;padding:16px 18px">
      <div style="color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;margin-bottom:8px">Order ${order.order_number}</div>
      <table style="width:100%;border-collapse:collapse">${itemRows}
        <tr><td style="padding:10px 0 0;border-top:1px solid #1f1f1f;color:#9ca3af;font-size:13px">Total paid</td><td style="padding:10px 0 0;border-top:1px solid #1f1f1f;color:#e5e7eb;font-size:13px;text-align:right">${fmt(total)} cash</td></tr>
        <tr><td style="padding:4px 0;color:#2DD4BF;font-size:13px;font-weight:700">Points earned</td><td style="padding:4px 0;color:#2DD4BF;font-size:13px;font-weight:700;text-align:right">+${pointsEarned.toLocaleString()} pts</td></tr>
        <tr><td style="padding:4px 0;color:#9ca3af;font-size:13px">New balance</td><td style="padding:4px 0;color:#fff;font-size:13px;font-weight:700;text-align:right">${newBalance.toLocaleString()} pts</td></tr>
      </table>
    </div>
  </div>
  <div style="padding:4px 28px 24px;text-align:center">
    ${offersBlock}
    <a href="${magicLink}" style="display:inline-block;background:#2DD4BF;color:#000;font-weight:800;font-size:15px;padding:15px 40px;border-radius:8px;text-decoration:none;letter-spacing:0.3px">Shop &amp; redeem my points →</a>
    <div style="color:#4b5563;font-size:11px;margin-top:10px">One tap — no password needed · points never expire</div>
  </div>
  <div style="padding:18px 28px;text-align:center;border-top:1px solid #1a1a1a">
    <div style="color:#374151;font-size:11px;line-height:1.8">
      Questions? <a href="mailto:info@vertexresearchlabs.com" style="color:#2DD4BF;text-decoration:none">info@vertexresearchlabs.com</a><br/>
      All products are for laboratory research use only. Not for human or veterinary use.
    </div>
  </div>
</div></body></html>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Vertex Research Labs <info@vertexresearchlabs.com>",
        reply_to: "info@vertexresearchlabs.com",
        to: [email],
        bcc: bcc ? [bcc] : undefined,
        subject: orderForName
          ? `${firstName}, ${orderForName}'s order added ${pointsEarned.toLocaleString()} points to your account`
          : `Thank you for your order — ${pointsEarned.toLocaleString()} points added`,
        html,
      }),
    });
    const resendData = await resendRes.json();

    return new Response(
      JSON.stringify({ success: true, order, profileId: profile.id, magicLink, resend: resendData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
