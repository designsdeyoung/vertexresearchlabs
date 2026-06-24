import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Admin utility: attach a customer email/account to an existing order that has
// no profile (e.g. an early manual order), so all tracking emails can reach them.
// Optionally fires the "shipped" email (with BCC) right away.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { orderId, orderNumber, email, fullName, sendShipped, bcc } = await req.json();
    if ((!orderId && !orderNumber) || !email) throw new Error("orderId|orderNumber and email required");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Resolve the order
    const q = admin.from("orders").select("id, order_number, profile_id, tracking_number, tracking_url, shipping_name");
    const { data: order } = orderId
      ? await q.eq("id", orderId).maybeSingle()
      : await q.eq("order_number", orderNumber).maybeSingle();
    if (!order) throw new Error("order not found");

    const name = fullName || order.shipping_name || "Customer";

    // Find or silently create the auth user
    const { data: existingUsers } = await admin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => (u.email || "").toLowerCase() === email.toLowerCase());
    let userId = existingUser?.id ?? null;
    if (!userId) {
      const { data: newUser, error: cErr } = await admin.auth.admin.createUser({
        email, email_confirm: true, user_metadata: { full_name: name },
      });
      if (cErr) throw new Error(`createUser: ${cErr.message}`);
      userId = newUser?.user?.id ?? null;
    }
    if (!userId) throw new Error("could not resolve user");

    // Find or create profile
    let profileId: string | null = null;
    const { data: prof } = await admin.from("profiles").select("id").eq("user_id", userId).maybeSingle();
    if (prof) {
      profileId = prof.id;
    } else {
      const { data: newProf, error: pErr } = await admin
        .from("profiles")
        .insert({ user_id: userId, email, full_name: name, points_balance: 0, lifetime_points: 0 })
        .select("id").single();
      if (pErr) throw new Error(`profile insert: ${pErr.message}`);
      profileId = newProf.id;
    }

    // Link the order
    await admin.from("orders").update({ profile_id: profileId }).eq("id", order.id);

    // Optionally send the shipped email now (BCC supported)
    let shipped: any = null;
    if (sendShipped) {
      const { data: sData, error: sErr } = await admin.functions.invoke("send-shipped-email", {
        body: {
          orderId: order.id,
          trackingNumber: order.tracking_number,
          trackingUrl: order.tracking_url,
          toEmail: email,
          toName: name,
          bcc: bcc || undefined,
        },
      });
      shipped = sErr ? { error: sErr.message } : sData;
    }

    return new Response(JSON.stringify({
      success: true,
      orderNumber: order.order_number,
      profileId,
      linkedEmail: email,
      shipped,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("link-manual-order error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
