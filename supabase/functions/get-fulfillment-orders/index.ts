import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAILS = ["info@vertexdata.ai", "designsdeyoung@gmail.com", "adamdeyoung11@gmail.com", "info@vertexresearchlabs.com"];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // Verify the caller is an admin using their JWT
    const authHeader = req.headers.get("authorization") || "";
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { authorization: authHeader } } }
    );
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user || !ADMIN_EMAILS.includes(user.email || "")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { filter } = await req.json().catch(() => ({ filter: "unfulfilled" }));

    // Use service role to bypass RLS
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let query = admin
      .from("orders")
      .select(`*, profiles!orders_profile_id_fkey(full_name, email, address_line1, address_line2, city, state, zip_code)`)
      .order("created_at", { ascending: false })
      .limit(200);

    if (filter === "unfulfilled") {
      query = query.not("status", "eq", "shipped").is("tracking_number", null);
    }

    const { data, error } = await query;
    if (error) throw error;

    return new Response(JSON.stringify({ orders: data || [] }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("get-fulfillment-orders error", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
