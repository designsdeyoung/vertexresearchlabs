import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Admin-only: list the emails sent for an order, with live Resend status
// (sent / delivered / opened / clicked / bounced) and an HTML preview.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAILS = ["info@vertexdata.ai", "designsdeyoung@gmail.com", "adamdeyoung11@gmail.com", "info@vertexresearchlabs.com"];

const TYPE_LABEL: Record<string, string> = {
  invoice: "Invoice / payment",
  order_confirmation: "Order confirmation",
  shipped: "Shipped",
  in_transit: "In transit",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify admin
    const token = (req.headers.get("authorization") || "").replace("Bearer ", "").trim();
    const { data: { user } } = await admin.auth.getUser(token);
    if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { orderId, includeHtml } = await req.json();
    if (!orderId) throw new Error("orderId required");

    const { data: logs } = await admin
      .from("email_log")
      .select("id, email_type, recipient, resend_id, subject, sent_at")
      .eq("order_id", orderId)
      .order("sent_at", { ascending: true });

    const resendKey = Deno.env.get("RESEND_API_KEY")!;

    const emails = await Promise.all((logs || []).map(async (l) => {
      let status = "sent";
      let html: string | null = null;
      if (l.resend_id) {
        try {
          const r = await fetch(`https://api.resend.com/emails/${l.resend_id}`, {
            headers: { Authorization: `Bearer ${resendKey}` },
          });
          if (r.ok) {
            const e = await r.json();
            status = e.last_event || "sent";
            if (includeHtml) html = e.html || null;
          }
        } catch (_) { /* keep default */ }
      }
      return {
        id: l.id,
        type: l.email_type,
        label: TYPE_LABEL[l.email_type] || l.email_type,
        recipient: l.recipient,
        subject: l.subject,
        sent_at: l.sent_at,
        resend_id: l.resend_id,
        status,                       // sent | delivered | opened | clicked | bounced | complained
        opened: status === "opened" || status === "clicked",
        html,
      };
    }));

    return new Response(JSON.stringify({ emails }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("get-order-emails error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
