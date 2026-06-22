import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const EASYPOST_API = "https://api.easypost.com/v2";

async function easypost(path: string, method: string, body?: unknown) {
  const key = Deno.env.get("EASYPOST_API_KEY")!;
  const res = await fetch(`${EASYPOST_API}${path}`, {
    method,
    headers: {
      Authorization: `Basic ${btoa(key + ":")}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || JSON.stringify(json));
  return json;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { order_id } = await req.json();
    if (!order_id) throw new Error("order_id required");

    // Load order + profile
    const { data: order, error: oErr } = await admin
      .from("orders")
      .select("*, profiles!orders_profile_id_fkey(full_name, address_line1, address_line2, city, state, zip_code, email)")
      .eq("id", order_id)
      .single();
    if (oErr || !order) throw new Error("Order not found");

    const profile = (order as any).profiles;
    const toName = order.shipping_name || profile?.full_name || "Customer";
    const toStreet1 = order.shipping_address1 || profile?.address_line1 || "";
    const toStreet2 = order.shipping_address2 || profile?.address_line2 || "";
    const toCity = order.shipping_city || profile?.city || "";
    const toState = order.shipping_state || profile?.state || "";
    const toZip = order.shipping_zip || profile?.zip_code || "";

    if (!toStreet1 || !toCity || !toState || !toZip) {
      throw new Error("Incomplete shipping address for this order");
    }

    // Create shipment with USPS Priority Mail Small Flat Rate Box
    const shipment = await easypost("/shipments", "POST", {
      shipment: {
        to_address: {
          name: toName,
          street1: toStreet1,
          street2: toStreet2 || undefined,
          city: toCity,
          state: toState,
          zip: toZip,
          country: "US",
          email: profile?.email,
        },
        from_address: {
          name: "Vertex Research Labs",
          street1: Deno.env.get("SHIP_FROM_STREET1") || "",
          city: Deno.env.get("SHIP_FROM_CITY") || "",
          state: Deno.env.get("SHIP_FROM_STATE") || "",
          zip: Deno.env.get("SHIP_FROM_ZIP") || "",
          country: "US",
          email: "orders@vertexresearchlabs.com",
        },
        parcel: {
          predefined_package: "SmallFlatRateBox",
          weight: 16, // oz — USPS flat rate ignores actual weight
        },
      },
    });

    // Pick cheapest USPS rate (Priority Mail flat rate)
    const rates: any[] = shipment.rates || [];
    const uspsRates = rates.filter((r: any) => r.carrier === "USPS");
    const flatRate = uspsRates.find((r: any) =>
      r.service?.toLowerCase().includes("priority") &&
      r.service?.toLowerCase().includes("flat")
    ) || uspsRates[0] || rates[0];

    if (!flatRate) throw new Error("No USPS rates returned from EasyPost");

    // Buy the label
    const bought = await easypost(`/shipments/${shipment.id}/buy`, "POST", {
      rate: { id: flatRate.id },
    });

    const tracking = bought.tracking_code;
    const labelUrl = bought.postage_label?.label_url;
    const trackingUrl = bought.tracker?.public_url;

    // Save to order
    const { error: uErr } = await admin
      .from("orders")
      .update({
        status: "shipped",
        tracking_number: tracking,
        tracking_url: trackingUrl,
        label_url: labelUrl,
        easypost_shipment_id: shipment.id,
        fulfilled_at: new Date().toISOString(),
        carrier: "USPS",
      })
      .eq("id", order_id);
    if (uErr) throw uErr;

    return new Response(
      JSON.stringify({ tracking_number: tracking, label_url: labelUrl, tracking_url: trackingUrl }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error("generate-shipping-label error", e);
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
