import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    organization: string;
    address: string;
    notes: string;
  };
  eligibilityType: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number | string;
}

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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: OrderRequest = await req.json();
    console.log("Received order request:", JSON.stringify(orderData, null, 2));

    const { customer, eligibilityType, items, subtotal, shipping } = orderData;

    // Build product list HTML
    const productListHtml = items
      .map(item => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.productName}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.size}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPrice(item.lineTotal)}</td>
        </tr>
      `)
      .join("");

    // Customer confirmation email
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; margin: 0; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Vertex Research Labs</h1>
            <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 14px;">Order Request Confirmation</p>
          </div>

          <!-- Content -->
          <div style="padding: 32px;">
            <p style="color: #374151; font-size: 16px; margin: 0 0 24px 0;">
              Dear ${customer.fullName},
            </p>
            <p style="color: #374151; font-size: 16px; margin: 0 0 24px 0;">
              Thank you for your order request. We have received your inquiry and our team will review it shortly. You will receive a follow-up email with payment instructions and shipping details.
            </p>

            <!-- Order Details -->
            <div style="background: #f8fafc; border-radius: 8px; padding: 24px; margin: 24px 0;">
              <h2 style="color: #1e293b; font-size: 18px; margin: 0 0 16px 0;">Order Details</h2>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                  <tr style="background: #e2e8f0;">
                    <th style="padding: 12px; text-align: left; color: #475569;">Product</th>
                    <th style="padding: 12px; text-align: left; color: #475569;">Size</th>
                    <th style="padding: 12px; text-align: center; color: #475569;">Qty</th>
                    <th style="padding: 12px; text-align: right; color: #475569;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${productListHtml}
                </tbody>
              </table>

              <div style="margin-top: 16px; padding-top: 16px; border-top: 2px solid #e2e8f0;">
                <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
                  <span style="color: #64748b;">Subtotal:</span>
                  <span style="color: #1e293b; font-weight: 500;">${formatPrice(subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 14px;">
                  <span style="color: #64748b;">Shipping:</span>
                  <span style="color: ${shipping === 0 ? '#10b981' : '#1e293b'}; font-weight: 500;">
                    ${shipping === 0 ? 'FREE (US)' : 'To be calculated'}
                  </span>
                </div>
              </div>
            </div>

            <!-- Shipping Address -->
            <div style="background: #f8fafc; border-radius: 8px; padding: 24px; margin: 24px 0;">
              <h3 style="color: #1e293b; font-size: 16px; margin: 0 0 12px 0;">Shipping Address</h3>
              <p style="color: #475569; font-size: 14px; margin: 0; white-space: pre-line;">${customer.address}</p>
            </div>

            <!-- Research Notice -->
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0;">
              <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">
                ⚠️ For Laboratory Research Use Only
              </p>
              <p style="color: #92400e; font-size: 13px; margin: 8px 0 0 0;">
                These products are not intended for human or veterinary use.
              </p>
            </div>

            <p style="color: #64748b; font-size: 14px; margin: 24px 0 0 0;">
              If you have any questions, please reply to this email or contact us at orders@vertexresearchlabs.com
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f1f5f9; padding: 24px; text-align: center;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Vertex Research Labs. All rights reserved.
            </p>
            <p style="color: #94a3b8; font-size: 11px; margin: 8px 0 0 0;">
              This email confirms your order request. It is not a confirmation of shipment.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send customer confirmation email
    const customerEmailResponse = await resend.emails.send({
      from: "Vertex Research Labs <onboarding@resend.dev>",
      to: [customer.email],
      subject: `Order Request Received - ${formatPrice(subtotal)}`,
      html: customerEmailHtml,
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
        <h1 style="color: #1e293b;">New Order Request</h1>
        
        <h2 style="color: #475569;">Customer Information</h2>
        <ul>
          <li><strong>Name:</strong> ${customer.fullName}</li>
          <li><strong>Email:</strong> ${customer.email}</li>
          <li><strong>Organization:</strong> ${customer.organization}</li>
          <li><strong>Eligibility:</strong> ${eligibilityLabels[eligibilityType] || eligibilityType}</li>
        </ul>

        <h2 style="color: #475569;">Shipping Address</h2>
        <pre style="background: #f1f5f9; padding: 16px; border-radius: 8px;">${customer.address}</pre>

        <h2 style="color: #475569;">Products</h2>
        <pre style="background: #f1f5f9; padding: 16px; border-radius: 8px;">${productListText}</pre>

        <h2 style="color: #475569;">Order Summary</h2>
        <p><strong>Subtotal:</strong> ${formatPrice(subtotal)}</p>
        <p><strong>Shipping:</strong> ${shipping === 0 ? 'FREE (US)' : 'To be calculated'}</p>

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

    // Send internal notification (to your business email)
    // Note: Using onboarding@resend.dev as sender for now
    // You can update this to your verified domain later
    const internalEmailResponse = await resend.emails.send({
      from: "Vertex Research Labs <onboarding@resend.dev>",
      to: ["orders@vertexresearchlabs.com"],
      reply_to: customer.email,
      subject: `🔬 New Order Request - ${customer.fullName} - ${formatPrice(subtotal)}`,
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
