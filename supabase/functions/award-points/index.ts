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

    const { customerEmail, customerName, items, subtotal, shipping, total, creditApplied, creditId, referrerCode } = body;

    if (!customerEmail || !items || items.length === 0) {
      throw new Error("Missing required fields: customerEmail, items");
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
        .select("id, user_id, points_balance, lifetime_points")
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
    const orderData = {
      profile_id: profile?.id || null,
      items: JSON.stringify(items),
      subtotal,
      shipping,
      total,
      credit_applied: creditApplied || 0,
      points_earned: pointsEarned,
      status: "pending",
      is_autoship: false,
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

    // Handle referral attribution
    if (referrerCode && profile) {
      try {
        // Find the referrer profile by referral_code
        const { data: referrerProfile } = await supabaseAdmin
          .from("profiles")
          .select("id, user_id, email")
          .eq("referral_code", referrerCode)
          .maybeSingle();

        if (referrerProfile) {
          // Block self-referrals (same email or same profile)
          const isSelfReferral = referrerProfile.email === customerEmail || referrerProfile.id === profile.id;

          if (!isSelfReferral) {
            // Check for duplicate referral (same referred email)
            const { data: existingReferral } = await supabaseAdmin
              .from("referrals")
              .select("id")
              .eq("referrer_id", referrerProfile.id)
              .eq("referred_email", customerEmail)
              .maybeSingle();

            if (!existingReferral) {
              // Create pending referral record (points awarded after shipment)
              const { error: refError } = await supabaseAdmin
                .from("referrals")
                .insert({
                  referrer_id: referrerProfile.id,
                  referred_email: customerEmail,
                  referred_profile_id: profile.id,
                  status: "pending",
                  points_awarded: 0,
                });

              if (refError) {
                console.error("Error creating referral:", refError);
              } else {
                console.log(`Referral created: ${referrerProfile.id} referred ${customerEmail}`);
              }

              // Store referred_by on the new profile
              await supabaseAdmin
                .from("profiles")
                .update({ referred_by: referrerProfile.id })
                .eq("id", profile.id);
            } else {
              console.log("Duplicate referral blocked:", customerEmail);
            }
          } else {
            console.log("Self-referral blocked:", customerEmail);
          }
        } else {
          console.log("Referrer code not found:", referrerCode);
        }
      } catch (refErr) {
        console.error("Error processing referral:", refErr);
      }
    }

    if (isNewAccount) {
      // Schedule 4 minutes from now using Resend's scheduledAt
      const scheduledAt = new Date(Date.now() + 4 * 60 * 1000).toISOString();
      
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
        
        const welcomeResponse = await fetch(`${supabaseUrl}/functions/v1/send-welcome-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            email: customerEmail,
            fullName: customerName,
            pointsEarned,
            orderNumber: order.order_number,
            scheduledAt,
          }),
        });

        const welcomeResult = await welcomeResponse.json();
        console.log("Welcome email scheduled:", welcomeResult);
      } catch (welcomeErr) {
        console.error("Error scheduling welcome email:", welcomeErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        orderNumber: order.order_number,
        pointsEarned,
        profileFound: !!profile,
        accountCreated: isNewAccount,
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
