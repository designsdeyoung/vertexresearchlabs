import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
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
  } | null;
}

// Rewards redemption tiers
const TIERS = [
  { points: 250, credit: 10 },
  { points: 500, credit: 20 },
  { points: 750, credit: 30 },
  { points: 1000, credit: 40 },
  { points: 1500, credit: 65 },
  { points: 2000, credit: 90 },
  { points: 3000, credit: 140 },
  { points: 5000, credit: 250 },
];

function nextTier(balance: number) {
  return TIERS.find((t) => t.points > balance) || null;
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
  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
  const orderNum = order.order_number || order.id.slice(0, 8);
  const welcomeUrl = `https://vertexresearchlabs.com/welcome?email=${encodeURIComponent(profile?.email || "")}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(welcomeUrl)}&color=000000&bgcolor=ffffff`;

  const items = Array.isArray(order.items) ? order.items : [];
  const itemRows = items.map((item: any) => {
    const itemName = item.name || item.product_name || "Item";
    const weight = item.weight ? ` · ${item.weight}` : "";
    const qty = item.quantity || 1;
    const lineTotal = fmt(Number(item.price || 0) * qty);
    return `
      <tr>
        <td style="padding:5px 4px;border-bottom:1px solid #eee;font-size:10px;">${itemName}${weight}</td>
        <td style="padding:5px 4px;border-bottom:1px solid #eee;text-align:center;font-size:10px;">${qty}</td>
        <td style="padding:5px 4px;border-bottom:1px solid #eee;text-align:right;font-size:10px;">${lineTotal}</td>
      </tr>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Packing Slip ${orderNum}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    background: #fff;
    color: #000;
    width: 4in;
    min-height: 6in;
    padding: 0.18in 0.2in;
    font-size: 10px;
  }
  @media print {
    @page { size: 4in 6in; margin: 0; }
    body { padding: 0.18in 0.2in; }
  }
  .logo-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
  .logo-text { font-size:13px; font-weight:900; letter-spacing:2px; }
  .logo-sub { font-size:7px; letter-spacing:1.5px; color:#555; }
  .order-meta { text-align:right; }
  .order-meta .label { font-size:7px; letter-spacing:1px; color:#888; text-transform:uppercase; }
  .order-meta .val { font-size:11px; font-weight:700; }
  .order-meta .date { font-size:8px; color:#555; }
  .divider { border:none; border-top:1.5px solid #000; margin:6px 0; }
  .divider-thin { border:none; border-top:1px solid #ddd; margin:5px 0; }
  .section-label { font-size:7px; letter-spacing:1.5px; text-transform:uppercase; color:#888; margin-bottom:3px; }
  .ship-name { font-size:12px; font-weight:700; margin-bottom:1px; }
  .ship-addr { font-size:9px; color:#333; line-height:1.4; }
  table { width:100%; border-collapse:collapse; }
  th { font-size:7px; letter-spacing:1px; text-transform:uppercase; color:#888; padding:4px 4px 3px; border-bottom:1.5px solid #000; text-align:left; }
  th:nth-child(2) { text-align:center; }
  th:last-child { text-align:right; }
  .totals-row td { padding:3px 4px; font-size:9px; }
  .totals-row.grand td { font-size:11px; font-weight:700; border-top:1.5px solid #000; padding-top:5px; }
  .rewards-box { background:#f5f5f5; border:1px solid #ddd; border-radius:4px; padding:7px 8px; margin-top:8px; }
  .rewards-title { font-size:8px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:4px; }
  .rewards-row { display:flex; justify-content:space-between; font-size:9px; margin-bottom:2px; }
  .rewards-row .rlabel { color:#555; }
  .rewards-row .rval { font-weight:700; }
  .next-tier { font-size:8px; color:#555; margin-top:4px; padding-top:4px; border-top:1px solid #ddd; }
  .footer-row { display:flex; align-items:flex-end; justify-content:space-between; margin-top:10px; }
  .footer-text { font-size:7px; color:#777; line-height:1.5; }
  .footer-text a { color:#000; text-decoration:none; font-weight:600; }
  .qr-label { font-size:7px; color:#888; text-align:center; margin-top:2px; }
  .points-badge { display:inline-block; background:#000; color:#fff; font-size:8px; font-weight:700; padding:2px 6px; border-radius:10px; letter-spacing:0.5px; }
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

  <!-- Rewards -->
  <div class="rewards-box">
    <div class="rewards-title">⭐ Vertex Rewards</div>
    <div class="rewards-row">
      <span class="rlabel">Earned this order</span>
      <span class="rval">+${pointsEarned} pts</span>
    </div>
    <div class="rewards-row">
      <span class="rlabel">Your total balance</span>
      <span class="rval">${balance.toLocaleString()} pts</span>
    </div>
    ${next ? `<div class="next-tier">Earn <strong>${(next.points - balance).toLocaleString()} more pts</strong> → unlock <strong>${fmt(next.credit)}</strong> store credit</div>` : `<div class="next-tier">🎉 You've unlocked our highest reward tier!</div>`}
  </div>

  <!-- Footer with QR -->
  <div class="footer-row">
    <div class="footer-text">
      <strong>Scan to sign in &amp; redeem your points</strong><br/>
      <a>vertexresearchlabs.com/rewards</a><br/><br/>
      Questions? <a>support@vertexresearchlabs.com</a><br/>
      All products for laboratory research use only.
    </div>
    <div style="text-align:center;">
      <img src="${qrUrl}" width="80" height="80" style="display:block;"/>
      <div class="qr-label">One tap sign-in</div>
    </div>
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
  const [preview, setPreview] = useState<{ rate: string; service: string; delivery_days: number | null; shipment_id: string; rate_id: string } | null>(null);
  const profile = order.profiles;
  const name = order.shipping_name || profile?.full_name || "—";
  const addr1 = order.shipping_address1 || profile?.address_line1 || "";
  const city = order.shipping_city || profile?.city || "";
  const state = order.shipping_state || profile?.state || "";
  const zip = order.shipping_zip || profile?.zip_code || "";
  const isShipped = order.status === "shipped" || !!order.tracking_number;

  const handlePreviewLabel = async () => {
    setGenerating(true);
    setPreview(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-shipping-label", {
        body: { order_id: order.id, preview_only: true },
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
    try {
      const { data, error } = await supabase.functions.invoke("generate-shipping-label", {
        body: { order_id: order.id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPreview(null);
      toast({ title: "Label purchased!", description: `Tracking: ${data.tracking_number}` });
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

          {preview && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 space-y-2">
              <p className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">Confirm Label Purchase</p>
              <p className="text-sm text-foreground">
                <span className="font-semibold">{preview.service}</span> — <span className="text-primary font-bold">${parseFloat(preview.rate).toFixed(2)}</span>
                {preview.delivery_days ? ` · Est. ${preview.delivery_days} day${preview.delivery_days !== 1 ? "s" : ""}` : ""}
              </p>
              <p className="text-xs text-muted-foreground">→ {name}, {addr1}, {city} {state} {zip}</p>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="hero" onClick={handleBuyLabel} disabled={generating}>
                  <Truck size={14} className="mr-1" />
                  {generating ? "Buying..." : `Buy Label — $${parseFloat(preview.rate).toFixed(2)}`}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setPreview(null)} disabled={generating}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => printPackingSlip(order)}>
              <Printer size={14} className="mr-1" /> Print Packing Slip
            </Button>
            {!isShipped && !preview && (
              <Button size="sm" variant="hero" onClick={handlePreviewLabel} disabled={generating}>
                <Truck size={14} className="mr-1" />
                {generating ? "Fetching rate..." : "Generate USPS Label"}
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
