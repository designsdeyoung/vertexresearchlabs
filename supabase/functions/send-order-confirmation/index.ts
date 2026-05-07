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

interface OrderItem {
  productName: string;
  size: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

interface OrderRequest {
  customer: {
    fullName: string;
    email: string;
    phoneNumber: string;
    organization: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    notes: string;
  };
  eligibilityType: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number | string;
  total: number;
  orderNumber?: string;
  pointsEarned?: number;
  referralCode?: string;
  isNewAccount?: boolean;
  discountAmount?: number;
  discountCode?: string;
  paymentMethod?: string;
}

const formatAddress = (customer: OrderRequest['customer']): string => {
  const lines = [customer.addressLine1];
  if (customer.addressLine2) {
    lines.push(customer.addressLine2);
  }
  lines.push(`${customer.city}, ${customer.state} ${customer.zipCode}`);
  lines.push(customer.country);
  return lines.join('\n');
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

const eligibilityLabels: Record<string, string> = {
  individual: "Individual Researcher",
  laboratory: "Laboratory or Institution",
  organization: "Other Research Organization",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: OrderRequest = await req.json();
    console.log("Received order request:", JSON.stringify(orderData, null, 2));

    const { customer, eligibilityType, items, subtotal, shipping, total, orderNumber, pointsEarned, referralCode, isNewAccount, discountAmount, discountCode, paymentMethod } = orderData;

    // Generate magic link for new accounts
    let magicLinkUrl = "";
    if (isNewAccount) {
      try {
        const supabaseAdmin = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
          type: "magiclink",
          email: customer.email,
          options: {
            redirectTo: "https://vertexresearchlabs.com/dashboard",
          },
        });
        if (linkData?.properties?.action_link && !linkError) {
          magicLinkUrl = linkData.properties.action_link;
          console.log("Magic link generated for merged email");
        }
      } catch (e) {
        console.error("Magic link generation failed:", e);
      }
    }

