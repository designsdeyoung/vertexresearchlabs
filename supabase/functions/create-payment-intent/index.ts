import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import Stripe from "https://esm.sh/stripe@17.5.0?target=deno";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" });

    const body = await req.json();
    const amount = Number(body?.amount);
    const email = String(body?.email || "");
    const metadata = body?.metadata || {};

    if (!amount || amount < 0.5) {
      return new Response(JSON.stringify({ error: "Invalid amount" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      receipt_email: email || undefined,
      automatic_payment_methods: { enabled: true },
      metadata: Object.fromEntries(
        Object.entries(metadata).map(([k, v]) => [k, String(v ?? "")])
      ),
    });

    return new Response(
      JSON.stringify({ clientSecret: intent.client_secret, paymentIntentId: intent.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("create-payment-intent error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
