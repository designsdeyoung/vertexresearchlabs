import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Package, Search, Truck, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface OrderResult {
  id: string;
  order_number: string | null;
  items: any;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  paid_at: string | null;
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const STAGES = [
  { key: "pending", label: "Order Received", icon: Clock },
  { key: "confirmed", label: "Payment Confirmed", icon: CheckCircle2 },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Package },
];

const stageIndex = (status: string) =>
  Math.max(0, STAGES.findIndex((s) => s.key === status));

const TrackOrder = () => {
  const [fullName, setFullName] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<OrderResult[] | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults(null);
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!orderNumber.trim() && !email.trim() && !zip.trim()) {
      setError("Add at least one of: order number, email, or ZIP code.");
      return;
    }
    setLoading(true);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("lookup-order", {
        body: {
          fullName: fullName.trim(),
          orderNumber: orderNumber.trim(),
          email: email.trim(),
          zip: zip.trim(),
        },
      });
      if (fnErr) throw fnErr;
      if ((data as any)?.error) throw new Error((data as any).error);
      setResults((data as any).orders || []);
    } catch (err: any) {
      setError(err.message || "Lookup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Track Your Order | Vertex Research Labs"
        description="Look up your research peptide order status and shipping information."
      />
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <Package size={20} className="text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                Order Tracking
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-2">
              Track your order
            </h1>
            <p className="text-muted-foreground">
              Enter your name and one other detail to find your order. No login required.
            </p>
          </div>

          <form onSubmit={handleLookup} className="glass-card rounded-xl p-6 space-y-4">
            <div>
              <Label htmlFor="fullName">Full name (required)</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="mt-1"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="orderNumber">Order #</Label>
                <Input
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="VRL-1234"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="zip">ZIP code</Label>
                <Input
                  id="zip"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="90210"
                  className="mt-1"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Provide at least one of the three above along with your name.
            </p>
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <Button type="submit" variant="hero" size="lg" disabled={loading} className="w-full">
              <Search size={16} />
              {loading ? "Searching..." : "Find my order"}
            </Button>
          </form>

          {results && results.length === 0 && (
            <div className="mt-8 text-center text-muted-foreground glass-card rounded-xl p-8">
              <Package size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">
                No orders found. Double-check the spelling of your name and the other details.
              </p>
            </div>
          )}

          {results && results.length > 0 && (
            <div className="mt-8 space-y-6">
              {results.map((order) => {
                const idx = stageIndex(order.status);
                return (
                  <div key={order.id} className="glass-card rounded-xl p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-mono">
                          {order.order_number || order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-foreground font-medium">
                          Placed {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">
                          {formatPrice(order.total)}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {order.payment_method}
                        </p>
                      </div>
                    </div>

                    {/* Progress tracker */}
                    <div className="flex items-center justify-between mb-6 relative">
                      <div className="absolute top-4 left-4 right-4 h-0.5 bg-border" />
                      <div
                        className="absolute top-4 left-4 h-0.5 bg-primary transition-all"
                        style={{ width: `calc(${(idx / (STAGES.length - 1)) * 100}% - ${idx === 0 ? '0px' : '8px'})` }}
                      />
                      {STAGES.map((stage, i) => {
                        const Icon = stage.icon;
                        const active = i <= idx;
                        return (
                          <div key={stage.key} className="relative flex flex-col items-center z-10 flex-1">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                active
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "bg-background border-border text-muted-foreground"
                              }`}
                            >
                              <Icon size={14} />
                            </div>
                            <span
                              className={`mt-2 text-[10px] text-center ${
                                active ? "text-foreground font-medium" : "text-muted-foreground"
                              }`}
                            >
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Items */}
                    <div className="border-t border-border/50 pt-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                        Items
                      </p>
                      <ul className="space-y-1.5">
                        {Array.isArray(order.items) &&
                          order.items.map((item: any, i: number) => (
                            <li key={i} className="flex justify-between text-sm">
                              <span className="text-foreground">
                                {item.name || item.product_name || "Item"}
                                {item.quantity ? ` × ${item.quantity}` : ""}
                                {item.weight ? ` · ${item.weight}` : ""}
                              </span>
                              {item.price != null && (
                                <span className="text-muted-foreground">
                                  {formatPrice(Number(item.price) * (item.quantity || 1))}
                                </span>
                              )}
                            </li>
                          ))}
                      </ul>
                    </div>

                    {order.status === "pending" && order.payment_method === "bitcoin" && (
                      <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 text-yellow-500 text-xs">
                        Awaiting Bitcoin payment confirmation. Your order ships once payment is received.
                      </div>
                    )}
                    {order.status === "shipped" && (
                      <div className="mt-4 p-3 rounded-lg bg-primary/10 text-primary text-xs">
                        Your order has shipped. Tracking details were emailed to you.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Need help? Email{" "}
            <a href="mailto:support@vertexresearchlabs.com" className="text-primary hover:underline">
              support@vertexresearchlabs.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackOrder;
