import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { code, customerEmail } = await req.json();

    if (!code || !code.trim()) {
      return new Response(
        JSON.stringify({ valid: false, reason: "No code provided" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const normalizedCode = code.trim().toUpperCase();

    // Special promo codes (10% off + free shipping, no min order)
    const SPECIAL_PROMOS: Record<string, { discount: number; freeShipping: boolean }> = {
      PATRICIA10: { discount: 0.10, freeShipping: true },
    };

    if (SPECIAL_PROMOS[normalizedCode]) {
      const promo = SPECIAL_PROMOS[normalizedCode];
      return new Response(
        JSON.stringify({
          valid: true,
          referrerId: null,
          isPromo: true,
          discount: promo.discount,
          freeShipping: promo.freeShipping,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Look up the referral code using service role (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .eq("referral_code", normalizedCode)
      .maybeSingle();

    if (error || !data) {
      return new Response(
        JSON.stringify({ valid: false, reason: "Code not found" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Block self-referral
    if (customerEmail && data.email === customerEmail.trim().toLowerCase()) {
      return new Response(
        JSON.stringify({ valid: false, reason: "Cannot use your own code" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ valid: true, referrerId: data.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (err: any) {
    console.error("Error validating discount:", err);
    return new Response(
      JSON.stringify({ valid: false, reason: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
