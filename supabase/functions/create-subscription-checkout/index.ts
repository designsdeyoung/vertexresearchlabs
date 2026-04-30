import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";
import Stripe from "https://esm.sh/stripe@17.5.0?target=deno";

interface AutoshipLine {
  productId: string;
  productName: string;
  unitAmount: number; // in dollars, post all discounts (autoship + 3pack + sale)
  quantity: number;
  is3Pack: boolean;
  intervalDays?: number; // 30 (default for singles) or 90 (3-Pack default)
}

interface OneTimeLine {
  productId: string;
  productName: string;
  unitAmount: number;
  quantity: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");
    const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const email: string = String(body?.email || "").trim().toLowerCase();
    const customerName: string = String(body?.customerName || "");
    const autoshipLines: AutoshipLine[] = Array.isArray(body?.autoshipLines) ? body.autoshipLines : [];
    const oneTimeLines: OneTimeLine[] = Array.isArray(body?.oneTimeLines) ? body.oneTimeLines : [];
    const shippingAmount: number = Number(body?.shippingAmount || 0);
    const successUrl: string = String(body?.successUrl || "");
    const cancelUrl: string = String(body?.cancelUrl || "");
    const shippingAddress = body?.shippingAddress || null;

    if (!email || autoshipLines.length === 0 || !successUrl || !cancelUrl) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find or create Stripe customer
    const existing = await stripe.customers.list({ email, limit: 1 });
    let customer = existing.data[0];
    if (!customer) {
      customer = await stripe.customers.create({ email, name: customerName || undefined });
    }

    // Build subscription line items: one Price per autoship line (created on the fly)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const line of autoshipLines) {
      const intervalDays = Number(line.intervalDays) > 0
        ? Number(line.intervalDays)
        : (line.is3Pack ? 90 : 30);
      const cadenceLabel = intervalDays === 90 ? "every 90 days" : "every 30 days";
      const price = await stripe.prices.create({
        currency: "usd",
        unit_amount: Math.round(line.unitAmount * 100),
        recurring: { interval: "day", interval_count: intervalDays },
        product_data: {
          name: `${line.productName}${line.is3Pack ? " (3-Pack)" : ""} — Autoship ${cadenceLabel}`,
        },
      });
      lineItems.push({ price: price.id, quantity: line.quantity });
    }

    // One-time items added to first invoice as add_invoice_items
    const addInvoiceItems: Stripe.Checkout.SessionCreateParams.SubscriptionData.InvoiceSettings extends never ? never : any[] = [];
    const oneTimeInvoiceItems: any[] = [];
    for (const line of oneTimeLines) {
      const oneTimePrice = await stripe.prices.create({
        currency: "usd",
        unit_amount: Math.round(line.unitAmount * 100),
        product_data: { name: line.productName },
      });
      oneTimeInvoiceItems.push({ price: oneTimePrice.id, quantity: line.quantity });
    }

    // Shipping as a one-time invoice item on first invoice
    if (shippingAmount > 0) {
      const shipPrice = await stripe.prices.create({
        currency: "usd",
        unit_amount: Math.round(shippingAmount * 100),
        product_data: { name: "Shipping" },
      });
      oneTimeInvoiceItems.push({ price: shipPrice.id, quantity: 1 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: {
          autoship_lines: JSON.stringify(autoshipLines),
          customer_email: email,
          customer_name: customerName,
          shipping_address: JSON.stringify(shippingAddress || {}),
        },
        ...(oneTimeInvoiceItems.length > 0 ? { add_invoice_items: oneTimeInvoiceItems } : {}),
      },
      metadata: {
        kind: "autoship_initial",
        customer_email: email,
      },
    });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-subscription-checkout error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
