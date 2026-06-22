import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// 21-day post-order reorder nurture. Two modes:
//   { cron: true }        → daily batch: scan eligible orders, send + mark each
//   { orderId, test }     → send one (for previews; `test` skips the sent-mark)
// Compliant: research-use framing only, zero medical/health claims.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE = "https://vertexresearchlabs.com";
const LOGO_URL = "https://qgritvsluilqptgtvayv.supabase.co/storage/v1/object/public/email-assets/logo-avatar.png";
const FREE_SHIP_THRESHOLD = 99;
const POINTS_PER_DOLLAR = 3;

const REWARD_TIERS = [
  { points: 250, credit: 10, minCart: 75 },
  { points: 500, credit: 20, minCart: 100 },
  { points: 750, credit: 30, minCart: 120 },
  { points: 1000, credit: 40, minCart: 150 },
  { points: 1500, credit: 65, minCart: 200 },
  { points: 2000, credit: 90, minCart: 250 },
  { points: 3000, credit: 140, minCart: 350 },
  { points: 5000, credit: 250, minCart: 500 },
];

// Compact product catalog (kept in sync with src/data/products.ts)
const CATALOG: { id: string; name: string; size: string; price: number; category: string }[] = [
  { id: "ghk-cu", name: "GHK-Cu", size: "50mg", price: 44, category: "Copper Peptide" },
  { id: "ghk-cu-100", name: "GHK-Cu", size: "100mg", price: 88, category: "Copper Peptide" },
  { id: "klow", name: "KLOW", size: "80mg", price: 129, category: "Peptide Blend" },
  { id: "retatrutide", name: "Retatrutide", size: "10mg", price: 98, category: "Peptide" },
  { id: "bpc-157", name: "BPC-157", size: "5mg", price: 38, category: "Peptide" },
  { id: "tb-500", name: "TB-500", size: "5mg", price: 38, category: "Peptide" },
  { id: "semax", name: "Semax", size: "5mg", price: 33, category: "Peptide" },
  { id: "selank", name: "Selank", size: "5mg", price: 33, category: "Heptapeptide" },
  { id: "nad-plus", name: "NAD+", size: "500mg", price: 80, category: "Coenzyme" },
  { id: "nad-plus-1000", name: "NAD+", size: "1000mg", price: 150, category: "Coenzyme" },
  { id: "glutathione", name: "Glutathione", size: "1500mg", price: 75, category: "Antioxidant" },
  { id: "mots-c", name: "MOTS-C", size: "10mg", price: 48, category: "Peptide" },
  { id: "mots-c-40", name: "MOTS-C", size: "40mg", price: 140, category: "Peptide" },
  { id: "kisspeptin", name: "Kisspeptin", size: "5mg", price: 38, category: "Peptide" },
  { id: "tesamorelin", name: "Tesamorelin", size: "10mg", price: 85, category: "Peptide" },
  { id: "pt-141", name: "PT-141", size: "10mg", price: 55, category: "Peptide" },
  { id: "mt2", name: "MT2 (Melanotan II)", size: "10mg", price: 45, category: "Peptide" },
  { id: "dsip", name: "DSIP", size: "5mg", price: 42, category: "Peptide" },
  { id: "epithalon", name: "Epithalon", size: "10mg", price: 65, category: "Peptide" },
  { id: "wolverine-blend", name: "Wolverine Blend", size: "10mg", price: 55, category: "Peptide Blend" },
  { id: "cjc-ipa-blend", name: "CJC/IPA Blend", size: "10mg", price: 85, category: "Peptide Blend" },
  { id: "bac-water-3ml", name: "BAC Water", size: "3mL", price: 8, category: "Diluent" },
  { id: "bac-water-10ml", name: "BAC Water", size: "10mL", price: 15, category: "Diluent" },
];

