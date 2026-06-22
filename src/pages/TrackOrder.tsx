import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import {
  Package, Search, Truck, CheckCircle2, Clock,
  MapPin, ExternalLink, AlertCircle, ScanLine, ArrowRight,
} from "lucide-react";

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
  tracking_number?: string;
  tracking_url?: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const STAGES = [
  { key: "pending",   label: "Order Received",     icon: Clock },
  { key: "confirmed", label: "Payment Confirmed",   icon: CheckCircle2 },
  { key: "shipped",   label: "Shipped",             icon: Truck },
  { key: "delivered", label: "Delivered",           icon: Package },
];

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  pending:   { label: "Processing", cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/25" },
  confirmed: { label: "Confirmed",  cls: "bg-blue-500/10 text-blue-400 border-blue-500/25" },
  shipped:   { label: "Shipped",    cls: "bg-primary/10 text-primary border-primary/25" },
  delivered: { label: "Delivered",  cls: "bg-green-500/10 text-green-400 border-green-500/25" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const stageIndex = (status: string) => {
  const i = STAGES.findIndex((s) => s.key === status);
  return i < 0 ? 0 : i;
};

export default function TrackOrder() {
  const [fullName, setFullName]       = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail]             = useState("");
  const [zip, setZip]                 = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [results, setResults]         = useState<OrderResult[] | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults(null);
    if (!fullName.trim()) { setError("Enter the full name used at checkout."); return; }
    if (!orderNumber.trim() && !email.trim() && !zip.trim()) {
      setError("Add at least one more detail — order number, email, or ZIP."); return;
    }
    setLoading(true);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("lookup-order", {
        body: { fullName: fullName.trim(), orderNumber: orderNumber.trim(), email: email.trim(), zip: zip.trim() },
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

      <main className="flex-1 pt-28 pb-20">

        {/* ── Hero ── */}
        <section className="container mx-auto px-6 text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <ScanLine size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary tracking-wider uppercase">Order Tracking</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Where's My <span className="text-primary">Order?</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              No account needed. Enter your name and one detail below to pull up your order status instantly.
            </p>
          </motion.div>
        </section>

        {/* ── Lookup Form ── */}
        <section className="container mx-auto px-6 mb-16">
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp}
            className="max-w-xl mx-auto"
          >
            <div className="glass-card rounded-2xl p-8 border border-border/50 relative overflow-hidden">
              {/* decorative step number */}
              <span className="absolute top-4 right-6 text-7xl font-black text-primary/5 select-none pointer-events-none">01</span>

              <form onSubmit={handleLookup} className="space-y-6 relative">

                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Full name <span className="text-primary font-normal text-xs">(required)</span>
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full h-12 px-4 rounded-xl border border-border bg-background/60 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-border/50" />
                  <span className="text-[11px] text-muted-foreground/60 font-medium uppercase tracking-widest">+ one of these</span>
                  <div className="flex-1 h-px bg-border/50" />
                </div>

                {/* Three secondary fields */}
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { id: "on",    label: "Order #",  ph: "VRL-1234",     val: orderNumber, set: setOrderNumber },
                    { id: "em",    label: "Email",     ph: "you@email.com", val: email,       set: setEmail, type: "email" },
                    { id: "zp",    label: "ZIP",       ph: "90210",         val: zip,         set: setZip },
                  ] as any[]).map(({ id, label, ph, val, set, type }) => (
                    <div key={id} className="space-y-1.5">
                      <label htmlFor={id} className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
                      <input
                        id={id} type={type || "text"} value={val}
                        onChange={(e) => set(e.target.value)}
                        placeholder={ph}
                        className="w-full h-10 px-3 rounded-lg border border-border bg-background/60 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit" disabled={loading}
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground text-sm font-bold tracking-wide flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                >
                  {loading
                    ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    : <Search size={15} />}
                  {loading ? "Searching…" : "Find My Order"}
                  {!loading && <ArrowRight size={15} className="ml-auto" />}
                </button>
              </form>
            </div>
          </motion.div>
        </section>

        {/* ── How it works (3 cards) — shown until results load ── */}
        {!results && (
          <section className="container mx-auto px-6 mb-16">
            <h2 className="text-xl font-semibold text-foreground text-center mb-8">
              What to expect after you order
            </h2>
            <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {[
                { step: "01", icon: Clock,       title: "Order Received",     desc: "We confirm your payment and begin preparing your compounds within 1 business day." },
                { step: "02", icon: Package,     title: "Packaged & Labeled",  desc: "Your order is carefully packaged with a packing slip and USPS Priority label generated." },
                { step: "03", icon: Truck,       title: "Shipped to You",      desc: "Priority Mail ships in 1–3 business days. You'll receive tracking once it's on its way." },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="glass-card rounded-xl p-6 relative overflow-hidden group border border-border/50"
                >
                  <span className="absolute top-3 right-4 text-5xl font-black text-primary/5 group-hover:text-primary/10 transition-colors select-none">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <item.icon size={20} className="text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── No results ── */}
        {results && results.length === 0 && (
          <section className="container mx-auto px-6">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}
              className="max-w-xl mx-auto glass-card rounded-2xl p-10 text-center border border-border/50">
              <div className="w-14 h-14 rounded-full bg-muted/20 border border-border/40 flex items-center justify-center mx-auto mb-5">
                <Package size={22} className="text-muted-foreground/50" />
              </div>
              <p className="font-semibold text-foreground mb-2">No orders found</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Double-check that the name matches exactly what you entered at checkout. Need help?{" "}
                <a href="mailto:info@vertexresearchlabs.com" className="text-primary hover:underline">Contact us</a>.
              </p>
            </motion.div>
          </section>
        )}

        {/* ── Results ── */}
        {results && results.length > 0 && (
          <section className="container mx-auto px-6">
            <div className="max-w-xl mx-auto space-y-5">
              {results.map((order, oi) => {
                const idx = stageIndex(order.status);
                const cfg = STATUS_CONFIG[order.status] || { label: order.status, cls: "bg-muted/20 text-muted-foreground border-border" };
                const items = Array.isArray(order.items)
                  ? order.items
                  : typeof order.items === "string" ? JSON.parse(order.items) : [];

                return (
                  <motion.div
                    key={order.id}
                    custom={oi}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="glass-card rounded-2xl overflow-hidden border border-border/50"
                  >
                    {/* Card header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
                      <div>
                        <p className="font-mono text-[11px] text-muted-foreground/60 mb-0.5">
                          {order.order_number || order.id.slice(0, 8)}
                        </p>
                        <p className="text-lg font-bold text-foreground">{fmt(order.total)}</p>
                      </div>
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-wide ${cfg.cls}`}>
                        {cfg.label}
                      </span>
                    </div>

                    <div className="p-6 space-y-6">

                      {/* Progress stepper */}
                      <div className="flex items-start justify-between relative pt-1">
                        <div className="absolute top-[15px] left-4 right-4 h-px bg-border/40" />
                        <div
                          className="absolute top-[15px] left-4 h-px bg-primary transition-all duration-700"
                          style={{ width: idx === 0 ? "0%" : `calc(${(idx / (STAGES.length - 1)) * 100}% - 16px)` }}
                        />
                        {STAGES.map((stage, i) => {
                          const Icon = stage.icon;
                          const done = i < idx;
                          const current = i === idx;
                          return (
                            <div key={stage.key} className="relative flex flex-col items-center z-10 flex-1 gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                done    ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/40" :
                                current ? "bg-primary/10 border-primary text-primary" :
                                          "bg-background border-border/40 text-muted-foreground/30"
                              }`}>
                                {done ? <CheckCircle2 size={14} /> : <Icon size={13} />}
                              </div>
                              <span className={`text-[10px] text-center leading-tight font-medium ${
                                done || current ? "text-foreground" : "text-muted-foreground/40"
                              }`}>{stage.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Tracking */}
                      {order.tracking_number && (
                        <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                              <MapPin size={14} className="text-primary" />
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Tracking Number</p>
                              <p className="font-mono text-sm text-foreground font-semibold">{order.tracking_number}</p>
                            </div>
                          </div>
                          {order.tracking_url && (
                            <a href={order.tracking_url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline shrink-0 bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                              USPS <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      )}

                      {/* Items */}
                      {items.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-3">Items</p>
                          <ul className="space-y-2.5">
                            {items.map((item: any, i: number) => (
                              <li key={i} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                                  <span className="text-sm text-foreground">
                                    {item.productName || item.name || item.product_name || "Item"}
                                    {item.size ? <span className="text-muted-foreground"> · {item.size}</span> : null}
                                    {item.quantity > 1 ? <span className="text-muted-foreground"> × {item.quantity}</span> : null}
                                  </span>
                                </div>
                                {(item.lineTotal ?? item.price) != null && (
                                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                                    {fmt(Number(item.lineTotal ?? item.price ?? 0))}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <p className="text-[11px] text-muted-foreground/40 text-right">
                        Placed {new Date(order.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Help ── */}
        <div className="container mx-auto px-6 mt-14 text-center">
          <p className="text-sm text-muted-foreground">
            Need help with your order?{" "}
            <a href="mailto:info@vertexresearchlabs.com" className="text-primary hover:underline font-semibold">
              info@vertexresearchlabs.com
            </a>
          </p>
        </div>

      </main>
      <Footer />
    </div>
  );
}
