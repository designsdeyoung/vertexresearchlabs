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

// Deliberately plain and transactional. Gmail sorts image-heavy, big-CTA,
// marketing-styled mail into Promotions — a cancellation notice must land in
// the primary inbox, so: no hero logo, no promotional call-to-action, no
// unsubscribe footer (this is a transactional receipt, not marketing), and a
// matching plain-text part, which is one of the strongest inbox signals.
const buildHtml = (opts: {
  firstName: string;
  orderNumber: string;
  total: number;
  reason?: string;
  wasPaid: boolean;
}) => {
  const { firstName, orderNumber, total, reason, wasPaid } = opts;
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#ffffff;color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6">
<div style="max-width:560px;margin:0 auto;padding:24px">
  <p style="margin:0 0 16px">Hi ${firstName},</p>
  <p style="margin:0 0 16px">
    Your order <strong>${orderNumber}</strong> has been cancelled${reason ? ` — ${reason}` : ""}.
    Nothing further is needed from you.
  </p>
  <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 16px">
    <tr>
      <td style="padding:6px 0;color:#555">Order number</td>
      <td style="padding:6px 0;text-align:right"><strong>${orderNumber}</strong></td>
    </tr>
    <tr>
      <td style="padding:6px 0;color:#555">Order total</td>
      <td style="padding:6px 0;text-align:right"><strong>$${Number(total || 0).toFixed(2)}</strong></td>
    </tr>
    <tr>
      <td style="padding:6px 0;color:#555">Status</td>
      <td style="padding:6px 0;text-align:right"><strong>Cancelled</strong></td>
    </tr>
  </table>
  <p style="margin:0 0 16px">
    ${
      wasPaid
        ? "This order had a payment recorded. If a refund is due, we'll process it separately and be in touch to confirm."
        : "No payment was taken for this order."
    }
  </p>
  <p style="margin:0 0 16px">
    If you have any questions, just reply to this email or write to
    <a href="mailto:info@vertexresearchlabs.com" style="color:#0a7ea4">info@vertexresearchlabs.com</a>.
  </p>
  <p style="margin:0 0 4px">— Vertex Research Labs</p>
  <p style="margin:16px 0 0;color:#888;font-size:12px">
    All products are supplied for laboratory research use only. Not for human or veterinary use.
  </p>
</div></body></html>`;
};

const buildText = (opts: {
  firstName: string;
  orderNumber: string;
  total: number;
  reason?: string;
  wasPaid: boolean;
}) => {
  const { firstName, orderNumber, total, reason, wasPaid } = opts;
  return [
    `Hi ${firstName},`,
    ``,
    `Your order ${orderNumber} has been cancelled${reason ? ` — ${reason}` : ""}.`,
    `Nothing further is needed from you.`,
    ``,
    `Order number: ${orderNumber}`,
    `Order total: $${Number(total || 0).toFixed(2)}`,
    `Status: Cancelled`,
    ``,
    wasPaid
      ? `This order had a payment recorded. If a refund is due, we'll process it separately and be in touch to confirm.`
      : `No payment was taken for this order.`,
    ``,
    `Questions? Just reply to this email or write to info@vertexresearchlabs.com.`,
    ``,
    `— Vertex Research Labs`,
    `All products are supplied for laboratory research use only. Not for human or veterinary use.`,
  ].join("\n");
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
      // Re-send the notice for an order that is already cancelled (e.g. the
      // first attempt had no address on file, or it never arrived).
      resendEmail = false,
      // Explicit recipient, for guest/manual orders that have no linked
      // profile and therefore no email address of their own.
      toEmail,
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

    // Already cancelled: bail out unless we've been asked to (re)send the
    // notice, which is the recovery path when the first email never landed.
    const alreadyCancelled = order.status === "cancelled";
    if (alreadyCancelled && !resendEmail) {
      return new Response(
        JSON.stringify({ alreadyCancelled: true, orderNumber: order.order_number }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Safety: don't silently cancel something already in the customer's hands.
    if (!alreadyCancelled && SHIPPED_STATES.includes(order.status) && !force) {
      return new Response(
        JSON.stringify({
          error: `Order is already ${order.status}. Re-send with force:true to cancel anyway.`,
          status: order.status,
        }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // On a pure re-send the order is already cancelled — don't rewrite state.
    if (!alreadyCancelled) {
      const { error: uErr } = await admin
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", order.id);
      if (uErr) throw uErr;
    }

    // Optionally reverse points that this order earned. Skipped on a re-send so
    // points can't be clawed back twice.
    let pointsReversed = 0;
    const earned = Number(order.points_earned ?? 0);
    if (!alreadyCancelled && reversePoints && earned > 0 && order.profile_id) {
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

    // Email the customer a cancellation notice. An explicit toEmail wins, then
    // the linked profile. Guest/manual orders store no address of their own, so
    // without either there is genuinely nobody to write to — say so plainly
    // instead of silently reporting emailSent:false.
    let emailSent = false;
    let customerEmail: string | null = null;
    let emailSkippedReason: string | null = null;
    let customerName: string | null = null;

    if (order.profile_id) {
      const { data: profile } = await admin
        .from("profiles")
        .select("email, full_name")
        .eq("id", order.profile_id)
        .maybeSingle();
      customerEmail = profile?.email ?? null;
      customerName = profile?.full_name ?? null;
    }
    if (toEmail) customerEmail = String(toEmail).trim();

    if (!sendEmail) {
      emailSkippedReason = "sendEmail was false";
    } else if (!customerEmail) {
      emailSkippedReason = order.profile_id
        ? "the linked profile has no email address on file"
        : "this order has no linked customer profile — pass toEmail to send the notice";
    } else {
      const firstName = (customerName || "there").split(" ")[0];
      const parts = {
        firstName,
        orderNumber: order.order_number || "your order",
        total: Number(order.total) || 0,
        reason,
        wasPaid: !!order.paid_at,
      };
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
          html: buildHtml(parts),
          // Plain-text alternative — a strong signal for primary-inbox placement.
          text: buildText(parts),
          // Mark as transactional so it isn't grouped with bulk mail.
          headers: { "X-Entity-Ref-ID": `cancel-${order.id}` },
        }),
      });
      emailSent = res.ok;
      if (!res.ok) {
        const detail = await res.text();
        emailSkippedReason = `Resend rejected the send: ${detail}`;
        console.error("cancel-order: resend failed", detail);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        orderNumber: order.order_number,
        previousStatus: order.status,
        status: "cancelled",
        resent: alreadyCancelled,
        // True when money was already collected — a refund may be owed and is
        // NOT handled here.
        wasPaid: !!order.paid_at,
        pointsReversed,
        emailSent,
        customerEmail,
        emailSkippedReason,
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
