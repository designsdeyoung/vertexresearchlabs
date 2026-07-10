import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Plus, Trash2, Check, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";
import { POINTS_PER_DOLLAR } from "@/hooks/useRewards";
import { Button } from "@/components/ui/button";

// Same allowlist that gates /fulfillment.
const ADMIN_EMAILS = [
  "info@vertexdata.ai",
  "designsdeyoung@gmail.com",
  "adamdeyoung11@gmail.com",
  "info@vertexresearchlabs.com",
];

interface LineRow {
  productId: string;
  quantity: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

// Cash orders earn the base 3× rate on the amount actually paid (subtotal
// after any discount). Matches calculatePointsForPrice() in useRewards.
const pointsFor = (paid: number) => Math.floor(paid * POINTS_PER_DOLLAR);

const labelFor = (id: string) => {
  const p = products.find((x) => x.id === id);
  return p ? `${p.name} · ${p.size} — ${fmt(p.price)}` : id;
};

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none";

const CashOrder = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email || "");

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/auth");
    else if (!isAdmin) navigate("/");
  }, [authLoading, user, isAdmin, navigate]);

  // Prefill from query params (?name=&email=&address1=&city=&state=&zip=)
  const [fullName, setFullName] = useState(params.get("name") ?? "");
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [address1, setAddress1] = useState(params.get("address1") ?? "");
  const [address2, setAddress2] = useState(params.get("address2") ?? "");
  const [city, setCity] = useState(params.get("city") ?? "");
  const [state, setState] = useState(params.get("state") ?? "");
  const [zip, setZip] = useState(params.get("zip") ?? "");
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);

  const [rows, setRows] = useState<LineRow[]>([
    { productId: products[0]?.id ?? "", quantity: 1 },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<
    | { ok: true; orderNumber: string; points: number; emailSent: boolean }
    | { ok: false; message: string }
    | null
  >(null);

  const lineItems = useMemo(
    () =>
      rows
        .map((r) => {
          const p = products.find((x) => x.id === r.productId);
          if (!p || r.quantity < 1) return null;
          return {
            productId: p.id,
            productName: p.name,
            size: p.size,
            price: p.price,
            quantity: r.quantity,
            lineTotal: +(p.price * r.quantity).toFixed(2),
          };
        })
        .filter(Boolean) as {
        productId: string;
        productName: string;
        size: string;
        price: number;
        quantity: number;
        lineTotal: number;
      }[],
    [rows],
  );

  const subtotal = useMemo(
    () => +lineItems.reduce((s, i) => s + i.lineTotal, 0).toFixed(2),
    [lineItems],
  );
  const paid = Math.max(0, +(subtotal - discount).toFixed(2));
  const total = +(paid + shipping).toFixed(2);
  const points = pointsFor(paid);

  const canSubmit =
    !!fullName.trim() &&
    /\S+@\S+\.\S+/.test(email) &&
    lineItems.length > 0 &&
    !submitting;

  const updateRow = (i: number, patch: Partial<LineRow>) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addRow = () =>
    setRows((prev) => [...prev, { productId: products[0]?.id ?? "", quantity: 1 }]);
  const removeRow = (i: number) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const submit = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke(
        "admin-create-manual-order",
        {
          body: {
            email: email.trim(),
            fullName: fullName.trim(),
            items: lineItems,
            subtotal,
            shipping,
            total,
            discountAmount: discount,
            pointsEarned: points,
            shippingAddress: {
              name: fullName.trim(),
              address1: address1.trim(),
              address2: address2.trim() || null,
              city: city.trim(),
              state: state.trim(),
              zip: zip.trim(),
            },
          },
        },
      );
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult({
        ok: true,
        orderNumber: data?.order?.order_number ?? "—",
        points,
        emailSent: !!data?.resend && !data?.resend?.message,
      });
    } catch (e) {
      setResult({ ok: false, message: e instanceof Error ? e.message : "Failed to create order" });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate("/fulfillment")}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} /> Fulfillment
        </button>

        <h1 className="font-display text-2xl font-bold tracking-tight">Add Cash Order</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Records a paid cash order, credits {POINTS_PER_DOLLAR}× loyalty points to the
          customer's account, and emails them a magic link to claim it.
        </p>

        {result?.ok ? (
          <div className="mt-8 rounded-lg border border-primary/30 bg-primary/5 p-6">
            <div className="flex items-center gap-2 text-primary">
              <Check size={18} />
              <span className="font-semibold">Order {result.orderNumber} created</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Credited <strong className="text-foreground">{result.points.toLocaleString()} points</strong> to{" "}
              {email}. {result.emailSent ? "Claim email sent" : "Order saved (check email delivery)"}.
            </p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => {
                setResult(null);
                setRows([{ productId: products[0]?.id ?? "", quantity: 1 }]);
                setFullName(""); setEmail(""); setAddress1(""); setAddress2("");
                setCity(""); setState(""); setZip(""); setDiscount(0); setShipping(0);
              }}
            >
              New order
            </Button>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {/* Customer */}
            <section className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Customer
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <input className={inputCls} placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <input className={inputCls} placeholder="Email (required for points)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </section>

            {/* Shipping */}
            <section className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Shipping address
              </h2>
              <input className={inputCls} placeholder="Address line 1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
              <input className={inputCls} placeholder="Address line 2 (optional)" value={address2} onChange={(e) => setAddress2(e.target.value)} />
              <div className="grid gap-3 sm:grid-cols-3">
                <input className={inputCls} placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                <input className={inputCls} placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
                <input className={inputCls} placeholder="ZIP" value={zip} onChange={(e) => setZip(e.target.value)} />
              </div>
            </section>

            {/* Items */}
            <section className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Items
              </h2>
              {rows.map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    className={`${inputCls} flex-1`}
                    value={row.productId}
                    onChange={(e) => updateRow(i, { productId: e.target.value })}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {labelFor(p.id)}
                      </option>
                    ))}
                  </select>
                  <input
                    className={`${inputCls} w-16 text-center`}
                    type="number"
                    min={1}
                    value={row.quantity}
                    onChange={(e) => updateRow(i, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                  />
                  <button
                    onClick={() => removeRow(i)}
                    className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:text-destructive disabled:opacity-30"
                    disabled={rows.length === 1}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={addRow}
                className="inline-flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-primary/80"
              >
                <Plus size={14} /> Add item
              </button>
            </section>

            {/* Adjustments + totals */}
            <section className="space-y-3 rounded-lg border border-border bg-card/40 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="text-muted-foreground">Discount ($)</span>
                  <input className={`${inputCls} mt-1`} type="number" min={0} step="0.01" value={discount} onChange={(e) => setDiscount(Math.max(0, Number(e.target.value) || 0))} />
                </label>
                <label className="text-sm">
                  <span className="text-muted-foreground">Shipping ($)</span>
                  <input className={`${inputCls} mt-1`} type="number" min={0} step="0.01" value={shipping} onChange={(e) => setShipping(Math.max(0, Number(e.target.value) || 0))} />
                </label>
              </div>
              <div className="space-y-1 border-t border-border pt-3 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="tabular-nums text-foreground">{fmt(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-muted-foreground"><span>Discount</span><span className="tabular-nums">−{fmt(discount)}</span></div>}
                {shipping > 0 && <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span className="tabular-nums text-foreground">{fmt(shipping)}</span></div>}
                <div className="flex justify-between pt-1 font-semibold"><span>Total (cash)</span><span className="tabular-nums">{fmt(total)}</span></div>
                <div className="flex justify-between pt-1 text-primary"><span>Points to credit</span><span className="tabular-nums font-semibold">{points.toLocaleString()} pts</span></div>
              </div>
            </section>

            {result && result.ok === false && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {result.message}
              </p>
            )}

            <Button className="w-full" size="lg" disabled={!canSubmit} onClick={submit}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : `Create order & credit ${points.toLocaleString()} points`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashOrder;
