import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Attach an externally-created tracking number (e.g. a PirateShip label) to an
// order, register it as an EasyPost tracker so USPS scan webhooks flow into our
// system (firing the in-transit/out-for-delivery/delivered emails), mark the
// order shipped, and optionally send the "shipped" email.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function easypost(path: string, method: string, body?: unknown) {
  const key = Deno.env.get("EASYPOST_API_KEY")!;
  const res = await fetch(`https://api.easypost.com/v2${path}`, {
    method,
    headers: { Authorization: `Basic ${btoa(key + ":")}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || JSON.stringify(json));
  return json;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { orderNumber, orderId, trackingNumber, carrier = "USPS", sendShipped, bcc } = await req.json();
    if ((!orderNumber && !orderId) || !trackingNumber) throw new Error("order + trackingNumber required");

    const code = String(trackingNumber).replace(/\s+/g, "");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const q = admin.from("orders").select("id, order_number, profile_id, shipping_name");
    const { data: order } = orderId
      ? await q.eq("id", orderId).maybeSingle()
      : await q.eq("order_number", orderNumber).maybeSingle();
    if (!order) throw new Error("order not found");

    // Register the tracker with EasyPost so webhook scan-updates flow to us
    let publicUrl: string | null = null;
    try {
      const tracker = await easypost("/trackers", "POST", { tracker: { tracking_code: code, carrier } });
      publicUrl = tracker?.public_url || null;
    } catch (e) {
      console.error("EasyPost tracker create failed (continuing):", e);
    }

    // Update the order
    await admin.from("orders").update({
      tracking_number: code,
      tracking_url: publicUrl,
      carrier,
      status: "shipped",
      fulfilled_at: new Date().toISOString(),
    }).eq("id", order.id);

    // Optionally send the shipped email now
    let shipped: any = null;
    if (sendShipped) {
      const { data: prof } = await admin.from("profiles").select("email, full_name").eq("id", order.profile_id).maybeSingle();
      const { data: sData, error: sErr } = await admin.functions.invoke("send-shipped-email", {
        body: {
          orderId: order.id,
          trackingNumber: code,
          trackingUrl: publicUrl,
          toEmail: prof?.email,
          toName: prof?.full_name || order.shipping_name,
          bcc: bcc || undefined,
        },
      });
      shipped = sErr ? { error: sErr.message } : sData;
    }

    return new Response(JSON.stringify({
      success: true,
      orderNumber: order.order_number,
      tracking_number: code,
      tracking_url: publicUrl,
      tracker_registered: !!publicUrl,
      shipped,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("upload-tracking error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
