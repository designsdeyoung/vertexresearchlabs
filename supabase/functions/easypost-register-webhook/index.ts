import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// One-shot admin helper: registers (idempotently) the tracker webhook with EasyPost.
// Call it once after deploy. Safe to re-run — it won't create duplicates.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EASYPOST_API = "https://api.easypost.com/v2";

async function easypost(path: string, method: string, body?: unknown) {
  const key = Deno.env.get("EASYPOST_API_KEY")!;
  const res = await fetch(`${EASYPOST_API}${path}`, {
    method,
    headers: {
      Authorization: `Basic ${btoa(key + ":")}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || JSON.stringify(json));
  return json;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const secret = Deno.env.get("EASYPOST_WEBHOOK_SECRET")!;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!; // https://<ref>.supabase.co
    const webhookUrl = `${supabaseUrl}/functions/v1/easypost-webhook?secret=${secret}`;

    // List existing webhooks; skip if ours already exists
    const existing = await easypost("/webhooks", "GET");
    const webhooks: any[] = existing?.webhooks || [];
    const already = webhooks.find((w) => (w.url || "").startsWith(`${supabaseUrl}/functions/v1/easypost-webhook`));

    if (already) {
      return new Response(JSON.stringify({
        status: "already_registered",
        webhook_id: already.id,
        url: already.url,
        mode: already.mode,
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const created = await easypost("/webhooks", "POST", { webhook: { url: webhookUrl } });

    return new Response(JSON.stringify({
      status: "registered",
      webhook_id: created.id,
      url: created.url,
      mode: created.mode,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("easypost-register-webhook error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
