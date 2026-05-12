import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const REWARD_TIERS = [
  { points: 250, credit: 10, minCart: 75, maxPercent: 100, label: "$10 Vertex Credit" },
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Rewards service is not configured");
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey
    );

    const jwt = authHeader.replace(/^Bearer\s+/i, "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(jwt);
    const user = userData?.user;

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: redemption, error: redemptionError } = await supabaseAdmin
      .rpc("redeem_reward_credit", {
        _user_id: user.id,
        _points: selectedTier.points,
      })
      .single();

    if (redemptionError || !redemption) {
      const message = redemptionError?.message || "Unable to redeem points";
      const status = message.includes("Profile not found") ? 404 : 400;

      return new Response(JSON.stringify({ error: message }), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const credit = {
      id: redemption.credit_id,
      amount: redemption.credit_amount,
      points_cost: redemption.credit_points_cost,
      min_cart: redemption.credit_min_cart,
      max_percent: redemption.credit_max_percent,
    };

    return new Response(
      JSON.stringify({
        success: true,
        credit,
        pointsBalance: redemption.new_points_balance,
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