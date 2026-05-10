import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const LOGO_URL = "https://jpwkbeywurvrrwgxkvop.supabase.co/storage/v1/object/public/email-assets/logo.png?v=1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RefundRequest {
  email: string;
  fullName: string;
  creditAmount: number;
  pointsRefunded: number;
  newBalance: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { email, fullName, creditAmount, pointsRefunded, newBalance }: RefundRequest = await req.json();

    const firstName = (fullName || "").split(" ")[0] || "there";

    const html = `
    <!DOCTYPE html><html><head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color:#1a1f2e; margin:0; padding:40px 20px;">
      <div style="max-width:600px; margin:0 auto; background:linear-gradient(180deg,#1e293b 0%,#1a1f2e 100%); border-radius:16px; overflow:hidden; border:1px solid rgba(0,180,216,0.2); box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
        <div style="background:linear-gradient(135deg,#1e293b 0%,#2d3a4f 50%,#1e293b 100%); padding:40px 32px; text-align:center; border-bottom:1px solid rgba(0,180,216,0.15);">
          <img src="${LOGO_URL}" alt="Vertex Research Labs" style="height:60px;width:auto;margin-bottom:20px;" />
          <h1 style="color:#f1f5f9; font-size:26px; margin:0; font-weight:700;">Your Credit Has Been Refunded</h1>
          <p style="color:#94a3b8; font-size:14px; margin:10px 0 0 0;">${pointsRefunded.toLocaleString()} points returned to your account</p>
        </div>
        <div style="padding:32px;">
          <p style="color:#f1f5f9; font-size:16px; margin:0 0 20px 0;">Hi ${firstName},</p>
          <p style="color:#cbd5e1; font-size:15px; line-height:1.7; margin:0 0 16px 0;">
            We've reversed the unused <strong style="color:#f1f5f9;">$${creditAmount.toFixed(2)} Vertex Credit</strong> on your account
            and refunded the <strong style="color:#00b4d8;">${pointsRefunded.toLocaleString()} points</strong> back to your rewards balance.
          </p>
          <p style="color:#cbd5e1; font-size:15px; line-height:1.7; margin:0 0 28px 0;">
            You're now free to redeem a different reward tier or place a new order whenever you're ready.
          </p>

          <div style="background:linear-gradient(135deg,rgba(0,180,216,0.12) 0%,rgba(0,180,216,0.06) 100%); border-radius:12px; padding:28px; margin:0 0 28px 0; border:1px solid rgba(0,180,216,0.2); text-align:center;">
            <p style="color:#94a3b8; font-size:12px; margin:0 0 8px 0; text-transform:uppercase; letter-spacing:1px; font-weight:600;">Current Balance</p>
            <p style="color:#00b4d8; font-size:48px; margin:0; font-weight:800; line-height:1; letter-spacing:-1px;">${newBalance.toLocaleString()}</p>
            <p style="color:#64748b; font-size:13px; margin:10px 0 0 0;">Vertex Reward Points</p>
          </div>

          <div style="text-align:center; margin:32px 0;">
            <a href="https://vertexresearchlabs.com/dashboard" style="display:inline-block; background:linear-gradient(135deg,#00b4d8 0%,#0284c7 100%); color:#ffffff; padding:16px 40px; border-radius:10px; text-decoration:none; font-size:16px; font-weight:700; box-shadow:0 4px 20px rgba(0,180,216,0.35);">
              View My Dashboard →
            </a>
          </div>

          <p style="color:#94a3b8; font-size:14px; margin:24px 0 0 0; line-height:1.6;">
            Any questions? Just reply to this email or reach out at
            <a href="mailto:info@vertexresearchlabs.com" style="color:#00b4d8; text-decoration:none;">info@vertexresearchlabs.com</a>.
          </p>
        </div>
        <div style="background:linear-gradient(180deg,rgba(0,180,216,0.08) 0%,transparent 100%); padding:32px; text-align:center; border-top:1px solid rgba(0,180,216,0.15);">
          <img src="${LOGO_URL}" alt="Vertex Research Labs" style="height:32px;width:auto;margin-bottom:16px;opacity:0.7;" />
          <p style="color:#64748b; font-size:12px; margin:0;">© ${new Date().getFullYear()} Vertex Research Labs. All rights reserved.</p>
          <p style="color:#475569; font-size:11px; margin:12px 0 0 0;">For laboratory research use only. Not for human or veterinary use.</p>
        </div>
      </div>
    </body></html>`;

    const emailResponse = await resend.emails.send({
      from: "Vertex Research Labs <info@vertexresearchlabs.com>",
      to: [email],
      subject: `Your $${creditAmount.toFixed(2)} credit has been refunded — ${pointsRefunded.toLocaleString()} points returned`,
      html,
      headers: { "List-Unsubscribe": "<mailto:info@vertexresearchlabs.com?subject=unsubscribe>" },
    });

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("send-credit-refund error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
