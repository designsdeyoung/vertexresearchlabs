import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const POINTS_PER_DOLLAR = 3;

interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

interface AwardPointsRequest {
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  creditApplied?: number;
  creditId?: string;
  referrerCode?: string;
  discountCode?: string;
  discountAmount?: number;
  stripePaymentIntentId?: string;
  paymentMethod?: string;
  shippingAddress?: {
    name?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}


const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body: AwardPointsRequest = await req.json();
    console.log("Award points request:", JSON.stringify(body, null, 2));

    const { customerEmail, customerName, items, subtotal, shipping, total, creditApplied, creditId, referrerCode, discountCode, discountAmount, stripePaymentIntentId, paymentMethod, shippingAddress } = body;

    if (!customerEmail || !items || items.length === 0) {
      throw new Error("Missing required fields: customerEmail, items");
    }

    // Idempotency: if this PaymentIntent already produced an order, return it
    if (stripePaymentIntentId) {
      const { data: existingOrder } = await supabaseAdmin
        .from("orders")
        .select("id, order_number, points_earned")
        .eq("stripe_payment_intent_id", stripePaymentIntentId)
        .maybeSingle();

      if (existingOrder) {
        console.log("Idempotent return for PaymentIntent", stripePaymentIntentId, existingOrder.id);
        return new Response(
          JSON.stringify({
            success: true,
            orderId: existingOrder.id,
            orderNumber: existingOrder.order_number,
            pointsEarned: existingOrder.points_earned,
            alreadyProcessed: true,
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }


    // Calculate points earned
    const pointsEarned = Math.floor(subtotal * POINTS_PER_DOLLAR);

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === customerEmail);

    let userId: string | null = null;
    let isNewAccount = false;

    if (existingUser) {
      userId = existingUser.id;
      console.log(`Existing auth user found: ${userId}`);
    } else {
      // Silently create user account — no password, no confirmation email
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: customerEmail,
        email_confirm: true, // Mark email as confirmed (they just used it to order)
        user_metadata: { full_name: customerName },
      });

      if (createError) {
        console.error("Error creating user account:", createError.message);
      } else if (newUser?.user) {
        userId = newUser.user.id;
        isNewAccount = true;
        console.log(`Silent account created for ${customerEmail}: ${userId}`);
      }
    }

    // Find or create profile
    let profile = null;

    if (userId) {
      const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("id, user_id, points_balance, lifetime_points, referred_by")
        .eq("user_id", userId)
        .maybeSingle();

      if (existingProfile) {
        profile = existingProfile;
      } else {
        // Create profile
        const { data: newProfile, error: profileError } = await supabaseAdmin
          .from("profiles")
          .insert({
            user_id: userId,
            email: customerEmail,
            full_name: customerName,
            points_balance: 0,
            lifetime_points: 0,
          })
          .select("id, user_id, points_balance, lifetime_points")
          .single();

        if (profileError) {
          console.error("Error creating profile:", profileError.message);
        } else {
          profile = newProfile;
          console.log(`Profile created: ${profile?.id}`);
        }
      }
    }

    // Create order record
    const orderData: Record<string, unknown> = {
      profile_id: profile?.id || null,
      items: JSON.stringify(items),
      subtotal,
      shipping,
      total,
      credit_applied: creditApplied || 0,
      points_earned: pointsEarned,
      status: "pending",
      is_autoship: false,
      discount_code: discountCode || null,
      discount_amount: discountAmount || 0,
      stripe_payment_intent_id: stripePaymentIntentId || null,
      payment_method: paymentMethod || "stripe",
      paid_at: stripePaymentIntentId ? new Date().toISOString() : null,
      shipping_name: shippingAddress?.name || customerName || null,
      shipping_address1: shippingAddress?.address1 || null,
      shipping_address2: shippingAddress?.address2 || null,
      shipping_city: shippingAddress?.city || null,
      shipping_state: shippingAddress?.state || null,
      shipping_zip: shippingAddress?.zip || null,
    };


    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert(orderData)
      .select("id, order_number")
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    console.log("Order created:", order.id);

    // Award points if profile exists
    if (profile) {
      const { error: txError } = await supabaseAdmin
        .from("points_transactions")
        .insert({
          profile_id: profile.id,
          amount: pointsEarned,
          type: "purchase",
          description: `Order ${order.id.slice(0, 8)} — ${items.length} item(s)`,
          order_reference: order.id,
        });

      if (txError) {
        console.error("Error recording points transaction:", txError);
      }

      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          points_balance: profile.points_balance + pointsEarned,
          lifetime_points: profile.lifetime_points + pointsEarned,
        })
        .eq("id", profile.id);

