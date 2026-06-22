import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Public package tracker — look up an order by its tracking number (unique &
// hard to guess) and return live USPS checkpoints from EasyPost for the
// animated tracker on /track.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EASYPOST_API = "https://api.easypost.com/v2";

async function easypostGet(path: string) {
  const key = Deno.env.get("EASYPOST_API_KEY")!;
  const res = await fetch(`${EASYPOST_API}${path}`, {
    headers: { Authorization: `Basic ${btoa(key + ":")}` },
  });
  if (!res.ok) return null;
  return res.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { tracking } = await req.json();
    if (!tracking) throw new Error("tracking number required");
    const code = String(tracking).trim();

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Match the order (don't leak customer PII — return only what the tracker needs)
    const { data: order } = await admin
      .from("orders")
      .select("order_number, items, created_at, status, tracking_number, tracking_url, delivered_at, delivery_detail, shipping_city, shipping_state")
      .eq("tracking_number", code)
      .maybeSingle();

    if (!order) {
      return new Response(JSON.stringify({ found: false }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Live tracker from EasyPost (status + scan history)
    let tracker: any = null;
    try {
      const list = await easypostGet(`/trackers?tracking_code=${encodeURIComponent(code)}`);
      tracker = list?.trackers?.[0] || null;
    } catch (_) { /* fall back to stored status */ }

    const details = (tracker?.tracking_details || []).map((d: any) => ({
      status: d.status,
      message: d.message,
      datetime: d.datetime,
      city: d.tracking_location?.city || null,
      state: d.tracking_location?.state || null,
    }));

    const items = (() => {
      try { return Array.isArray(order.items) ? order.items : JSON.parse(order.items || "[]"); }
      catch { return []; }
    })();

    return new Response(JSON.stringify({
      found: true,
      order_number: order.order_number,
      created_at: order.created_at,
      items: items.map((i: any) => ({
        name: i.productName || i.name || "Item",
        size: i.size || "",
        quantity: i.quantity || 1,
      })),
      // Live status preferred, fall back to stored order status
      status: tracker?.status || order.status || "pre_transit",
      est_delivery_date: tracker?.est_delivery_date || null,
      tracking_number: order.tracking_number,
      tracking_url: order.tracking_url || tracker?.public_url || null,
      delivered_at: order.delivered_at || null,
      delivery_detail: order.delivery_detail || null,
      dest: [order.shipping_city, order.shipping_state].filter(Boolean).join(", "),
      checkpoints: details,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("track-order error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
