import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const orderNumber = (body.orderNumber || "").toString().trim();
    const fullName = (body.fullName || "").toString().trim();
    const email = (body.email || "").toString().trim();
    const zip = (body.zip || "").toString().trim();

    // Require at least: (orderNumber + name) OR (name + email) OR (name + zip)
    if (!fullName || (!orderNumber && !email && !zip)) {
      return new Response(
        JSON.stringify({
          error:
            "Please provide your full name plus an order number, email, or ZIP code.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find candidate profiles by name (case-insensitive)
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, full_name, email, zip_code")
      .ilike("full_name", fullName)
      .limit(20);

    let matchedProfileIds: string[] = [];
    if (profiles && profiles.length > 0) {
      matchedProfileIds = profiles
        .filter((p) => {
          const nameMatch = norm(p.full_name || "") === norm(fullName);
          if (!nameMatch) return false;
          if (email) return norm(p.email || "") === norm(email);
          if (zip) return (p.zip_code || "").trim() === zip;
          return true; // orderNumber path — name match is enough; we filter by order# below
        })
        .map((p) => p.id);
    }

    let query = admin
      .from("orders")
      .select(
        "id, order_number, items, subtotal, shipping, total, status, payment_method, created_at, paid_at"
      )
      .order("created_at", { ascending: false })
      .limit(10);

    if (orderNumber) {
      query = query.ilike("order_number", orderNumber);
    }
    if (matchedProfileIds.length > 0) {
      query = query.in("profile_id", matchedProfileIds);
    } else if (!orderNumber) {
      // No profile matched and no order#: nothing to look up
      return new Response(JSON.stringify({ orders: [] }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: orders, error } = await query;
    if (error) throw error;

    // If only orderNumber was given, ensure it's tied to a profile whose name matches
    let filtered = orders || [];
    if (orderNumber && matchedProfileIds.length === 0) {
      filtered = [];
    }

    return new Response(JSON.stringify({ orders: filtered }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("lookup-order error", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
