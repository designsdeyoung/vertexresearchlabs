import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnnounceRequest {
  emails: string[];
  compoundName: string;
  compoundUrl: string;
}

const announceHtml = (compoundName: string, compoundUrl: string) => `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
  <p style="font-size: 15px; line-height: 1.6;">A new reference compound is now available at Vertex Research Labs:</p>
  <p style="font-size: 18px; font-weight: 600; margin: 16px 0;">${compoundName}</p>
  <p style="font-size: 15px; line-height: 1.6;">Like everything in the catalog, it ships with a batch-specific COA and independent HPLC verification.</p>
  <p style="font-size: 15px; line-height: 1.6;">
    <a href="${compoundUrl}" style="color: #0F6E56; font-weight: 600;">View ${compoundName} →</a>
  </p>
  <div style="border-top: 1px solid #e5e5e5; padding-top: 20px; margin-top: 28px; font-size: 12px; color: #999;">
    <p>Vertex Research Labs · For laboratory research use only. Not for human or veterinary use.</p>
    <p><a href="mailto:info@vertexresearchlabs.com?subject=unsubscribe" style="color: #999;">Unsubscribe</a></p>
  </div>
</div>`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { emails, compoundName, compoundUrl }: AnnounceRequest = await req.json();
    if (!Array.isArray(emails) || emails.length === 0 || !compoundName || !compoundUrl) {
      return new Response(JSON.stringify({ error: "Missing emails, compoundName, or compoundUrl" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const html = announceHtml(compoundName, compoundUrl);
    const subject = `New compound available: ${compoundName}`;
    const headers = { "List-Unsubscribe": "<mailto:info@vertexresearchlabs.com?subject=unsubscribe>" };

    // Send individually so each recipient gets a private To: (no shared BCC list).
    // Chunked to avoid hammering the API.
    const clean = [...new Set(emails.map((e) => e.trim().toLowerCase()).filter(Boolean))];
    let sent = 0;
    const CHUNK = 20;
    for (let i = 0; i < clean.length; i += CHUNK) {
      const batch = clean.slice(i, i + CHUNK);
      const results = await Promise.allSettled(
        batch.map((to) =>
          resend.emails.send({
            from: "Vertex Research Labs <info@vertexresearchlabs.com>",
            to: [to],
            subject,
            html,
            headers,
          }),
        ),
      );
      sent += results.filter((r) => r.status === "fulfilled").length;
    }

    return new Response(JSON.stringify({ success: true, sent, total: clean.length }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error("send-new-compound-announcement error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