      if (updateError) {
        console.error("Error updating profile points:", updateError);
      }

      // Fire points-earned email to the buyer (non-blocking)
      try {
        await supabaseAdmin.functions.invoke("send-points-earned-email", {
          body: {
            profileId: profile.id,
            pointsEarned,
            reason: `Thanks for your order — you earned`,
          },
        });
      } catch (e) { console.error("buyer points email failed:", e); }

      // Mark credit as used
      if (creditId && creditApplied && creditApplied > 0) {
        const { error: creditError } = await supabaseAdmin
          .from("credits")
          .update({
            status: "used",
            used_on_order: order.id,
          })
          .eq("id", creditId)
          .eq("profile_id", profile.id);

        if (creditError) {
          console.error("Error marking credit as used:", creditError);
        }
      }

      console.log(`Awarded ${pointsEarned} points to profile ${profile.id}`);
    }

    // Handle referral attribution — lifetime earning for referrers
    if (profile) {
      try {
        // Determine which referrer to credit this order to
        let referrerIdToAward: string | null = null;
        let isFirstReferral = false;

        if (referrerCode) {
          // Referral code explicitly entered (first order or re-entered)
          const { data: referrerByCode } = await supabaseAdmin
            .from("profiles")
            .select("id, email")
            .eq("referral_code", referrerCode)
            .maybeSingle();

          if (referrerByCode) {
            const isSelf = referrerByCode.email === customerEmail || referrerByCode.id === profile.id;
            if (!isSelf) {
              // Check if this referral relationship already exists
              const { data: existingReferral } = await supabaseAdmin
                .from("referrals")
                .select("id")
                .eq("referrer_id", referrerByCode.id)
                .eq("referred_email", customerEmail)
                .maybeSingle();

              if (!existingReferral) {
                // First-ever referral — create the relationship record
                await supabaseAdmin.from("referrals").insert({
                  referrer_id: referrerByCode.id,
                  referred_email: customerEmail,
                  referred_profile_id: profile.id,
                  status: "completed",
                  points_awarded: 0, // updated below after we know the multiplier
                });
                // Persist the lifetime link on the customer's profile
                if (!profile.referred_by) {
                  await supabaseAdmin
                    .from("profiles")
                    .update({ referred_by: referrerByCode.id })
                    .eq("id", profile.id);
                }
                isFirstReferral = true;
              }
              referrerIdToAward = referrerByCode.id;
            } else {
              console.log("Self-referral blocked:", customerEmail);
            }
          } else {
            console.log("Referrer code not found:", referrerCode);
          }
        } else if (profile.referred_by) {
          // No code this order, but customer has a lifetime referral link — always credit referrer
          referrerIdToAward = profile.referred_by;
        }

        // Award the referrer for this order
        if (referrerIdToAward) {
          const { data: referrerData } = await supabaseAdmin
            .from("profiles")
            .select("id, email, full_name, points_balance, lifetime_points, referral_points_multiplier")
            .eq("id", referrerIdToAward)
            .single();

          if (referrerData) {
            const multiplier = referrerData.referral_points_multiplier || 3;
            const referralPoints = Math.floor(subtotal * multiplier);

            await supabaseAdmin.from("points_transactions").insert({
              profile_id: referrerData.id,
              amount: referralPoints,
              type: "referral",
              description: isFirstReferral
                ? `New referral: ${customerName} (${multiplier}× on $${subtotal.toFixed(2)})`
                : `Referral order: ${customerName} (${multiplier}× on $${subtotal.toFixed(2)})`,
            });

            const newBalance = referrerData.points_balance + referralPoints;
            await supabaseAdmin
              .from("profiles")
              .update({
                points_balance: newBalance,
                lifetime_points: referrerData.lifetime_points + referralPoints,
              })
              .eq("id", referrerData.id);

            console.log(`Referral: awarded ${referralPoints} pts (${multiplier}×) to ${referrerData.id} for order by ${customerEmail}`);

            // Send beautiful referral notification email (fire-and-forget)
            try {
              await supabaseAdmin.functions.invoke("send-referral-notification", {
                body: {
                  referrerProfileId: referrerData.id,
                  referrerEmail: referrerData.email,
                  customerName,
                  customerEmail,
                  subtotal,
                  pointsEarned: referralPoints,
                  multiplier,
                  newBalance,
                  isFirstReferral,
                },
              });
            } catch (e) { console.error("referral notification email failed:", e); }
          }
        }
      } catch (refErr) {
        console.error("Error processing referral:", refErr);
      }

      // ── Referral overrides: admin-approved multi-referrer exceptions ──
      try {
        const { data: overrides } = await supabaseAdmin
          .from("referral_overrides")
          .select("referrer_profile_id, multiplier")
          .eq("customer_email", customerEmail.toLowerCase());

        if (overrides && overrides.length > 0) {
          for (const ov of overrides) {
            // Skip if this referrer was already credited via the normal flow above
            if (ov.referrer_profile_id === profile.referred_by) continue;

            const { data: ovReferrer } = await supabaseAdmin
              .from("profiles")
              .select("id, email, full_name, points_balance, lifetime_points")
              .eq("id", ov.referrer_profile_id)
              .single();

            if (!ovReferrer) continue;

            const ovPoints = Math.floor(subtotal * ov.multiplier);

            await supabaseAdmin.from("points_transactions").insert({
              profile_id: ovReferrer.id,
              amount: ovPoints,
              type: "referral",
              description: `Override referral: ${customerName} (${ov.multiplier}× on $${subtotal.toFixed(2)})`,
            });

            await supabaseAdmin
              .from("profiles")
              .update({
                points_balance: ovReferrer.points_balance + ovPoints,
                lifetime_points: ovReferrer.lifetime_points + ovPoints,
              })
              .eq("id", ovReferrer.id);

            console.log(`Override referral: awarded ${ovPoints} pts to ${ovReferrer.full_name} for ${customerEmail}`);

            try {
              await supabaseAdmin.functions.invoke("send-referral-notification", {
                body: {
                  referrerProfileId: ovReferrer.id,
                  referrerEmail: ovReferrer.email,
                  customerName,
                  customerEmail,
                  subtotal,
                  pointsEarned: ovPoints,
                  multiplier: ov.multiplier,
                  newBalance: ovReferrer.points_balance + ovPoints,
                  isFirstReferral: false,
                },
              });
            } catch (e) { console.error("override referral notification failed:", e); }
          }
        }
      } catch (ovErr) {
        console.error("Error processing referral overrides:", ovErr);
      }
    }

    // Fetch the customer's referral code for the confirmation page
    let customerReferralCode: string | null = null;
    if (profile) {
      const { data: freshProfile } = await supabaseAdmin
        .from("profiles")
        .select("referral_code")
        .eq("id", profile.id)
        .maybeSingle();
      customerReferralCode = freshProfile?.referral_code || null;
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        orderNumber: order.order_number,
        pointsEarned,
        profileFound: !!profile,
        accountCreated: isNewAccount,
        referralCode: customerReferralCode,
        alreadyProcessed: false,

      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in award-points function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
