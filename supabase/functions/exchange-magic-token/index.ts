import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE = "https://vertexresearchlabs.com";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { token, add, qty } = await req.json();
    if (!token) throw new Error("token required");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find profile by magic_token
    const { data: profile, error: pErr } = await admin
      .from("profiles")
      .select("id, email, full_name")
      .eq("magic_token", token)
      .maybeSingle();

    if (pErr || !profile?.email) {
      throw new Error("Invalid or expired token");
    }

    // Generate a Supabase magic link for this email
    const redirectTo = add
      ? `${SITE}/dashboard?add=${encodeURIComponent(add)}&qty=${encodeURIComponent(String(qty ?? 1))}`
      : `${SITE}/dashboard`;

    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: profile.email,
      options: {
        redirectTo,
      },
    });

    if (linkErr || !linkData?.properties?.action_link) {
      throw new Error("Could not generate sign-in link");
    }

    return new Response(
      JSON.stringify({ url: linkData.properties.action_link }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error("exchange-magic-token error:", e);
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
