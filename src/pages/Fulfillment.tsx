import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { REWARD_TIERS } from "@/hooks/useRewards";
import {
  Package,
  Printer,
  Truck,
  RefreshCw,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Mail,
} from "lucide-react";

const ADMIN_EMAILS = ["info@vertexdata.ai", "designsdeyoung@gmail.com", "adamdeyoung11@gmail.com", "info@vertexresearchlabs.com"];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

interface Order {
  id: string;
  order_number: string | null;
  items: any[];
  subtotal: number;
  shipping: number;
  total: number;
  points_earned: number;
  status: string;
  created_at: string;
  paid_at: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  label_url: string | null;
  fulfilled_at: string | null;
  carrier: string | null;
  shipping_name: string | null;
  shipping_address1: string | null;
  shipping_address2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_zip: string | null;
  profiles: {
    full_name: string | null;
    email: string;
    phone_number: string | null;
    address_line1: string | null;
    address_line2: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    points_balance: number;
    magic_token: string | null;
    referral_code: string | null;
  } | null;
}

function nextTier(balance: number) {
  return REWARD_TIERS.find((t) => t.points > balance) || null;
}

function printPackingSlip(order: Order) {
  const profile = order.profiles;
  const name = order.shipping_name || profile?.full_name || "Customer";
  const addr1 = order.shipping_address1 || profile?.address_line1 || "";
  const addr2 = order.shipping_address2 || profile?.address_line2 || "";
  const city = order.shipping_city || profile?.city || "";
  const state = order.shipping_state || profile?.state || "";
  const zip = order.shipping_zip || profile?.zip_code || "";
  const balance = profile?.points_balance ?? 0;
  const pointsEarned = order.points_earned ?? 0;
  const next = nextTier(balance);
  const unlocked = [...REWARD_TIERS].reverse().find((t) => balance >= t.points) || null;
  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
  const orderNum = order.order_number || order.id.slice(0, 8);
  const referralCode = profile?.referral_code || null;
  const magicUrl = profile?.magic_token
    ? `https://vertexresearchlabs.com/magic?t=${profile.magic_token}`
    : `https://vertexresearchlabs.com/welcome?email=${encodeURIComponent(profile?.email || "")}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(magicUrl)}&color=000000&bgcolor=ffffff`;

  const items = Array.isArray(order.items) ? order.items : (typeof order.items === "string" ? JSON.parse(order.items) : []);
  const itemRows = items.map((item: any) => {
    const itemName = item.productName || item.name || item.product_name || "Item";
    const size = item.size ? ` · ${item.size}` : "";
    const qty = item.quantity || 1;
    const lineTotal = fmt(Number(item.lineTotal || item.price || 0));
    return `
      <tr>
        <td style="padding:2px 4px;border-bottom:1px solid #eee;font-size:9.5px;">${itemName}${size}</td>
        <td style="padding:2px 4px;border-bottom:1px solid #eee;text-align:center;font-size:9.5px;">${qty}</td>
        <td style="padding:2px 4px;border-bottom:1px solid #eee;text-align:right;font-size:9.5px;">${lineTotal}</td>
      </tr>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Packing Slip ${orderNum}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  html { margin:0; padding:0; width:4in; height:6in; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    background: #fff;
    color: #000;
    width: 4in;
    height: 6in;
    padding: 0.1in 0.18in;
    font-size: 10px;
    overflow: hidden;
  }
  @media print {
    @page { size: 4in 6in; margin: 0; }
    html, body { width:4in; height:6in; margin:0; padding:0; }
    body { padding: 0.1in 0.18in; }
  }
  .logo-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:5px; }
  .logo-text { font-size:13px; font-weight:900; letter-spacing:2px; }
  .logo-sub { font-size:7px; letter-spacing:1.5px; color:#555; }
  .order-meta { text-align:right; }
  .order-meta .label { font-size:7px; letter-spacing:1px; color:#888; text-transform:uppercase; }
  .order-meta .val { font-size:11px; font-weight:700; }
  .order-meta .date { font-size:8px; color:#555; }
  .divider { border:none; border-top:1.5px solid #000; margin:2px 0; }
  .divider-thin { border:none; border-top:1px solid #ddd; margin:2px 0; }
  .section-label { font-size:7px; letter-spacing:1.5px; text-transform:uppercase; color:#888; margin-bottom:2px; }
  .ship-name { font-size:11px; font-weight:700; margin-bottom:1px; }
  .ship-addr { font-size:9px; color:#333; line-height:1.35; }
  table { width:100%; border-collapse:collapse; }
  th { font-size:7px; letter-spacing:1px; text-transform:uppercase; color:#888; padding:3px 4px 2px; border-bottom:1.5px solid #000; text-align:left; }
  th:nth-child(2) { text-align:center; }
  th:last-child { text-align:right; }
  .totals-row td { padding:2px 4px; font-size:9px; }
  .totals-row.grand td { font-size:10px; font-weight:700; border-top:1.5px solid #000; padding-top:2px; }
  .rewards-box { background:#f5f5f5; border:1px solid #ddd; border-radius:4px; padding:5px 8px; margin-top:5px; }
  .rewards-title { font-size:8px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:3px; }
  .rewards-row { display:flex; justify-content:space-between; font-size:9px; margin-bottom:1px; }
  .rewards-row .rlabel { color:#555; }
  .rewards-row .rval { font-weight:700; }
  .next-tier { font-size:8px; color:#555; margin-top:3px; padding-top:3px; border-top:1px solid #ddd; }
  .award-banner { border:2px solid #b8860b; border-radius:6px; margin-top:5px; overflow:hidden; text-align:center; }
  .award-header {
    background: linear-gradient(135deg, #b8860b 0%, #ffd700 50%, #b8860b 100%);
    padding: 3px 8px 2px; font-size:7px; font-weight:900; letter-spacing:2.5px; text-transform:uppercase; color:#3d2800;
  }
  .award-body { background:#fffdf0; padding: 3px 10px 3px; }
  .award-amount { font-size:20px; font-weight:900; color:#8b6400; line-height:1; letter-spacing:-0.5px; }
  .award-amount span { font-size:13px; vertical-align:top; padding-top:4px; display:inline-block; }
  .award-subtitle { font-size:8px; color:#6b4c00; margin-top:2px; font-weight:600; letter-spacing:0.5px; }
  .award-code { display:inline-block; background:#000; color:#ffd700; font-size:8px; font-weight:900; letter-spacing:2px; padding:2px 9px; border-radius:3px; margin-top:4px; }
  .footer-row { display:flex; align-items:flex-end; justify-content:space-between; margin-top:4px; }
  .footer-text { font-size:7px; color:#777; line-height:1.45; }
  .footer-text a { color:#000; text-decoration:none; font-weight:600; }
  .qr-label { font-size:7px; color:#888; text-align:center; margin-top:2px; }
  .how-points { margin-top:4px; padding:4px 9px; background:#fafafa; border:1px solid #eee; border-radius:4px; }
  .how-points .hp-title { font-size:7px; letter-spacing:1.2px; text-transform:uppercase; color:#888; font-weight:700; margin-bottom:2px; }
  .how-points .hp-body { font-size:8px; color:#333; line-height:1.4; }
  .how-points .hp-x { font-weight:800; color:#000; }
  .how-points .hp-fine { font-size:7px; color:#999; margin-top:2px; }
  .referral-box { margin-top:4px; border:1.5px solid #000; border-radius:5px; overflow:hidden; }
  .referral-head { background:#000; color:#fff; font-size:7.5px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700; padding:3px 9px; text-align:center; }
  .referral-body { padding:5px 9px; text-align:center; }
  .referral-code { display:inline-block; border:1.5px dashed #000; border-radius:4px; padding:2px 14px; font-size:14px; font-weight:900; letter-spacing:2px; color:#000; margin-bottom:3px; }
  .referral-body .rf-line { font-size:8px; color:#333; line-height:1.4; }
  .referral-body .rf-bold { font-weight:800; color:#000; }
  .referral-body .rf-fine { font-size:7px; color:#888; margin-top:2px; line-height:1.3; }
</style>
</head>
<body>
  <!-- Header -->
  <div class="logo-row">
    <div>
      <img src="https://vertexresearchlabs.com/logo-black.png" alt="Vertex Research Labs" style="height:36px;width:auto;display:block;" onerror="this.style.display='none';document.getElementById('logo-text').style.display='block'"/>
      <div id="logo-text" style="display:none;">
        <div class="logo-text">VERTEX</div>
        <div class="logo-sub">RESEARCH LABS</div>
      </div>
    </div>
    <div class="order-meta">
      <div class="label">Packing Slip</div>
      <div class="val">${orderNum}</div>
      <div class="date">${orderDate}</div>
    </div>
  </div>
  <hr class="divider"/>

  <!-- Ship To -->
  <div style="margin-bottom:7px;">
    <div class="section-label">Ship To</div>
    <div class="ship-name">${name}</div>
    <div class="ship-addr">
      ${addr1}${addr2 ? "<br/>" + addr2 : ""}<br/>
      ${city}, ${state} ${zip}
    </div>
  </div>
  <hr class="divider-thin"/>

  <!-- Items -->
  <table style="margin-bottom:4px;">
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:center;">Qty</th>
        <th style="text-align:right;">Price</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <!-- Totals -->
  <table>
    <tbody>
      <tr class="totals-row">
        <td colspan="2" style="text-align:right;color:#555;">Subtotal</td>
        <td style="text-align:right;">${fmt(order.subtotal)}</td>
      </tr>
      <tr class="totals-row">
        <td colspan="2" style="text-align:right;color:#555;">Shipping</td>
        <td style="text-align:right;">${fmt(order.shipping)}</td>
      </tr>
      <tr class="totals-row grand">
        <td colspan="2" style="text-align:right;">Total</td>
        <td style="text-align:right;">${fmt(order.total)}</td>
      </tr>
    </tbody>
  </table>

  <!-- Unlocked Award Banner (QR lives here when a reward is unlocked) -->
  ${unlocked ? `
  <div class="award-banner">
    <div class="award-header">🏆 &nbsp; You've Earned a Reward &nbsp; 🏆</div>
    <div class="award-body" style="display:flex;align-items:center;gap:10px;text-align:left;">
      <div style="flex:1;">
        <div class="award-amount"><span>$</span>${unlocked.credit}<span style="font-size:12px;color:#b8860b;"> OFF</span></div>
        <div class="award-subtitle">Ready to use · min. order $${unlocked.minCart}</div>
        <div style="font-size:7px;color:#8b6400;margin-top:3px;line-height:1.3;font-weight:600;">Magic link — scan to sign in instantly, no password. Then redeem in one tap.</div>
      </div>
      <div style="text-align:center;">
        <img src="${qrUrl}" width="50" height="50" style="display:block;margin:0 auto;"/>
        <div style="font-size:6.5px;font-weight:800;letter-spacing:0.5px;color:#6b4c00;margin-top:1px;white-space:nowrap;">SCAN TO REDEEM</div>
      </div>
    </div>
  </div>` : ""}

  <!-- Rewards Summary -->
  <div class="rewards-box" style="margin-top:${unlocked ? "4px" : "6px"};">
    <div class="rewards-row">
      <span class="rlabel" style="font-weight:700;letter-spacing:1px;text-transform:uppercase;font-size:8px;">⭐ Vertex Rewards</span>
      <span class="rval">+${pointsEarned} this order</span>
    </div>
    <div class="rewards-row">
      <span class="rlabel">Total points balance</span>
      <span class="rval">${balance.toLocaleString()} pts</span>
    </div>
    ${next ? `<div class="next-tier">Earn <strong>${(next.points - balance).toLocaleString()} more pts</strong> → unlock <strong>${fmt(next.credit)}</strong> store credit</div>` : `<div class="next-tier" style="font-weight:700;">🏆 Top tier unlocked — you're maxed out!</div>`}
  </div>

  <!-- How points work -->
  <div class="how-points">
    <div class="hp-title">How your points work</div>
    <div class="hp-body">Every <span class="hp-x">$1</span> earns <span class="hp-x">3 points</span> — credited instantly, <span class="hp-x">never expire</span>. Redeem for store credit at checkout.</div>
    <div class="hp-fine">Full terms at vertexresearchlabs.com/rewards</div>
  </div>

  <!-- Referral code -->
  ${referralCode ? `
  <div class="referral-box">
    <div class="referral-head">★ Your Referral Code — Share &amp; Earn ★</div>
    <div class="referral-body">
      <div class="referral-code">${referralCode}</div>
      <div class="rf-line">Friends get <span class="rf-bold">10% off</span> their first order. You earn <span class="rf-bold">3× points</span> on every dollar they spend — as a thank you.</div>
      <div class="rf-fine">Use your code once and you're linked <span style="color:#000;font-weight:700;">for life</span> — keep earning points on all their future orders.</div>
    </div>
  </div>` : ""}

  <!-- Footer (QR shown here only when no reward banner above) -->
  <div class="footer-row">
    <div class="footer-text">
      <a>vertexresearchlabs.com/rewards</a> · <a>info@vertexresearchlabs.com</a> · For laboratory research use only.
    </div>
    ${!unlocked ? `<div style="text-align:center;">
      <img src="${qrUrl}" width="58" height="58" style="display:block;"/>
      <div class="qr-label">One tap sign-in</div>
    </div>` : ""}
  </div>
</body>
</html>`;

  const win = window.open("", "_blank", "width=400,height=620");
  if (!win) { toast({ title: "Pop-up blocked", description: "Allow pop-ups for vertexresearchlabs.com to print.", variant: "destructive" }); return; }
  win.document.write(html);
  win.document.close();
  win.onload = () => { win.focus(); win.print(); };
}

const OrderRow = ({ order, onLabelGenerated }: { order: Order; onLabelGenerated: () => void }) => {
  const [expanded, setExpanded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState<{
    rate: string; service: string; delivery_days: number | null; shipment_id: string; rate_id: string;
    parcel?: string;
    to?: { name: string; street1: string; street2: string; city: string; state: string; zip: string };
    from?: { company: string; name: string; street1: string; city: string; state: string; zip: string };
  } | null>(null);
  const [manualAddr, setManualAddr] = useState({ name: "", street1: "", street2: "", city: "", state: "", zip: "" });
  const [emails, setEmails] = useState<any[] | null>(null);
  const [emailsLoading, setEmailsLoading] = useState(false);

  const loadEmails = async () => {
    setEmailsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-order-emails", {
        body: { orderId: order.id, includeHtml: true },
      });
      if (error) throw error;
      setEmails((data as any)?.emails || []);
    } catch (e: any) {
      toast({ title: "Couldn't load emails", description: e.message, variant: "destructive" });
      setEmails([]);
    } finally {
      setEmailsLoading(false);
    }
  };

  const previewEmail = (html: string, subject: string) => {
    const w = window.open("", "_blank", "width=620,height=800");
    if (w) { w.document.write(`<title>${subject}</title>${html}`); w.document.close(); }
  };

  const profile = order.profiles;
  const name = order.shipping_name || profile?.full_name || "—";
  const addr1 = order.shipping_address1 || profile?.address_line1 || "";
  const city = order.shipping_city || profile?.city || "";
  const state = order.shipping_state || profile?.state || "";
  const zip = order.shipping_zip || profile?.zip_code || "";
  const hasAddress = !!(addr1 && city && state && zip);
  const isShipped = order.status === "shipped" || !!order.tracking_number;

  const handlePreviewLabel = async () => {
    setGenerating(true);
    setPreview(null);
    const override = !hasAddress && manualAddr.street1 ? manualAddr : undefined;
    try {
      const { data, error } = await supabase.functions.invoke("generate-shipping-label", {
        body: { order_id: order.id, preview_only: true, override_address: override },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPreview(data);
    } catch (e: any) {
      toast({ title: "Rate fetch failed", description: e.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const handleBuyLabel = async () => {
    setGenerating(true);
    const override = !hasAddress && manualAddr.street1 ? manualAddr : undefined;
    try {
      const { data, error } = await supabase.functions.invoke("generate-shipping-label", {
        body: { order_id: order.id, override_address: override },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPreview(null);
      // Open label PDF immediately
      if (data.label_url) window.open(data.label_url, "_blank");
      toast({
        title: "Label purchased — opening now",
        description: `Tracking: ${data.tracking_number}`,
        duration: 10000,
      });
      onLabelGenerated();
    } catch (e: any) {
      toast({ title: "Label failed", description: e.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-4">
      <div
        className="flex flex-wrap items-center justify-between gap-3 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isShipped ? "bg-green-500" : "bg-yellow-400"}`} />
          <div>
            <p className="text-sm font-semibold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">
              {order.order_number || order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isShipped ? "default" : "secondary"} className="text-xs">
            {isShipped ? "Shipped" : "Unfulfilled"}
          </Badge>
          <span className="text-sm font-medium text-foreground">{fmt(order.total)}</span>
          {expanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Ship To</p>
              <p className="text-sm text-foreground">{name}</p>
              <p className="text-sm text-muted-foreground">{addr1}</p>
              <p className="text-sm text-muted-foreground">{city}, {state} {zip}</p>
              {profile?.email && <p className="text-xs text-muted-foreground mt-1">{profile.email}</p>}
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Items</p>
              {Array.isArray(order.items) && order.items.map((item: any, i: number) => (
                <p key={i} className="text-sm text-foreground">
                  {item.name || item.product_name || "Item"}
                  {item.weight ? ` · ${item.weight}` : ""}
                  {item.quantity ? ` × ${item.quantity}` : ""}
                </p>
              ))}
              <p className="text-xs text-muted-foreground mt-2">
                +{order.points_earned ?? 0} pts earned · {profile?.points_balance?.toLocaleString() ?? 0} pts balance
              </p>
            </div>
          </div>

          {order.tracking_number && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Tracking</p>
                <p className="text-sm font-mono text-foreground">{order.tracking_number}</p>
              </div>
              <div className="flex gap-2">
                {order.label_url && (
                  <Button size="sm" variant="outline" onClick={() => window.open(order.label_url!, "_blank")}>
                    <Printer size={14} className="mr-1" /> Print Label
                  </Button>
                )}
                {order.tracking_url && (
                  <Button size="sm" variant="outline" onClick={() => window.open(order.tracking_url!, "_blank")}>
                    <ExternalLink size={14} className="mr-1" /> Track
                  </Button>
                )}
              </div>
            </div>
          )}

          {!isShipped && !hasAddress && (
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 space-y-2">
              <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider">No address on file — enter shipping address</p>
              <div className="grid grid-cols-2 gap-2">
                <input className="col-span-2 bg-background border border-border rounded px-2 py-1.5 text-sm text-foreground" placeholder="Full name" value={manualAddr.name} onChange={e => setManualAddr(a => ({ ...a, name: e.target.value }))} />
                <input className="col-span-2 bg-background border border-border rounded px-2 py-1.5 text-sm text-foreground" placeholder="Street address" value={manualAddr.street1} onChange={e => setManualAddr(a => ({ ...a, street1: e.target.value }))} />
                <input className="bg-background border border-border rounded px-2 py-1.5 text-sm text-foreground" placeholder="City" value={manualAddr.city} onChange={e => setManualAddr(a => ({ ...a, city: e.target.value }))} />
                <div className="flex gap-2">
                  <input className="w-16 bg-background border border-border rounded px-2 py-1.5 text-sm text-foreground" placeholder="ST" maxLength={2} value={manualAddr.state} onChange={e => setManualAddr(a => ({ ...a, state: e.target.value.toUpperCase() }))} />
                  <input className="flex-1 bg-background border border-border rounded px-2 py-1.5 text-sm text-foreground" placeholder="ZIP" value={manualAddr.zip} onChange={e => setManualAddr(a => ({ ...a, zip: e.target.value }))} />
                </div>
              </div>
            </div>
          )}

          {preview && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">Preview Label — Verify Before Buying</p>
                <span className="text-xs text-muted-foreground">
                  <span className="font-bold text-primary">${parseFloat(preview.rate).toFixed(2)}</span>
                  {preview.delivery_days ? ` · ${preview.delivery_days}d` : ""}
                </span>
              </div>

              {/* Visual 4x6 label mockup — what will print */}
              <div className="bg-white text-black rounded-md p-3 font-sans mx-auto" style={{ maxWidth: 300 }}>
                <div className="flex items-center justify-between border-b-2 border-black pb-1.5 mb-2">
                  <span className="text-[10px] font-black tracking-widest">USPS PRIORITY MAIL</span>
                  <span className="text-[8px] text-gray-500">{preview.parcel?.includes("Flat Rate") ? "FLAT RATE" : ""}</span>
                </div>
                {/* FROM */}
                <div className="mb-2">
                  <p className="text-[7px] uppercase tracking-wider text-gray-400 mb-0.5">From</p>
                  <p className="text-[9px] leading-tight">
                    {preview.from?.company}<br />
                    {preview.from?.name}<br />
                    {preview.from?.street1}<br />
                    {preview.from?.city}, {preview.from?.state} {preview.from?.zip}
                  </p>
                </div>
                {/* TO — prominent */}
                <div className="border-t border-gray-300 pt-2">
                  <p className="text-[7px] uppercase tracking-wider text-gray-400 mb-0.5">Ship To</p>
                  <p className="text-[13px] font-bold leading-tight">{preview.to?.name}</p>
                  <p className="text-[12px] leading-snug">
                    {preview.to?.street1}{preview.to?.street2 ? <>, {preview.to.street2}</> : null}<br />
                    {preview.to?.city}, {preview.to?.state} {preview.to?.zip}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-center text-muted-foreground">
                ☝︎ This is the destination on your label. Confirm it's correct before paying.
              </p>

              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="hero" onClick={handleBuyLabel} disabled={generating}>
                  <Truck size={14} className="mr-1" />
                  {generating ? "Buying..." : `Looks right — Buy $${parseFloat(preview.rate).toFixed(2)}`}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setPreview(null)} disabled={generating}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Email activity */}
          <div className="rounded-lg border border-border/50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={13} /> Emails Sent
              </p>
              {emails === null && (
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={loadEmails} disabled={emailsLoading}>
                  {emailsLoading ? "Loading…" : "Show"}
                </Button>
              )}
              {emails !== null && (
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={loadEmails} disabled={emailsLoading}>
                  {emailsLoading ? "…" : "Refresh"}
                </Button>
              )}
            </div>
            {emails !== null && emails.length === 0 && (
              <p className="text-xs text-muted-foreground mt-2">No emails logged for this order yet.</p>
            )}
            {emails !== null && emails.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {emails.map((em) => {
                  const st = em.status as string;
                  const cls =
                    em.opened ? "bg-green-500/15 text-green-400 border-green-500/30" :
                    st === "delivered" ? "bg-blue-500/15 text-blue-400 border-blue-500/30" :
                    st === "bounced" || st === "complained" ? "bg-red-500/15 text-red-400 border-red-500/30" :
                    "bg-muted/30 text-muted-foreground border-border";
                  return (
                    <div key={em.id} className="flex items-center justify-between gap-2 text-xs py-1.5 border-b border-border/30 last:border-0">
                      <div className="min-w-0">
                        <p className="text-foreground font-medium truncate">{em.label}</p>
                        <p className="text-muted-foreground/60 truncate">{em.recipient} · {new Date(em.sent_at).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold capitalize ${cls}`}>
                          {em.opened ? "Opened ✓" : st}
                        </span>
                        {em.html && (
                          <button onClick={() => previewEmail(em.html, em.subject)} className="text-primary hover:underline text-[11px] font-semibold">
                            Preview
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => printPackingSlip(order)}>
              <Printer size={14} className="mr-1" /> Print Packing Slip
            </Button>
            {!isShipped && !preview && (
              <Button size="sm" variant="hero" onClick={handlePreviewLabel} disabled={generating}>
                <Truck size={14} className="mr-1" />
                {generating ? "Loading preview..." : "Preview USPS Label"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Fulfillment = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"unfulfilled" | "all">("unfulfilled");

  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email || "");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("get-fulfillment-orders", {
      body: { filter },
    });
    if (!error && data?.orders) setOrders(data.orders as Order[]);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    if (!isAdmin) navigate("/");
  }, [authLoading, user, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) fetchOrders();
  }, [isAdmin, fetchOrders]);

  if (authLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <RefreshCw size={24} className="animate-spin text-muted-foreground" />
    </div>
  );
  if (!isAdmin) return null;

  const unfulfilled = orders.filter((o) => o.status !== "shipped" && !o.tracking_number);
  const shipped = orders.filter((o) => o.status === "shipped" || !!o.tracking_number);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package size={20} className="text-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Fulfillment</span>
              </div>
              <h1 className="text-3xl font-semibold text-foreground">Ship Orders</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {unfulfilled.length} unfulfilled · {shipped.length} shipped
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loading}>
              <RefreshCw size={14} className={`mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter("unfulfilled")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "unfulfilled" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              <Clock size={14} className="inline mr-1" />
              Unfulfilled ({unfulfilled.length})
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              <CheckCircle2 size={14} className="inline mr-1" />
              All Orders
            </button>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground py-16">
              <RefreshCw size={24} className="mx-auto mb-3 animate-spin opacity-40" />
              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center text-muted-foreground glass-card rounded-xl p-12">
              <CheckCircle2 size={32} className="mx-auto mb-3 opacity-40" />
              <p>{filter === "unfulfilled" ? "No unfulfilled orders — you're all caught up!" : "No orders found."}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} onLabelGenerated={fetchOrders} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Fulfillment;
