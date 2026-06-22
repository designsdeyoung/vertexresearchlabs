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

const ADMIN_EMAILS = ["info@vertexdata.ai", "designsdeyoung@gmail.com", "adamdeyoung11@gmail.com"];

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

interface Order {
  id: string;
  order_number: string | null;
  items: any[];
  subtotal: number;
  shipping: number;
  total: number;
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
    address_line1: string | null;
    address_line2: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
  } | null;
}

const PackingSlip = ({ order }: { order: Order }) => {
  const profile = order.profiles;
  const name = order.shipping_name || profile?.full_name || "Customer";
  const addr1 = order.shipping_address1 || profile?.address_line1 || "";
  const addr2 = order.shipping_address2 || profile?.address_line2 || "";
  const city = order.shipping_city || profile?.city || "";
  const state = order.shipping_state || profile?.state || "";
  const zip = order.shipping_zip || profile?.zip_code || "";

  return (
    <div className="hidden print:block p-6 font-mono text-sm text-black bg-white w-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-lg font-bold">VERTEX RESEARCH LABS</p>
          <p className="text-xs">vertexresearchlabs.com</p>
        </div>
        <div className="text-right">
          <p className="font-bold">PACKING SLIP</p>
          <p>{order.order_number || order.id.slice(0, 8)}</p>
          <p>{new Date(order.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="mb-6">
        <p className="font-bold mb-1">SHIP TO:</p>
        <p>{name}</p>
        <p>{addr1}</p>
        {addr2 && <p>{addr2}</p>}
        <p>{city}, {state} {zip}</p>
      </div>
      <table className="w-full border-collapse border border-black text-xs">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-black p-1 text-left">Item</th>
            <th className="border border-black p-1 text-center">Qty</th>
            <th className="border border-black p-1 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(order.items) && order.items.map((item: any, i: number) => (
            <tr key={i}>
              <td className="border border-black p-1">
                {item.name || item.product_name || "Item"}
                {item.weight ? ` (${item.weight})` : ""}
              </td>
              <td className="border border-black p-1 text-center">{item.quantity || 1}</td>
              <td className="border border-black p-1 text-right">
                {formatPrice(Number(item.price || 0) * (item.quantity || 1))}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="border border-black p-1 text-right font-bold">Subtotal</td>
            <td className="border border-black p-1 text-right">{formatPrice(order.subtotal)}</td>
          </tr>
          <tr>
            <td colSpan={2} className="border border-black p-1 text-right font-bold">Shipping</td>
            <td className="border border-black p-1 text-right">{formatPrice(order.shipping)}</td>
          </tr>
          <tr>
            <td colSpan={2} className="border border-black p-1 text-right font-bold">TOTAL</td>
            <td className="border border-black p-1 text-right font-bold">{formatPrice(order.total)}</td>
          </tr>
        </tfoot>
      </table>
      <p className="mt-6 text-xs text-center">Thank you for your order! Questions? support@vertexresearchlabs.com</p>
    </div>
  );
};

const OrderRow = ({ order, onLabelGenerated }: { order: Order; onLabelGenerated: () => void }) => {
  const [expanded, setExpanded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const profile = order.profiles;
  const name = order.shipping_name || profile?.full_name || "—";
  const addr1 = order.shipping_address1 || profile?.address_line1 || "";
  const city = order.shipping_city || profile?.city || "";
  const state = order.shipping_state || profile?.state || "";
  const zip = order.shipping_zip || profile?.zip_code || "";
  const isShipped = order.status === "shipped" || !!order.tracking_number;

  const handleGenerateLabel = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-shipping-label", {
        body: { order_id: order.id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: "Label generated!", description: `Tracking: ${data.tracking_number}` });
      onLabelGenerated();
    } catch (e: any) {
      toast({ title: "Label failed", description: e.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <>
      {/* Hidden packing slip — prints when window.print() is called */}
      <PackingSlip order={order} />

      <div className="glass-card rounded-xl p-4 print:hidden">
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
            <span className="text-sm font-medium text-foreground">{formatPrice(order.total)}</span>
            {expanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
            {/* Address */}
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
              </div>
            </div>

            {/* Tracking */}
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

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={handlePrintSlip}>
                <Printer size={14} className="mr-1" /> Print Packing Slip
              </Button>
              {!isShipped && (
                <Button size="sm" variant="hero" onClick={handleGenerateLabel} disabled={generating}>
                  <Truck size={14} className="mr-1" />
                  {generating ? "Generating..." : "Generate USPS Label"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
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
    let query = supabase
      .from("orders")
      .select(`*, profiles!orders_profile_id_fkey(full_name, email, address_line1, address_line2, city, state, zip_code)`)
      .order("created_at", { ascending: false })
      .limit(100);

    if (filter === "unfulfilled") {
      query = query.not("status", "eq", "shipped").is("tracking_number", null);
    }

    const { data, error } = await query;
    if (!error && data) setOrders(data as Order[]);
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
    <div className="min-h-screen bg-background flex flex-col print:bg-white">
      <Header />
      <main className="flex-1 pt-24 pb-16 print:pt-0">
        <div className="container mx-auto px-6 max-w-4xl print:max-w-full print:px-0">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 print:hidden">
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
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loading}>
                <RefreshCw size={14} className={`mr-1 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 print:hidden">
            <button
              onClick={() => setFilter("unfulfilled")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "unfulfilled"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock size={14} className="inline mr-1" />
              Unfulfilled ({unfulfilled.length})
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <CheckCircle2 size={14} className="inline mr-1" />
              All Orders
            </button>
          </div>

          {/* Orders */}
          {loading ? (
            <div className="text-center text-muted-foreground py-16 print:hidden">
              <RefreshCw size={24} className="mx-auto mb-3 animate-spin opacity-40" />
              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center text-muted-foreground glass-card rounded-xl p-12 print:hidden">
              <CheckCircle2 size={32} className="mx-auto mb-3 opacity-40" />
              <p>{filter === "unfulfilled" ? "No unfulfilled orders — you're all caught up!" : "No orders found."}</p>
            </div>
          ) : (
            <div className="space-y-3 print:space-y-0">
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
