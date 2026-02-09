import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const LOGO_URL = "https://jpwkbeywurvrrwgxkvop.supabase.co/storage/v1/object/public/email-assets/logo.png?v=1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeRequest {
  email: string;
  fullName: string;
  pointsEarned: number;
  orderNumber?: string;
  referralCode?: string;
  scheduledAt?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, pointsEarned, orderNumber, referralCode, scheduledAt }: WelcomeRequest = await req.json();
    console.log("Sending welcome email to:", email, scheduledAt ? `(scheduled: ${scheduledAt})` : "(immediate)");

    if (!email || !fullName) {
      throw new Error("Missing required fields: email and fullName");
    }

    // Generate a magic link using Supabase Admin
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: "https://vertexresearchlabs.com/dashboard",
      },
    });

    let magicLinkUrl = "https://vertexresearchlabs.com/auth";

    if (linkData?.properties?.action_link && !linkError) {
      magicLinkUrl = linkData.properties.action_link;
      console.log("Magic link generated successfully");
    } else {
      console.warn("Could not generate magic link, falling back to auth page:", linkError?.message);
    }

    // Dynamic subject line — avoid spam triggers (no ALL CAPS, no exclamation, no "free"/"earn")
    const subjectLine = pointsEarned > 0
      ? `Your Vertex Rewards Summary — ${pointsEarned} points added`
      : "Your Vertex Rewards account is ready";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #1a1f2e; margin: 0; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #1e293b 0%, #1a1f2e 100%); border-radius: 16px; overflow: hidden; border: 1px solid rgba(0, 180, 216, 0.2); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e293b 0%, #2d3a4f 50%, #1e293b 100%); padding: 40px 32px; text-align: center; border-bottom: 1px solid rgba(0, 180, 216, 0.15);">
            <img src="${LOGO_URL}" alt="Vertex Research Labs" style="height: 60px; width: auto; margin-bottom: 20px;" />
            ${pointsEarned > 0 ? `
            <h1 style="color: #f1f5f9; font-size: 28px; margin: 0 0 4px 0; font-weight: 700;">${pointsEarned} Rewards Points Added</h1>
            ` : `
            <h1 style="color: #f1f5f9; font-size: 28px; margin: 0 0 4px 0; font-weight: 700;">Your Vertex Rewards Are Ready</h1>
            `}
            <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0 0;">${orderNumber ? `Order ${orderNumber} · ` : ''}from your recent order</p>
          </div>

          <!-- Content -->
          <div style="padding: 32px;">
            <p style="color: #f1f5f9; font-size: 16px; margin: 0 0 20px 0;">
              Hi ${fullName},
            </p>
            <p style="color: #cbd5e1; font-size: 15px; line-height: 1.7; margin: 0 0 8px 0;">
              Your account has already been created using the email from your order.
            </p>
            <p style="color: #cbd5e1; font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
              Activate it now to track rewards, unlock credits, and earn free product faster.
            </p>

            <!-- Points Earned Banner -->
            ${pointsEarned > 0 ? `
            <div style="background: linear-gradient(135deg, rgba(0, 180, 216, 0.12) 0%, rgba(0, 180, 216, 0.06) 100%); border-radius: 12px; padding: 28px; margin: 0 0 28px 0; border: 1px solid rgba(0, 180, 216, 0.2); text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Points Earned</p>
              <p style="color: #00b4d8; font-size: 52px; margin: 0; font-weight: 800; line-height: 1; letter-spacing: -1px;">+${pointsEarned}</p>
              <p style="color: #64748b; font-size: 13px; margin: 10px 0 0 0;">Waiting in your account</p>
            </div>
            ` : ''}

            <!-- Magic Link CTA -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${magicLinkUrl}" style="display: inline-block; background: linear-gradient(135deg, #00b4d8 0%, #0284c7 100%); color: #ffffff; padding: 18px 48px; border-radius: 10px; text-decoration: none; font-size: 17px; font-weight: 700; letter-spacing: 0.3px; box-shadow: 0 4px 20px rgba(0, 180, 216, 0.35);">
                Activate My Account →
              </a>
            </div>

            <p style="color: #64748b; font-size: 13px; text-align: center; margin: 0 0 32px 0;">
              Takes less than 10 seconds. No re-entering your email.
            </p>

            <!-- Rewards Info -->
            <div style="background: rgba(51, 65, 85, 0.4); border-radius: 12px; padding: 24px; margin: 0 0 24px 0; border: 1px solid rgba(100, 116, 139, 0.3);">
              <h3 style="color: #00b4d8; font-size: 14px; margin: 0 0 16px 0; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">What You Unlock</h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 10px 12px; color: #f1f5f9; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">🧬 Earn 3 points per $1 spent</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; color: #f1f5f9; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">🎁 Redeem 500 pts for $20 credit</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; color: #f1f5f9; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">🚀 Activate Autoship to earn 6 pts per $1</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; color: #f1f5f9;">🤝 Share your code — friends get 10% off, you earn 3× points</td>
                </tr>
              </table>
            </div>

            ${referralCode ? `
            <!-- Referral Link Section -->
            <div style="background: linear-gradient(135deg, rgba(0, 180, 216, 0.08) 0%, rgba(0, 180, 216, 0.04) 100%); border-radius: 12px; padding: 24px; margin: 0 0 24px 0; border: 1px solid rgba(0, 180, 216, 0.2);">
              <h3 style="color: #00b4d8; font-size: 14px; margin: 0 0 12px 0; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">Your Referral Link</h3>
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
                Share with colleagues — they get <span style="color: #f1f5f9; font-weight: 600;">10% off</span>, you earn <span style="color: #00b4d8; font-weight: 600;">3× points</span> on their order.
              </p>
              <div style="background: rgba(15, 23, 42, 0.6); border-radius: 8px; padding: 14px 16px; margin: 0 0 16px 0; border: 1px solid rgba(100, 116, 139, 0.3);">
                <p style="color: #00b4d8; font-size: 14px; margin: 0; font-family: monospace; word-break: break-all;">
                  https://vertexresearchlabs.com?ref=${referralCode}
                </p>
              </div>
              <p style="color: #64748b; font-size: 12px; margin: 0;">
                Tracked automatically — your friends don't need a code.
              </p>
            </div>
            ` : ''}

            <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.6;">
              Questions? Reply to this email or contact us at <a href="mailto:info@vertexresearchlabs.com" style="color: #00b4d8; text-decoration: none;">info@vertexresearchlabs.com</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: linear-gradient(180deg, rgba(0, 180, 216, 0.08) 0%, transparent 100%); padding: 32px; text-align: center; border-top: 1px solid rgba(0, 180, 216, 0.15);">
            <img src="${LOGO_URL}" alt="Vertex Research Labs" style="height: 32px; width: auto; margin-bottom: 16px; opacity: 0.7;" />
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Vertex Research Labs. All rights reserved.
            </p>
            <p style="color: #475569; font-size: 11px; margin: 12px 0 0 0;">
              For laboratory research use only. Not for human or veterinary use.
            </p>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(100, 116, 139, 0.3);">
              <a href="https://vertexresearchlabs.com" style="color: #00b4d8; font-size: 12px; text-decoration: none;">vertexresearchlabs.com</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Build send options — use scheduledAt for delayed delivery if provided
    const sendOptions: any = {
      from: "Vertex Research Labs <info@vertexresearchlabs.com>",
      to: [email],
      subject: subjectLine,
      html: emailHtml,
    };

    if (scheduledAt) {
      sendOptions.scheduledAt = scheduledAt;
      console.log(`Email scheduled for: ${scheduledAt}`);
    }

    const emailResponse = await resend.emails.send(sendOptions);
    console.log("Welcome email sent/scheduled:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-welcome-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