const byId = (id: string) => CATALOG.find((p) => p.id === id);
const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
// Best-effort: match an ordered item back to a catalog product id
function matchCatalog(item: any): { id: string; name: string; size: string; price: number; category: string } | null {
  if (item?.productId && byId(item.productId)) return byId(item.productId)!;
  const target = norm(item?.productName || item?.name || "");
  const size = norm(item?.size || "");
  if (!target) return null;
  // exact name + size, then name-only
  let hit = CATALOG.find((p) => norm(p.name) === target && norm(p.size) === size);
  if (!hit) hit = CATALOG.find((p) => norm(p.name) === target);
  if (!hit) hit = CATALOG.find((p) => target.includes(norm(p.name)) || norm(p.name).includes(target));
  return hit || null;
}

const fmt = (n: number) => `$${Number(n).toFixed(2).replace(/\.00$/, "")}`;

// Pick up to N recommendations that the customer did NOT just buy
function recommend(orderedIds: Set<string>, orderedCats: Set<string>, n: number) {
  const popular = ["bpc-157", "tb-500", "ghk-cu", "nad-plus", "glutathione", "klow", "wolverine-blend", "retatrutide", "mots-c", "semax"];
  const recs: typeof CATALOG = [];
  for (const id of popular) {
    if (recs.length >= n) break;
    const p = byId(id);
    if (p && !orderedIds.has(p.id)) recs.push(p);
  }
  // Always make sure BAC water is suggested if they didn't buy it (everyone needs it)
  if (!orderedIds.has("bac-water-10ml") && !orderedIds.has("bac-water-3ml") && recs.length < n + 1) {
    recs.push(byId("bac-water-10ml")!);
  }
  return recs.slice(0, n);
}

