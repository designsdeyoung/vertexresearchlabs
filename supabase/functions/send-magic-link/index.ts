import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { email, redirectTo, subject, previewText, bcc } = await req.json();

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Generate magic link
    const { data: linkData, error: lErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: redirectTo || "https://vertexresearchlabs.lovable.app/shop" },
    });
    if (lErr) throw lErr;
    const magicLink = linkData.properties?.action_link;

    // Send via Resend
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#0a0a0a;color:#fff">
        <h1 style="color:#00B4D8;font-size:22px">Your Vertex Research Labs Login Link</h1>
        <p style="color:#ccc">${previewText || "Click below to log in to your account — no password needed."}</p>
        <p style="margin:28px 0">
          <a href="${magicLink}" style="background:#00B4D8;color:#000;padding:14px 24px;border-radius:6px;text-decoration:none;font-weight:bold">Log In to Order</a>
        </p>
        <p style="color:#888;font-size:12px">If the button doesn't work, paste this link: ${magicLink}</p>
        <hr style="border:none;border-top:1px solid #222;margin:32px 0"/>
        <p style="color:#666;font-size:11px">Research Use Only. Not for human consumption.</p>
      </div>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Vertex Research Labs <info@vertexresearchlabs.com>",
        to: [email],
        bcc: bcc ? [bcc] : undefined,
        subject: subject || "Your Vertex Research Labs Login Link",
        html,
      }),
    });
    const resendData = await resendRes.json();

    return new Response(
      JSON.stringify({ success: true, magicLink, resend: resendData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
