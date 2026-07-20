// Admin tool: record an offline payment (cash/zelle/venmo) against an existing
// order. Stamps paid_at + payment_method, awards 3× points idempotently (same
// guard as generate-shipping-label), and emails the customer their points.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAILS = ["info@vertexdata.ai", "designsdeyoung@gmail.com", "adamdeyoung11@gmail.com", "info@vertexresearchlabs.com"];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // Verify the caller is an admin by checking their JWT
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { data: { user }, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !user || !ADMIN_EMAILS.includes(user.email || "")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const {
      orderId,
      method = "cash",
      sendEmail = true,
      // Standing rule: BCC the ops inbox on manually-sent customer emails.
      bcc = "designsdeyoung@gmail.com",
    } = await req.json();
    if (!orderId) {
      return new Response(JSON.stringify({ error: "orderId is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: order, error: oErr } = await admin
      .from("orders")
      .select("id, order_number, profile_id, total, points_earned, paid_at, status")
      .eq("id", orderId)
      .maybeSingle();
    if (oErr) throw oErr;
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (order.paid_at) {
      return new Response(
        JSON.stringify({ alreadyPaid: true, paidAt: order.paid_at }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const paidAt = new Date().toISOString();
    const { error: uErr } = await admin
      .from("orders")
      .update({
        paid_at: paidAt,
        payment_method: method,
        // An unpaid invoice becomes a confirmed order; shipped/delivered stay put.
        ...(order.status === "invoice_pending" ? { status: "confirmed" } : {}),
      })
      .eq("id", orderId);
    if (uErr) throw uErr;

    // Points: 3× the final amount paid. Idempotent — skip if this order already
    // earned points (e.g. at checkout or when the label was bought).
    let pointsAwarded = 0;
    const alreadyAwarded = Number(order.points_earned ?? 0) > 0;
    let hasTxn = false;
    if (!alreadyAwarded && order.profile_id) {
      const { count } = await admin
        .from("points_transactions")
        .select("id", { count: "exact", head: true })
        .eq("order_reference", orderId);
      hasTxn = (count ?? 0) > 0;
    }
    if (!alreadyAwarded && !hasTxn && order.profile_id) {
      const paid = Number(order.total) || 0;
      pointsAwarded = Math.floor(paid * 3);
      if (pointsAwarded > 0) {
        await admin.from("points_transactions").insert({
          profile_id: order.profile_id,
          amount: pointsAwarded,
          type: "purchase",
          description: `Order ${order.order_number} — ${method} payment received (3× $${paid.toFixed(2)} paid)`,
          order_reference: orderId,
        });
        const { data: prof } = await admin
          .from("profiles")
          .select("points_balance, lifetime_points")
          .eq("id", order.profile_id)
          .maybeSingle();
        if (prof) {
          await admin.from("profiles").update({
            points_balance: (prof.points_balance ?? 0) + pointsAwarded,
            lifetime_points: (prof.lifetime_points ?? 0) + pointsAwarded,
          }).eq("id", order.profile_id);
        }
        await admin.from("orders").update({ points_earned: pointsAwarded }).eq("id", orderId);
      }
    }

    let emailSent = false;
    if (sendEmail && pointsAwarded > 0 && order.profile_id) {
      try {
        await admin.functions.invoke("send-points-earned-email", {
          body: {
            profileId: order.profile_id,
            pointsEarned: pointsAwarded,
            reason: `Order ${order.order_number} — payment received (${method})`,
            bcc,
          },
        });
        emailSent = true;
      } catch (e) {
        console.error("send-points-earned-email failed (non-fatal):", e);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        orderNumber: order.order_number,
        paidAt,
        method,
        pointsAwarded,
        emailSent,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("mark-order-paid error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