    // Build product list HTML
    const productListHtml = items
      .map(item => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid rgba(0, 180, 216, 0.1); color: #e2e8f0;">${item.productName}</td>
          <td style="padding: 12px; border-bottom: 1px solid rgba(0, 180, 216, 0.1); color: #94a3b8;">${item.size}</td>
          <td style="padding: 12px; border-bottom: 1px solid rgba(0, 180, 216, 0.1); text-align: center; color: #94a3b8;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid rgba(0, 180, 216, 0.1); text-align: right; color: #00b4d8; font-weight: 500;">${formatPrice(item.lineTotal)}</td>
        </tr>
      `)
      .join("");

    // Build shareable referral link
    const shareableLink = referralCode
      ? `https://vertexresearchlabs.com?ref=${referralCode}&discount=${referralCode}`
      : "";

    // Customer confirmation email — merged with rewards + activation
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #1a1f2e; margin: 0; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #1e293b 0%, #1a1f2e 100%); border-radius: 16px; overflow: hidden; border: 1px solid rgba(0, 180, 216, 0.2); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          
          <!-- Header with Logo -->
          <div style="background: linear-gradient(135deg, #1e293b 0%, #2d3a4f 50%, #1e293b 100%); padding: 40px 32px; text-align: center; border-bottom: 1px solid rgba(0, 180, 216, 0.15);">
            <img src="${LOGO_URL}" alt="Vertex Research Labs" style="height: 60px; width: auto; margin-bottom: 16px;" />
            <div style="display: inline-block; background: linear-gradient(90deg, rgba(0, 180, 216, 0.15) 0%, rgba(0, 180, 216, 0.08) 100%); padding: 8px 20px; border-radius: 20px; border: 1px solid rgba(0, 180, 216, 0.25);">
              <p style="color: #00b4d8; margin: 0; font-size: 13px; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase;">Order Confirmed</p>
            </div>
            ${orderNumber ? `
            <div style="margin-top: 12px;">
              <p style="color: #f1f5f9; font-size: 20px; font-weight: 700; margin: 0; letter-spacing: 1px;">${orderNumber}</p>
              <p style="color: #64748b; font-size: 11px; margin: 4px 0 0 0;">Keep this for your records</p>
            </div>
            ` : ''}
          </div>

          <!-- Content -->
          <div style="padding: 32px;">
            <p style="color: #f1f5f9; font-size: 16px; margin: 0 0 24px 0;">
              Dear ${customer.fullName},
            </p>
            <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
              Thank you for your order. We have received your inquiry and our team will review it shortly. You will receive a follow-up email with payment instructions and shipping details.
            </p>

            <!-- Order Details -->
            <div style="background: linear-gradient(135deg, rgba(0, 180, 216, 0.08) 0%, rgba(0, 180, 216, 0.04) 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid rgba(0, 180, 216, 0.15);">
              <h2 style="color: #00b4d8; font-size: 14px; margin: 0 0 16px 0; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">Order Details</h2>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                  <tr style="background: rgba(0, 180, 216, 0.12);">
                    <th style="padding: 12px; text-align: left; color: #00b4d8; font-weight: 500; border-radius: 6px 0 0 6px;">Product</th>
                    <th style="padding: 12px; text-align: left; color: #00b4d8; font-weight: 500;">Size</th>
                    <th style="padding: 12px; text-align: center; color: #00b4d8; font-weight: 500;">Qty</th>
                    <th style="padding: 12px; text-align: right; color: #00b4d8; font-weight: 500; border-radius: 0 6px 6px 0;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${productListHtml}
                </tbody>
              </table>

              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(0, 180, 216, 0.2);">
                <table style="width: 100%; font-size: 14px;">
                  <tr>
                    <td style="padding: 4px 0; color: #94a3b8;">Subtotal:</td>
                    <td style="padding: 4px 0; text-align: right; color: #f1f5f9; font-weight: 500;">${formatPrice(subtotal)}</td>
                  </tr>
                  ${discountAmount && discountAmount > 0 ? `
                  <tr>
                    <td style="padding: 4px 0; color: #94a3b8;">Discount${discountCode ? ` (${discountCode})` : ''}:</td>
                    <td style="padding: 4px 0; text-align: right; color: #10b981; font-weight: 500;">-${formatPrice(discountAmount)}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 4px 0; color: #94a3b8;">Shipping (US):</td>
                    <td style="padding: 4px 0; text-align: right; color: ${shipping === 0 ? '#10b981' : '#f1f5f9'}; font-weight: 500;">${shipping === 0 ? 'FREE' : formatPrice(Number(shipping))}</td>
                  </tr>
                  <tr style="border-top: 1px solid rgba(0, 180, 216, 0.15);">
                    <td style="padding: 12px 0 4px 0; color: #00b4d8; font-weight: 600; font-size: 15px;">Total:</td>
                    <td style="padding: 12px 0 4px 0; text-align: right; color: #00b4d8; font-weight: 600; font-size: 15px;">${formatPrice(total)}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Points Earned Banner -->
            ${pointsEarned && pointsEarned > 0 ? `
            <div style="background: linear-gradient(135deg, rgba(0, 180, 216, 0.12) 0%, rgba(0, 180, 216, 0.06) 100%); border-radius: 12px; padding: 28px; margin: 0 0 28px 0; border: 1px solid rgba(0, 180, 216, 0.2); text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Points Earned on This Order</p>
              <p style="color: #00b4d8; font-size: 52px; margin: 0; font-weight: 800; line-height: 1; letter-spacing: -1px;">+${pointsEarned}</p>
              <p style="color: #64748b; font-size: 13px; margin: 10px 0 0 0;">Waiting in your Vertex Rewards account</p>
            </div>
            ` : ''}

            <!-- Account Activation CTA (new accounts only) -->
            ${isNewAccount && magicLinkUrl ? `
            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%); border-radius: 12px; padding: 28px; margin: 0 0 28px 0; border: 1px solid rgba(16, 185, 129, 0.25); text-align: center;">
              <p style="color: #10b981; font-size: 14px; margin: 0 0 8px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">🔓 Activate Your Account</p>
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                We've created an account for you automatically. Click below to activate it — no password needed. Access your rewards dashboard, track referral earnings, and redeem credits.
              </p>
              <a href="${magicLinkUrl}" style="display: inline-block; background: linear-gradient(135deg, #00b4d8 0%, #0284c7 100%); color: #ffffff; padding: 16px 44px; border-radius: 10px; text-decoration: none; font-size: 16px; font-weight: 700; letter-spacing: 0.3px; box-shadow: 0 4px 20px rgba(0, 180, 216, 0.35);">
                Activate My Account →
              </a>
              <p style="color: #64748b; font-size: 12px; margin: 14px 0 0 0;">One click. No password needed. Takes 10 seconds.</p>
            </div>
            ` : ''}

            <!-- How Vertex Rewards Works -->
            <div style="background: rgba(51, 65, 85, 0.4); border-radius: 12px; padding: 24px; margin: 0 0 24px 0; border: 1px solid rgba(100, 116, 139, 0.3);">
              <h3 style="color: #00b4d8; font-size: 14px; margin: 0 0 16px 0; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">How Vertex Rewards Works</h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 10px 12px; color: #f1f5f9; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">🧬 Earn <strong>3 points per $1</strong> spent (6 pts with Autoship)</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; color: #f1f5f9; border-bottom: 1px solid rgba(100, 116, 139, 0.2);">🎁 Redeem <strong>500 pts for $20</strong> credit toward your next order</td>
                </tr>
                <tr>
                  <td style="padding: 10px 12px; color: #f1f5f9;">🤝 Share your code — friends get <strong>10% off</strong>, you earn <strong>3× points</strong> on their order</td>
                </tr>
              </table>
            </div>

            <!-- Referral Code Section -->
            ${referralCode ? `
            <div style="background: linear-gradient(135deg, rgba(0, 180, 216, 0.08) 0%, rgba(0, 180, 216, 0.04) 100%); border-radius: 12px; padding: 24px; margin: 0 0 24px 0; border: 1px solid rgba(0, 180, 216, 0.2);">
              <h3 style="color: #00b4d8; font-size: 14px; margin: 0 0 12px 0; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">Your Referral Code</h3>
              <div style="text-align: center; margin: 0 0 16px 0;">
                <span style="display: inline-block; background: rgba(0, 180, 216, 0.15); color: #00b4d8; font-size: 28px; font-weight: 800; padding: 12px 32px; border-radius: 10px; border: 1px solid rgba(0, 180, 216, 0.3); letter-spacing: 2px; font-family: monospace;">${referralCode}</span>
              </div>
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0; text-align: center;">
                Share this code with colleagues — they get <span style="color: #f1f5f9; font-weight: 600;">10% off</span> their first order, and you earn <span style="color: #00b4d8; font-weight: 600;">3× points</span> on their purchase.
              </p>
              <div style="background: rgba(15, 23, 42, 0.6); border-radius: 8px; padding: 14px 16px; border: 1px solid rgba(100, 116, 139, 0.3);">
                <p style="color: #94a3b8; font-size: 11px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px;">Shareable Link (auto-applies discount)</p>
                <p style="color: #00b4d8; font-size: 13px; margin: 0; font-family: monospace; word-break: break-all;">
                  ${shareableLink}
                </p>
              </div>
            </div>
            ` : ''}

            <!-- Shipping Address -->
            <div style="background: rgba(51, 65, 85, 0.4); border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid rgba(100, 116, 139, 0.3);">
              <h3 style="color: #00b4d8; font-size: 14px; margin: 0 0 12px 0; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">Shipping Address</h3>
              <p style="color: #f1f5f9; font-size: 14px; margin: 0; white-space: pre-line; line-height: 1.6;">${formatAddress(customer)}</p>
            </div>

            <!-- Research Notice -->
            <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%); border-left: 3px solid #f59e0b; border-radius: 0 12px 12px 0; padding: 16px 20px; margin: 24px 0;">
              <p style="color: #fbbf24; font-size: 14px; margin: 0; font-weight: 600;">🔬 Laboratory Research Use Only</p>
              <p style="color: #d97706; font-size: 13px; margin: 6px 0 0 0; line-height: 1.5;">These products are not intended for human or veterinary use.</p>
            </div>



            <p style="color: #94a3b8; font-size: 14px; margin: 24px 0 0 0; line-height: 1.6;">
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
              This email confirms your order request. It is not a confirmation of shipment.
            </p>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(100, 116, 139, 0.3);">
              <a href="https://vertexresearchlabs.com" style="color: #00b4d8; font-size: 12px; text-decoration: none;">vertexresearchlabs.com</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Dynamic subject line
    // Subject line — professional, no spam triggers
    const subjectLine = orderNumber
      ? `${orderNumber} — Your Order Summary`
      : `Your Vertex Research Labs Order Summary`;

    // Send customer confirmation email
    const customerEmailResponse = await resend.emails.send({
      from: "Vertex Research Labs <info@vertexresearchlabs.com>",
      to: [customer.email],
      subject: subjectLine,
      html: customerEmailHtml,
      headers: {
        "List-Unsubscribe": "<mailto:info@vertexresearchlabs.com?subject=unsubscribe>",
      },
    });

    console.log("Customer email sent:", customerEmailResponse);

    // Build internal notification email
    const productListText = items
      .map(item => `• ${item.productName} (${item.size}) x${item.quantity} - ${formatPrice(item.lineTotal)}`)
      .join("\n");

    const internalEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
        <h1 style="color: #1e293b;">New Order Request${orderNumber ? ` — ${orderNumber}` : ''}</h1>
        
        <h2 style="color: #475569;">Customer Information</h2>
        <ul>
          <li><strong>Name:</strong> ${customer.fullName}</li>
          <li><strong>Email:</strong> ${customer.email}</li>
          <li><strong>Phone:</strong> ${customer.phoneNumber}</li>
          <li><strong>Organization:</strong> ${customer.organization}</li>
          <li><strong>Eligibility:</strong> ${eligibilityLabels[eligibilityType] || eligibilityType}</li>
          <li><strong>New Account:</strong> ${isNewAccount ? 'Yes' : 'No'}</li>
          <li><strong>Payment Method:</strong> ${paymentMethod || 'standard'}</li>
          <li><strong>Referral Code:</strong> ${referralCode || 'N/A'}</li>
        </ul>

        <h2 style="color: #475569;">Shipping Address</h2>
        <pre style="background: #f1f5f9; padding: 16px; border-radius: 8px;">${formatAddress(customer)}</pre>

        <h2 style="color: #475569;">Products</h2>
        <pre style="background: #f1f5f9; padding: 16px; border-radius: 8px;">${productListText}</pre>

        <h2 style="color: #475569;">Order Summary</h2>
        <p><strong>Subtotal:</strong> ${formatPrice(subtotal)}</p>
        ${discountAmount && discountAmount > 0 ? `<p><strong>Discount:</strong> -${formatPrice(discountAmount)}</p>` : ''}
        <p><strong>Shipping (US):</strong> ${shipping === 0 ? 'FREE' : formatPrice(Number(shipping))}</p>
        <p><strong>Total:</strong> ${formatPrice(total)}</p>
        <p><strong>Points Earned:</strong> ${pointsEarned || 0}</p>

        ${customer.notes ? `
          <h2 style="color: #475569;">Additional Notes</h2>
          <pre style="background: #f1f5f9; padding: 16px; border-radius: 8px;">${customer.notes}</pre>
        ` : ''}

        <p style="color: #64748b; font-size: 12px; margin-top: 32px;">
          Submitted: ${new Date().toISOString()}
        </p>
      </body>
      </html>
    `;

    const internalEmailResponse = await resend.emails.send({
      from: "Vertex Research Labs <info@vertexresearchlabs.com>",
      to: ["info@vertexresearchlabs.com"],
      reply_to: customer.email,
      subject: `🔬 ${orderNumber || 'New Order'} - ${customer.fullName} - ${formatPrice(subtotal)}`,
      html: internalEmailHtml,
    });

    console.log("Internal notification sent:", internalEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        customerEmail: customerEmailResponse,
        internalEmail: internalEmailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
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
