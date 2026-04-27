import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const REWARD_TIERS = [
  { points: 500, credit: 20, minCart: 100, maxPercent: 100, label: "$20 Vertex Credit" },
  { points: 750, credit: 30, minCart: 120, maxPercent: 100, label: "$30 Vertex Credit" },
  { points: 1000, credit: 40, minCart: 150, maxPercent: 100, label: "$40 Vertex Credit" },
  { points: 1500, credit: 65, minCart: 200, maxPercent: 100, label: "$65 Vertex Credit" },
  { points: 2000, credit: 90, minCart: 250, maxPercent: 100, label: "$90 Vertex Credit" },
  { points: 3000, credit: 140, minCart: 350, maxPercent: 100, label: "$140 Vertex Credit" },
  { points: 5000, credit: 250, minCart: 500, maxPercent: 100, label: "$250 Vertex Credit" },
] as const;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { points } = await req.json();
    const selectedTier = REWARD_TIERS.find((tier) => tier.points === Number(points));

    if (!selectedTier) {
      return new Response(JSON.stringify({ error: "Invalid reward tier" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    const user = userData?.user;

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, points_balance")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (profile.points_balance < selectedTier.points) {
      return new Response(JSON.stringify({ error: "Not enough points" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: activeCredit } = await supabaseAdmin
      .from("credits")
      .select("id")
      .eq("profile_id", profile.id)
      .eq("status", "active")
      .maybeSingle();

    if (activeCredit) {
      return new Response(JSON.stringify({ error: "An unused credit already exists" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const newBalance = profile.points_balance - selectedTier.points;

    const { data: credit, error: creditError } = await supabaseAdmin
      .from("credits")
      .insert({
        profile_id: profile.id,
        amount: selectedTier.credit,
        points_cost: selectedTier.points,
        min_cart: selectedTier.minCart,
        max_percent: selectedTier.maxPercent,
        status: "active",
      })
      .select("id, amount, points_cost, min_cart, max_percent")
      .single();

    if (creditError || !credit) {
      return new Response(JSON.stringify({ error: "Unable to create credit" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: transactionError } = await supabaseAdmin
      .from("points_transactions")
      .insert({
        profile_id: profile.id,
        amount: -selectedTier.points,
        type: "redemption",
        description: `Redeemed ${selectedTier.label}`,
        order_reference: credit.id,
      });

    if (transactionError) {
      return new Response(JSON.stringify({ error: "Unable to record redemption" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ points_balance: newBalance })
      .eq("id", profile.id);

    if (updateError) {
      return new Response(JSON.stringify({ error: "Unable to update points balance" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        credit,
        pointsBalance: newBalance,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error redeeming credit:", error);
    return new Response(JSON.stringify({ error: error.message || "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);