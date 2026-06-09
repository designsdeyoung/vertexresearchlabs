import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RestockItem {
  productId: string;
  productName: string;
  size: string;
}

interface RestockRequest {
  email: string;
  fullName?: string;
  items: RestockItem[];
  orderNumber?: string;
  /** ISO 8601. Set to ~14 days out by the caller for a delayed send. */
  scheduledAt?: string;
}

// Plain, personal, text-forward reminder — no banners or promo styling, so it
// reads like a 1:1 note and stays out of the Promotions tab.
const reminderHtml = (firstName: string, items: RestockItem[]) => {
  const top = items[0];
  const reorderUrl = top
    ? `https://vertexresearchlabs.com/product/${top.productId}`
    : "https://vertexresearchlabs.com/#products";
  const list = items
    .map((i) => `<li style="margin: 2px 0;">${i.productName} · ${i.size}</li>`)
    .join("");
  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
  <p style="font-size: 15px; line-height: 1.6;">Hi ${firstName},</p>
  <p style="font-size: 15px; line-height: 1.6;">It's been a couple of weeks since your last order. If your research is ongoing, it may be a good time to restock so you don't run low mid-protocol:</p>
  <ul style="font-size: 15px; line-height: 1.6; color: #333; padding-left: 20px;">${list}</ul>
  <p style="font-size: 15px; line-height: 1.6;">
    <a href="${reorderUrl}" style="color: #0F6E56; font-weight: 600;">Reorder in one click →</a>
  </p>
  <p style="font-size: 14px; color: #666; line-height: 1.6;">All items ship with batch-specific COAs. Reply to this email if you need documentation or have any questions.</p>
  <div style="border-top: 1px solid #e5e5e5; padding-top: 20px; margin-top: 28px; font-size: 12px; color: #999;">
    <p>Vertex Research Labs · For laboratory research use only. Not for human or veterinary use.</p>
    <p><a href="mailto:info@vertexresearchlabs.com?subject=unsubscribe" style="color: #999;">Unsubscribe from reminders</a></p>
  </div>
</div>`;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { email, fullName, items, scheduledAt }: RestockRequest = await req.json();
    if (!email || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Missing email or items" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const firstName = (fullName || "").trim().split(" ")[0] || "there";

    const sendOptions: Record<string, unknown> = {
      from: "Vertex Research Labs <info@vertexresearchlabs.com>",
      to: [email.trim().toLowerCase()],
      subject: "Time to reorder? Your research compounds from Vertex",
      html: reminderHtml(firstName, items),
      headers: {
        "List-Unsubscribe": "<mailto:info@vertexresearchlabs.com?subject=unsubscribe>",
      },
    };
    if (scheduledAt) sendOptions.scheduledAt = scheduledAt;

    const resp = await resend.emails.send(sendOptions as any);
    return new Response(JSON.stringify({ success: true, data: resp }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error("send-restock-reminder error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