function buildHtml(opts: {
  firstName: string; orderedProducts: any[]; balance: number; magicLink: string;
}) {
  const { firstName, orderedProducts, balance, magicLink } = opts;
  const unlocked = [...REWARD_TIERS].reverse().find((t) => balance >= t.points) || null;
  const next = REWARD_TIERS.find((t) => balance < t.points) || null;
  const ptsToNext = next ? next.points - balance : 0;

  const orderedIds = new Set(orderedProducts.map((p) => p.id));
  const orderedCats = new Set(orderedProducts.map((p) => p.category));
  const recs = recommend(orderedIds, orderedCats, 3);

  // Points header bar
  const rewardLine = unlocked
    ? `<span style="color:#ffd700;font-weight:700">🏆 $${unlocked.credit} OFF unlocked</span> &nbsp;·&nbsp; min. order $${unlocked.minCart}`
    : next ? `<span style="color:#2DD4BF">${ptsToNext} pts</span> from your first $${next.credit} reward`
    : `Top tier unlocked!`;

  const reorderCards = orderedProducts.map((p) => `
    <a href="${SITE}/product/${p.id}" style="display:block;text-decoration:none;background:#111;border:1px solid #1f1f1f;border-radius:10px;padding:14px 16px;margin-bottom:8px">
      <table width="100%" style="border-collapse:collapse"><tr>
        <td style="color:#fff;font-size:15px;font-weight:700">${p.name} <span style="color:#6b7280;font-weight:400">· ${p.size}</span></td>
        <td style="text-align:right;color:#2DD4BF;font-size:14px;font-weight:700;white-space:nowrap">${fmt(p.price)} &nbsp;Reorder →</td>
      </tr></table>
    </a>`).join("");

  const recCards = recs.map((p) => `
    <a href="${SITE}/product/${p.id}" style="display:block;text-decoration:none;background:#0d0d0d;border:1px solid #1a1a1a;border-radius:10px;padding:13px 16px;margin-bottom:8px">
      <table width="100%" style="border-collapse:collapse"><tr>
        <td style="color:#e5e7eb;font-size:14px;font-weight:600">${p.name} <span style="color:#6b7280;font-weight:400">· ${p.size}</span></td>
        <td style="text-align:right;color:#9ca3af;font-size:13px;white-space:nowrap">${fmt(p.price)} &nbsp;<span style="color:#2DD4BF">View →</span></td>
      </tr></table>
    </a>`).join("");

  const creditHeadline = unlocked
    ? `You've got <span style="color:#ffd700;font-weight:800">$${unlocked.credit} in rewards</span> ready to use`
    : `You're <span style="color:#2DD4BF;font-weight:800">${ptsToNext} points</span> from your first reward`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;background:#0d0d0d;border:1px solid #1f1f1f;border-radius:8px;overflow:hidden">

  <!-- Points header -->
  <div style="background:linear-gradient(135deg,#0d1f1c 0%,#0a1a17 100%);border-bottom:1px solid #1a3a34;padding:12px 24px;text-align:center">
    <span style="color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:600">${firstName}'s Vertex Rewards</span>
    <div style="margin-top:4px">
      <span style="color:#2DD4BF;font-size:22px;font-weight:800">${balance.toLocaleString()}</span>
      <span style="color:#6b7280;font-size:13px"> pts</span>
      <span style="color:#374151;font-size:13px"> &nbsp;·&nbsp; </span>
      <span style="font-size:12px;color:#9ca3af">${rewardLine}</span>
    </div>
  </div>

  <!-- Logo -->
  <div style="text-align:center;padding:22px 0 6px">
    <img src="${LOGO_URL}" alt="Vertex Research Labs" width="52" height="52" style="display:inline-block;border-radius:12px"/>
    <div style="color:#2DD4BF;font-size:10px;letter-spacing:3px;font-weight:700;text-transform:uppercase;margin-top:8px">Vertex Research Labs</div>
  </div>

  <!-- Hero -->
  <div style="padding:8px 28px 20px;border-bottom:1px solid #1a1a1a">
    <div style="font-size:25px;font-weight:800;color:#fff;line-height:1.25">Running low, ${firstName}? 🔬</div>
    <div style="color:#9ca3af;font-size:14px;margin-top:8px;line-height:1.6">
      It's been about three weeks since your last order. ${creditHeadline} on your next one — here's the easy button.
    </div>
  </div>

  <!-- Reorder what they bought -->
  ${reorderCards ? `<div style="padding:22px 28px 8px;border-bottom:1px solid #1a1a1a">
    <div style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px">Reorder your last batch</div>
    ${reorderCards}
  </div>` : ""}

  <!-- Recommendations -->
  ${recCards ? `<div style="padding:22px 28px 8px;border-bottom:1px solid #1a1a1a">
    <div style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px">Researchers also stock up on</div>
    ${recCards}
  </div>` : ""}

  <!-- Savings + free shipping -->
  <div style="padding:22px 28px;border-bottom:1px solid #1a1a1a">
    <div style="background:linear-gradient(135deg,#0d2620 0%,#0a1a17 100%);border:1px solid #1f4d42;border-radius:10px;padding:20px;text-align:center">
      ${unlocked
        ? `<div style="color:#ffd700;font-size:30px;font-weight:900;line-height:1">$${unlocked.credit} OFF</div>
           <div style="color:#9ca3af;font-size:13px;margin-top:6px">applied at checkout on orders $${unlocked.minCart}+</div>`
        : `<div style="color:#fff;font-size:20px;font-weight:800">${balance.toLocaleString()} points banked</div>
           <div style="color:#9ca3af;font-size:13px;margin-top:6px">just ${ptsToNext} more to unlock $${next?.credit} off</div>`}
      <div style="color:#2DD4BF;font-size:13px;margin-top:12px;font-weight:700">✦ FREE US shipping on orders ${fmt(FREE_SHIP_THRESHOLD)}+</div>
      <a href="${magicLink}" style="display:inline-block;margin-top:16px;background:#2DD4BF;color:#000;font-weight:800;font-size:15px;padding:14px 38px;border-radius:8px;text-decoration:none">Log in &amp; shop with my points →</a>
      <div style="color:#4b5563;font-size:11px;margin-top:10px">One tap — no password needed. Every $1 earns ${POINTS_PER_DOLLAR} more points.</div>
    </div>
  </div>

  <!-- Footer -->
  <div style="padding:20px 28px;text-align:center">
    <div style="color:#374151;font-size:11px;line-height:1.8">
      Every order ships with batch-specific COAs.<br/>
      Questions? <a href="mailto:info@vertexresearchlabs.com" style="color:#2DD4BF;text-decoration:none">info@vertexresearchlabs.com</a><br/>
      All products are for laboratory research use only. Not for human or veterinary use.<br/>
      <a href="mailto:info@vertexresearchlabs.com?subject=unsubscribe" style="color:#4b5563;text-decoration:none">Unsubscribe from reminders</a>
    </div>
  </div>

</div>
</body></html>`;
}

async function sendOne(admin: any, order: any): Promise<{ ok: boolean; email?: string; error?: string }> {
  const profile = order.profiles;
  const email = profile?.email;
  if (!email) return { ok: false, error: "no email" };

  const name = profile?.full_name || order.shipping_name || "Researcher";
  const firstName = name.split(" ")[0];
  const balance = profile?.points_balance ?? 0;
  const magicLink = profile?.magic_token ? `${SITE}/magic?t=${profile.magic_token}` : `${SITE}/auth`;

  const rawItems = (() => {
    try { return Array.isArray(order.items) ? order.items : JSON.parse(order.items || "[]"); }
    catch { return []; }
  })();
  const orderedProducts = rawItems.map(matchCatalog).filter(Boolean);

  const html = buildHtml({ firstName, orderedProducts, balance, magicLink });

  const resendKey = Deno.env.get("RESEND_API_KEY")!;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Vertex Research Labs <info@vertexresearchlabs.com>",
      reply_to: "info@vertexresearchlabs.com",
      to: [email],
      subject: `${firstName}, ready to restock? Your rewards are waiting`,
      html,
      headers: { "List-Unsubscribe": "<mailto:info@vertexresearchlabs.com?subject=unsubscribe>" },
    }),
  });
  const result = await res.json();
  if (!res.ok) return { ok: false, email, error: JSON.stringify(result) };
  return { ok: true, email };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // ── CRON BATCH MODE ──
    if (body.cron === true) {
      const cronSecret = Deno.env.get("CRON_SECRET");
      if (cronSecret && body.secret !== cronSecret) {
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Eligible: 21–35 days old, not yet nurtured, has a profile.
      const { data: candidates } = await admin
        .from("orders")
        .select("id, profile_id, created_at, items, shipping_name, profiles!orders_profile_id_fkey(id, full_name, email, points_balance, magic_token)")
        .lte("created_at", new Date(Date.now() - 21 * 86400000).toISOString())
        .gte("created_at", new Date(Date.now() - 35 * 86400000).toISOString())
        .is("reorder_nurture_sent_at", null)
        .not("profile_id", "is", null)
        .limit(200);

      const results: any[] = [];
      for (const order of candidates || []) {
        // Skip if the customer already placed a newer order (they reordered)
        const { count: newer } = await admin
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("profile_id", order.profile_id)
          .gt("created_at", order.created_at);

        if ((newer || 0) > 0) {
          await admin.from("orders").update({ reorder_nurture_sent_at: new Date().toISOString() }).eq("id", order.id);
          results.push({ id: order.id, skipped: "already reordered" });
          continue;
        }

        const r = await sendOne(admin, order);
        // Mark as sent regardless, so a transient failure doesn't loop forever
        await admin.from("orders").update({ reorder_nurture_sent_at: new Date().toISOString() }).eq("id", order.id);
        results.push({ id: order.id, ...r });
      }

      return new Response(JSON.stringify({ ok: true, processed: results.length, results }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── SINGLE / TEST MODE ──
    if (!body.orderId) throw new Error("orderId required (or pass cron:true)");
    const { data: order } = await admin
      .from("orders")
      .select("id, profile_id, created_at, items, shipping_name, profiles!orders_profile_id_fkey(id, full_name, email, points_balance, magic_token)")
      .eq("id", body.orderId)
      .single();
    if (!order) throw new Error("order not found");

    const r = await sendOne(admin, order);
    if (!body.test) {
      await admin.from("orders").update({ reorder_nurture_sent_at: new Date().toISOString() }).eq("id", order.id);
    }
    return new Response(JSON.stringify(r), {
      status: r.ok ? 200 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("send-reorder-nurture error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
