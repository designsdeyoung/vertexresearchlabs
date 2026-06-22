import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// EasyPost tracker webhook receiver.
// Fires "out for delivery" and "delivered" emails, with dedup + order updates.
// Configured in EasyPost as: https://<project>.functions.supabase.co/easypost-webhook?secret=<EASYPOST_WEBHOOK_SECRET>

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-hmac-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // ── Verify shared secret in the URL ──
    const url = new URL(req.url);
    const provided = url.searchParams.get("secret");
    const expected = Deno.env.get("EASYPOST_WEBHOOK_SECRET");
    if (expected && provided !== expected) {
      console.warn("easypost-webhook: bad secret");
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const event = await req.json();
    // Only care about tracker updates
    if (event?.description !== "tracker.updated" && event?.result?.object !== "Tracker") {
      return new Response(JSON.stringify({ ignored: true, reason: "not a tracker event" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tracker = event.result;
    const trackingCode: string | undefined = tracker?.tracking_code;
    const status: string = tracker?.status || "";
    if (!trackingCode) {
      return new Response(JSON.stringify({ ignored: true, reason: "no tracking_code" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Latest USPS detail message (e.g. "Delivered, Front Door/Porch")
    const details: any[] = Array.isArray(tracker?.tracking_details) ? tracker.tracking_details : [];
    const latest = details.length ? details[details.length - 1] : null;
    const detailMessage: string = latest?.message || tracker?.status_detail || "";

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Match the order by tracking number
    const { data: order } = await admin
      .from("orders")
      .select("id, status, out_for_delivery_email_sent_at, delivered_email_sent_at")
      .eq("tracking_number", trackingCode)
      .maybeSingle();

    if (!order) {
      console.log("easypost-webhook: no order for tracking_code", trackingCode);
      return new Response(JSON.stringify({ ignored: true, reason: "no matching order" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let action = "none";

    // ── OUT FOR DELIVERY ──
    if (status === "out_for_delivery" && !order.out_for_delivery_email_sent_at) {
      try {
        await admin.functions.invoke("send-delivery-email", {
          body: { orderId: order.id, phase: "out_for_delivery", deliveryDetail: detailMessage },
        });
      } catch (e) { console.error("out_for_delivery email failed:", e); }

      // Note: we keep status as "shipped" — "out_for_delivery" is transient and
      // not an allowed value in the orders_status_check constraint. Only the
      // email timestamp matters for dedup.
      const { error: ofdErr } = await admin.from("orders").update({
        out_for_delivery_email_sent_at: new Date().toISOString(),
      }).eq("id", order.id);
      if (ofdErr) console.error("ofd update failed:", ofdErr);
      action = "sent_out_for_delivery";
    }

    // ── DELIVERED ──
    else if (status === "delivered" && !order.delivered_email_sent_at) {
      try {
        await admin.functions.invoke("send-delivery-email", {
          body: { orderId: order.id, phase: "delivered", deliveryDetail: detailMessage },
        });
      } catch (e) { console.error("delivered email failed:", e); }

      const { error: delErr } = await admin.from("orders").update({
        status: "delivered",
        delivered_at: latest?.datetime || new Date().toISOString(),
        delivery_detail: detailMessage || null,
        delivered_email_sent_at: new Date().toISOString(),
      }).eq("id", order.id);
      if (delErr) console.error("delivered update failed:", delErr);
      action = "sent_delivered";
    }

    return new Response(JSON.stringify({ ok: true, action, tracking_code: trackingCode, status }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("easypost-webhook error:", e);
    // Return 200 so EasyPost doesn't endlessly retry on a malformed payload,
    // but log it for inspection.
    return new Response(JSON.stringify({ error: e.message }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
