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
    const { order_id, preview_only, override_address } = await req.json();
    if (!order_id) throw new Error("order_id required");

    // Load order + profile
    const { data: order, error: oErr } = await admin
      .from("orders")
      .select("*, profiles!orders_profile_id_fkey(full_name, address_line1, address_line2, city, state, zip_code, email)")
      .eq("id", order_id)
      .single();
    if (oErr || !order) throw new Error("Order not found");

    const profile = (order as any).profiles;
    let toName = override_address?.name || order.shipping_name || profile?.full_name || "Customer";
    let toStreet1 = override_address?.street1 || order.shipping_address1 || profile?.address_line1 || "";
    let toStreet2 = override_address?.street2 || order.shipping_address2 || profile?.address_line2 || "";
    let toCity = override_address?.city || order.shipping_city || profile?.city || "";
    let toState = override_address?.state || order.shipping_state || profile?.state || "";
    let toZip = override_address?.zip || order.shipping_zip || profile?.zip_code || "";

    // Fall back to Stripe payment intent shipping address if still missing
    if ((!toStreet1 || !toCity) && order.stripe_payment_intent_id) {
      try {
        const stripeKey = Deno.env.get("STRIPE_SECRET_KEY")!;
        const piRes = await fetch(`https://api.stripe.com/v1/payment_intents/${order.stripe_payment_intent_id}`, {
          headers: { Authorization: `Bearer ${stripeKey}` },
        });
        const pi = await piRes.json();
        const sa = pi?.shipping?.address;
        const sn = pi?.shipping?.name;
        if (sa?.line1) {
          toName = sn || toName;
          toStreet1 = sa.line1;
          toStreet2 = sa.line2 || "";
          toCity = sa.city;
          toState = sa.state;
          toZip = sa.postal_code;
          console.log("Pulled address from Stripe:", toStreet1, toCity, toState, toZip);
        }
      } catch (e) {
        console.error("Stripe address lookup failed:", e);
      }
    }

    // Persist address to order for future use
    if (toStreet1 && toCity && (!order.shipping_address1)) {
      await admin.from("orders").update({
        shipping_name: toName,
        shipping_address1: toStreet1,
        shipping_address2: toStreet2 || null,
        shipping_city: toCity,
        shipping_state: toState,
        shipping_zip: toZip,
      }).eq("id", order_id);
    }

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
          company: "Level Up Health Solutions LLC DBA",
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

    // Preview mode — return rate info without buying
    if (preview_only) {
      return new Response(
        JSON.stringify({
          preview: true,
          shipment_id: shipment.id,
          rate_id: flatRate.id,
          rate: flatRate.rate,
          service: flatRate.service,
          carrier: flatRate.carrier,
          delivery_days: flatRate.delivery_days,
          to_name: toName,
          to_address: `${toStreet1}, ${toCity}, ${toState} ${toZip}`,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    // Note: no email on label creation. The customer gets 3 USPS-driven emails
    // via the EasyPost webhook: in_transit → out_for_delivery → delivered.

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
