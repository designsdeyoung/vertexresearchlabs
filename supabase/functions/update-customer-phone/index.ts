import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAILS = [
  "info@vertexdata.ai",
  "designsdeyoung@gmail.com",
  "adamdeyoung11@gmail.com",
  "info@vertexresearchlabs.com",
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const token = (req.headers.get("authorization") || "").replace("Bearer ", "").trim();
    const { data: { user }, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !user || !ADMIN_EMAILS.includes(user.email || "")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { orderId, phoneNumber } = await req.json();
    const phone = String(phoneNumber || "").trim();
    if (!orderId) throw new Error("orderId required");
    if (phone.length < 7 || phone.length > 30 || !/^[0-9+().\-\s]+$/.test(phone)) {
      return new Response(JSON.stringify({ error: "Enter a valid phone number" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: order, error: orderErr } = await admin
      .from("orders")
      .select("profile_id")
      .eq("id", orderId)
      .maybeSingle();
    if (orderErr) throw orderErr;
    if (!order?.profile_id) throw new Error("This order is not linked to a customer profile");

    const { error: updateErr } = await admin
      .from("profiles")
      .update({ phone_number: phone })
      .eq("id", order.profile_id);
    if (updateErr) throw updateErr;

    return new Response(JSON.stringify({ success: true, phoneNumber: phone }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    console.error("update-customer-phone error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
