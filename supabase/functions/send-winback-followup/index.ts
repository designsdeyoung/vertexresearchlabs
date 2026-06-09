import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const SITE = "https://vertexresearchlabs.com";

serve(async (req) => {
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: profiles } = await admin.from("profiles").select("email, full_name, points_balance").gt("points_balance", 0);

  const results = [];
  for (const p of profiles ?? []) {
    const firstName = (p.full_name || "there").split(" ")[0];
    const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;background:#0a0a0a;color:#fff;max-width:560px;margin:0 auto;padding:28px 24px">
      <p style="color:#bbb;font-size:15px;margin:0 0 14px">Hey ${firstName},</p>
      <p style="color:#fff;font-size:15px;line-height:1.7;margin:0 0 14px">Quick follow-up — the link in our last email had a technical issue on our end. Sorry about that.</p>
      <p style="color:#bbb;font-size:15px;line-height:1.7;margin:0 0 24px">Your ${p.points_balance.toLocaleString()} points are all still there. Click below to shop and log in with your email — takes 10 seconds.</p>
      <div style="text-align:center;margin:0 0 28px">
        <a href="${SITE}/shop" style="display:inline-block;background:#00B4D8;color:#000;font-size:16px;font-weight:700;text-decoration:none;padding:15px 36px;border-radius:6px">Shop &amp; use my points →</a>
      </div>
      <p style="color:#777;font-size:14px;margin:0 0 4px">Again, sorry for the inconvenience.</p>
      <p style="color:#777;font-size:14px;margin:0 0 24px">— Adam<br/>Vertex Research Labs</p>
      <hr style="border:none;border-top:1px solid #1a1a1a;margin:0 0 16px"/>
      <p style="color:#444;font-size:11px;text-align:center;margin:0">Research Use Only. Not for human consumption.<br/><a href="${SITE}/unsubscribe" style="color:#444;text-decoration:none">Unsubscribe</a></p>
    </div>`;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Adam @ Vertex Research Labs <info@vertexresearchlabs.com>",
        to: [p.email],
        bcc: ["designsdeyoung@gmail.com"],
        subject: `${firstName}, quick correction on our last email`,
        html,
        headers: { "List-Unsubscribe": `<${SITE}/unsubscribe>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
      }),
    });
    const d = await r.json();
    results.push({ email: p.email, status: d.id ? "sent" : "error" });
    await new Promise(res => setTimeout(res, 600));
  }

  return new Response(JSON.stringify({ total: results.length, results }), { headers: { "Content-Type": "application/json" } });
});
