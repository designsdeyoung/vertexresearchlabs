// Admin tool: cancel an order. Sets status to "cancelled", optionally reverses
// any points awarded for it, and emails the customer a cancellation notice.
//
// IMPORTANT: cancelling is NOT refunding. If the order was already paid, this
// function deliberately does not move money — it flags `wasPaid` in the response
// so an admin can issue the refund in Stripe (or by hand) themselves.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAILS = ["info@vertexdata.ai", "designsdeyoung@gmail.com", "adamdeyoung11@gmail.com", "info@vertexresearchlabs.com"];

const SITE = "https://vertexresearchlabs.com";
const LOGO_URL = "https://qgritvsluilqptgtvayv.supabase.co/storage/v1/object/public/email-assets/logo-avatar.png";

/** Orders in these states are already out the door — refuse unless force:true. */
const SHIPPED_STATES = ["shipped", "delivered"];

const buildHtml = (opts: {
  firstName: string;
  orderNumber: string;
  total: number;
  reason?: string;
  wasPaid: boolean;
}) => {
  const { firstName, orderNumber, total, reason, wasPaid } = opts;
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0b0b0b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
<div style="max-width:520px;margin:0 auto;background:#111;border:1px solid #1f1f1f;border-radius:14px;overflow:hidden">
  <div style="padding:26px 28px 6px;text-align:center">
    <img src="${LOGO_URL}" alt="Vertex Research Labs" width="52" height="52" style="display:inline-block;border-radius:12px"/>
    <div style="color:#2DD4BF;font-size:10px;letter-spacing:3px;font-weight:700;text-transform:uppercase;margin-top:8px">Vertex Research Labs</div>
  </div>
  <div style="padding:8px 28px 4px">
    <div style="font-size:24px;font-weight:800;color:#fff;line-height:1.25">Your order has been cancelled</div>
    <div style="color:#9ca3af;font-size:14px;margin-top:10px;line-height:1.6">
      Hi ${firstName}, we've cancelled order <strong style="color:#fff">${orderNumber}</strong>${
        reason ? ` — ${reason}` : ""
      }. Nothing further is needed from you.
    </div>
  </div>
  <div style="padding:14px 28px">
    <div style="background:#161616;border:1px solid #232323;border-radius:10px;padding:14px 16px">
      <div style="display:flex;justify-content:space-between;color:#9ca3af;font-size:13px">
        <span>Order</span><span style="color:#fff;font-weight:700">${orderNumber}</span>
      </div>
      <div style="margin-top:6px;color:#9ca3af;font-size:13px">
        Order total: <span style="color:#fff;font-weight:700">$${Number(total || 0).toFixed(2)}</span>
      </div>
    </div>
    ${
      wasPaid
        ? `<div style="margin-top:12px;color:#9ca3af;font-size:13px;line-height:1.6">
             This order had a payment recorded. If a refund is due, it will be processed
             separately — we'll be in touch to confirm.
           </div>`
        : `<div style="margin-top:12px;color:#9ca3af;font-size:13px;line-height:1.6">
             No payment was taken for this order.
           </div>`
    }
  </div>
  <div style="padding:6px 28px 26px;text-align:center">
    <a href="${SITE}" style="display:inline-block;background:#2DD4BF;color:#000;font-weight:800;font-size:15px;padding:14px 38px;border-radius:8px;text-decoration:none">Browse the catalog →</a>
  </div>
  <div style="padding:18px 28px;text-align:center;border-top:1px solid #1a1a1a">
    <div style="color:#374151;font-size:11px;line-height:1.8">
      Questions? <a href="mailto:info@vertexresearchlabs.com" style="color:#2DD4BF;text-decoration:none">info@vertexresearchlabs.com</a><br/>
      All products are for laboratory research use only. Not for human or veterinary use.
    </div>
  </div>
</div></body></html>`;
};

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
      orderNumber,
      reason,
      sendEmail = true,
      // Cancelling does not claw back points by default — opt in explicitly.
      reversePoints = false,
      // Allow cancelling an already-shipped order only when forced.
      force = false,
      // Standing rule: BCC the ops inbox on manually-sent customer emails.
      bcc = "designsdeyoung@gmail.com",
    } = await req.json();

    if (!orderId && !orderNumber) {
      return new Response(JSON.stringify({ error: "orderId or orderNumber is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Look up by id or by the human-facing VRL- number.
    const sel = "id, order_number, profile_id, total, points_earned, paid_at, status";
    const { data: order, error: oErr } = orderId
      ? await admin.from("orders").select(sel).eq("id", orderId).maybeSingle()
      : await admin.from("orders").select(sel).ilike("order_number", String(orderNumber).trim()).maybeSingle();
    if (oErr) throw oErr;
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (order.status === "cancelled") {
      return new Response(
        JSON.stringify({ alreadyCancelled: true, orderNumber: order.order_number }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Safety: don't silently cancel something already in the customer's hands.
    if (SHIPPED_STATES.includes(order.status) && !force) {
      return new Response(
        JSON.stringify({
          error: `Order is already ${order.status}. Re-send with force:true to cancel anyway.`,
          status: order.status,
        }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: uErr } = await admin
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", order.id);
    if (uErr) throw uErr;

    // Optionally reverse points that this order earned.
    let pointsReversed = 0;
    const earned = Number(order.points_earned ?? 0);
    if (reversePoints && earned > 0 && order.profile_id) {
      await admin.from("points_transactions").insert({
        profile_id: order.profile_id,
        amount: -earned,
        type: "adjustment",
        description: `Order ${order.order_number} cancelled — points reversed`,
        order_reference: order.id,
      });
      const { data: prof } = await admin
        .from("profiles")
        .select("points_balance, lifetime_points")
        .eq("id", order.profile_id)
        .maybeSingle();
      if (prof) {
        await admin.from("profiles").update({
          // Never let a reversal push a balance negative.
          points_balance: Math.max(0, (prof.points_balance ?? 0) - earned),
          lifetime_points: Math.max(0, (prof.lifetime_points ?? 0) - earned),
        }).eq("id", order.profile_id);
      }
      await admin.from("orders").update({ points_earned: 0 }).eq("id", order.id);
      pointsReversed = earned;
    }

    // Email the customer a cancellation notice.
    let emailSent = false;
    let customerEmail: string | null = null;
    if (sendEmail && order.profile_id) {
      const { data: profile } = await admin
        .from("profiles")
        .select("email, full_name")
        .eq("id", order.profile_id)
        .maybeSingle();
      customerEmail = profile?.email ?? null;
      if (customerEmail) {
        const firstName = (profile?.full_name || "there").split(" ")[0];
        const html = buildHtml({
          firstName,
          orderNumber: order.order_number || "your order",
          total: Number(order.total) || 0,
          reason,
          wasPaid: !!order.paid_at,
        });
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Vertex Research Labs <info@vertexresearchlabs.com>",
            reply_to: "info@vertexresearchlabs.com",
            to: [customerEmail],
            ...(bcc ? { bcc: Array.isArray(bcc) ? bcc : [bcc] } : {}),
            subject: `Your order ${order.order_number} has been cancelled`,
            html,
          }),
        });
        emailSent = res.ok;
        if (!res.ok) console.error("cancel-order: resend failed", await res.text());
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        orderNumber: order.order_number,
        previousStatus: order.status,
        status: "cancelled",
        // True when money was already collected — a refund may be owed and is
        // NOT handled here.
        wasPaid: !!order.paid_at,
        pointsReversed,
        emailSent,
        customerEmail,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("cancel-order error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
