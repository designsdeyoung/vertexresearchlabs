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

    const { customerEmail, customerName, items, subtotal, shipping, total, creditApplied, creditId } = body;

    if (!customerEmail || !items || items.length === 0) {
      throw new Error("Missing required fields: customerEmail, items");
    }

    // Find or note the profile (profile may not exist yet if user hasn't signed up)
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, user_id, points_balance, lifetime_points")
      .eq("email", customerEmail)
      .maybeSingle();

    // Calculate points earned
    const pointsEarned = Math.floor(subtotal * POINTS_PER_DOLLAR);

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
      .select("id")
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    console.log("Order created:", order.id);

    // If profile exists, award points and handle credit
    if (profile) {
      // Award points
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

      // Update profile balance
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

      // Mark credit as used if one was applied
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
    } else {
      console.log(`No profile found for ${customerEmail}. Points (${pointsEarned}) will be awarded when they create an account.`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        pointsEarned,
        profileFound: !!profile,
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
