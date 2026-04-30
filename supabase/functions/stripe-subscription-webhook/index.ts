import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";
import Stripe from "https://esm.sh/stripe@17.5.0?target=deno";

// Webhook signature verification is optional here — Lovable Cloud users may not have set
// STRIPE_WEBHOOK_SECRET. If present, we verify; otherwise we trust the event.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    return new Response("STRIPE_SECRET_KEY missing", { status: 500 });
  }
  const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  let event: Stripe.Event;
  try {
    if (webhookSecret && sig) {
      event = await stripe.webhooks.constructEventAsync(rawBody, sig, webhookSecret);
    } else {
      event = JSON.parse(rawBody) as Stripe.Event;
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Bad signature", { status: 400 });
  }

  console.log("Stripe event:", event.type);

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const meta = sub.metadata || {};
        const customerEmail = String(meta.customer_email || "");
        const customerName = String(meta.customer_name || "");
        const autoshipLines = meta.autoship_lines ? JSON.parse(String(meta.autoship_lines)) : [];
        const shippingAddress = meta.shipping_address ? JSON.parse(String(meta.shipping_address)) : null;

        // Find or create profile
        let profileId: string | null = null;
        if (customerEmail) {
          const { data: existingProfile } = await supabase
            .from("profiles")
            .select("id, user_id")
            .eq("email", customerEmail)
            .maybeSingle();

          if (existingProfile) {
            profileId = existingProfile.id;
          } else {
            // Silent account create (matches award-points pattern)
            const { data: users } = await supabase.auth.admin.listUsers();
            let userId = users?.users?.find((u) => u.email === customerEmail)?.id || null;
            if (!userId) {
              const { data: newUser } = await supabase.auth.admin.createUser({
                email: customerEmail,
                email_confirm: true,
                user_metadata: { full_name: customerName },
              });
              userId = newUser?.user?.id || null;
            }
            if (userId) {
              const { data: newProfile } = await supabase
                .from("profiles")
                .insert({
                  user_id: userId,
                  email: customerEmail,
                  full_name: customerName,
                  points_balance: 0,
                  lifetime_points: 0,
                })
                .select("id")
                .single();
              profileId = newProfile?.id || null;
            }
          }
        }

        if (!profileId) {
          console.warn("No profile resolved for sub", sub.id);
          break;
        }

        // Upsert one row per autoship line (subscription items in Stripe)
        // For simplicity, store the FIRST line at subscription level, or one row per item.
        for (let i = 0; i < (autoshipLines as Array<Record<string, unknown>>).length; i++) {
          const line = autoshipLines[i];
          const item = sub.items.data[i];
          if (!item) continue;

          const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end;
          await supabase
            .from("subscriptions")
            .upsert(
              {
                profile_id: profileId,
                stripe_subscription_id: sub.id,
                stripe_customer_id: String(sub.customer),
                status: sub.status,
                product_id: String(line.productId || ""),
                product_name: String(line.productName || ""),
                quantity: Number(line.quantity || 1),
                is_3pack: !!line.is3Pack,
                unit_amount: Number(line.unitAmount || 0),
                interval_days: Number(line.intervalDays) > 0 ? Number(line.intervalDays) : (line.is3Pack ? 90 : 30),
                current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
                cancel_at_period_end: !!sub.cancel_at_period_end,
                shipping_address: shippingAddress,
              },
              { onConflict: "stripe_subscription_id" }
            );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = (invoice as unknown as { subscription?: string }).subscription;
        if (!subId) break;

        // Lookup subscription row to get profile_id
        const { data: subRow } = await supabase
          .from("subscriptions")
          .select("profile_id, product_name, unit_amount, quantity")
          .eq("stripe_subscription_id", subId)
          .maybeSingle();

        if (!subRow?.profile_id) break;

        // Award 2x points on autoship total (subtotal of recurring portion)
        const amountPaid = (invoice.amount_paid || 0) / 100;
        const pointsEarned = Math.floor(amountPaid * 6); // 2× of base 3 pts/$

        // Insert order row for the renewal
        const { data: orderInsert } = await supabase
          .from("orders")
          .insert({
            profile_id: subRow.profile_id,
            items: JSON.stringify([
              {
                productName: subRow.product_name,
                quantity: subRow.quantity,
                price: subRow.unit_amount,
                lineTotal: Number(subRow.unit_amount) * Number(subRow.quantity),
              },
            ]),
            subtotal: amountPaid,
            shipping: 0,
            total: amountPaid,
            points_earned: pointsEarned,
            status: "paid",
            is_autoship: true,
            payment_method: "stripe",
            stripe_payment_intent_id: String((invoice as unknown as { payment_intent?: string }).payment_intent || invoice.id),
            paid_at: new Date().toISOString(),
          })
          .select("id, order_number")
          .single();

        // Award points
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("points_balance, lifetime_points")
          .eq("id", subRow.profile_id)
          .single();

        if (profileRow) {
          await supabase
            .from("points_transactions")
            .insert({
              profile_id: subRow.profile_id,
              amount: pointsEarned,
              type: "autoship",
              description: `Autoship renewal — ${subRow.product_name} (2× points)`,
              order_reference: orderInsert?.id || null,
            });

          await supabase
            .from("profiles")
            .update({
              points_balance: (profileRow.points_balance || 0) + pointsEarned,
              lifetime_points: (profileRow.lifetime_points || 0) + pointsEarned,
              autoship_active: true,
            })
            .eq("id", subRow.profile_id);
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
