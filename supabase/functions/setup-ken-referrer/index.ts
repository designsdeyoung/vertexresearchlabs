import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const email = "kenneth.russell1996@gmail.com";
  const fullName = "Ken Russell";

  // Find or create auth user
  const { data: list } = await admin.auth.admin.listUsers();
  let user = list?.users?.find((u) => u.email === email);
  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    user = data.user!;
  }

  // Find or create profile
  const { data: existing } = await admin.from("profiles").select("id, referral_code").eq("user_id", user.id).maybeSingle();
  let profileId = existing?.id;
  if (!profileId) {
    const { data, error } = await admin.from("profiles").insert({
      user_id: user.id,
      email,
      full_name: fullName,
      referral_code: "KEN10",
    }).select("id").single();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    profileId = data.id;
  } else {
    await admin.from("profiles").update({ referral_code: "KEN10" }).eq("id", profileId);
  }

  return new Response(JSON.stringify({ ok: true, userId: user.id, profileId, code: "KEN10" }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
