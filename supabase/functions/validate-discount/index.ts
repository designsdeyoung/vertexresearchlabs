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

    // Special promo codes
    const SPECIAL_PROMOS: Record<string, { discount: number; freeShipping: boolean; firstOrderOnly?: boolean; expiresAt?: string }> = {
      PATRICIA10: { discount: 0.10, freeShipping: true },
      ADAM10: { discount: 0.10, freeShipping: false },
      JODI30: { discount: 0.30, freeShipping: true, firstOrderOnly: true },
      GLOWUP: { discount: 0.20, freeShipping: true, expiresAt: "2026-04-27T04:59:59Z" },
      SHAWN10: { discount: 0.10, freeShipping: true },
      LISA10: { discount: 0.10, freeShipping: true },
    };

    if (SPECIAL_PROMOS[normalizedCode]) {
      const promo = SPECIAL_PROMOS[normalizedCode];

      // Enforce expiration
      if (promo.expiresAt && new Date() > new Date(promo.expiresAt)) {
        return new Response(
          JSON.stringify({ valid: false, reason: "This code has expired" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }


      // Enforce first-order-only restriction
      if (promo.firstOrderOnly) {
        const normalizedEmail = (customerEmail || "").trim().toLowerCase();
        if (!normalizedEmail) {
          return new Response(
            JSON.stringify({ valid: false, reason: "Email required for this code" }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // Find any profile with this email
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("email", normalizedEmail)
          .maybeSingle();

        if (profile) {
          const { count } = await supabaseAdmin
            .from("orders")
            .select("id", { count: "exact", head: true })
            .eq("profile_id", profile.id)
            .eq("status", "paid");

          if ((count ?? 0) > 0) {
            return new Response(
              JSON.stringify({ valid: false, reason: "Code valid for first order only" }),
              { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }
        }

        // Also check if this code was already used in any order
        const { count: usedCount } = await supabaseAdmin
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("discount_code", normalizedCode)
          .eq("status", "paid");

        if ((usedCount ?? 0) > 0) {
          return new Response(
            JSON.stringify({ valid: false, reason: "This code has already been redeemed" }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      }

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
