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
      total,
      discountAmount = 0,
      discountCode = null,
      pointsEarned,
      bcc,
    } = body;

    // 1. Find or create auth user
    const { data: list } = await admin.auth.admin.listUsers();
    let userId = list?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
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

    // 3. Insert order
    const { data: order, error: oErr } = await admin
      .from("orders")
      .insert({
        profile_id: profile.id,
        items: JSON.stringify(items),
        subtotal,
        shipping: 0,
        total,
        credit_applied: 0,
        points_earned: pointsEarned,
        status: "paid",
        is_autoship: false,
        payment_method: "cash",
        discount_amount: discountAmount,
        discount_code: discountCode,
        paid_at: new Date().toISOString(),
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
      options: { redirectTo: "https://vertexresearchlabs.lovable.app/dashboard" },
    });
    if (lErr) throw lErr;
    const magicLink = linkData.properties?.action_link;

    // 6. Send via Resend with BCC
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#0a0a0a;color:#fff">
        <h1 style="color:#00B4D8;font-size:22px">Welcome to Vertex Research Labs, ${fullName.split(" ")[0]}</h1>
        <p style="color:#ccc">Thanks for your order <strong>${order.order_number}</strong>. We've credited <strong>${pointsEarned} loyalty points</strong> ($${(pointsEarned / 25).toFixed(0)}+ in future credits) to your account.</p>
        <p style="color:#ccc">Click below to claim your account and view your points balance — no password needed:</p>
        <p style="margin:28px 0">
          <a href="${magicLink}" style="background:#00B4D8;color:#000;padding:14px 24px;border-radius:6px;text-decoration:none;font-weight:bold">Claim Your Account & Points</a>
        </p>
        <p style="color:#888;font-size:12px">If the button doesn't work, paste this link: ${magicLink}</p>
        <hr style="border:none;border-top:1px solid #222;margin:32px 0"/>
        <p style="color:#666;font-size:11px">Research Use Only. Not for human consumption.</p>
      </div>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Vertex Research Labs <info@vertexresearchlabs.com>",
        to: [email],
        bcc: bcc ? [bcc] : undefined,
        subject: `Claim your ${pointsEarned} loyalty points — Order ${order.order_number}`,
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
