import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Plus, Trash2, Check, ArrowLeft, Search } from "lucide-react";
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

interface PreviousCustomer {
  email: string;
  fullName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  lastOrderNumber: string | null;
}

interface PreviousOrder {
  order_number: string | null;
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
  const [previousCustomers, setPreviousCustomers] = useState<PreviousCustomer[]>([]);
  const [customerSearchLoading, setCustomerSearchLoading] = useState(false);
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);

  const [rows, setRows] = useState<LineRow[]>([
    { productId: products[0]?.id ?? "", quantity: 1 },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<
    | { ok: true; orderNumber: string; points: number; emailSent: boolean }
    | { ok: false; message: string }
    | null
  >(null);

  useEffect(() => {
    if (!isAdmin) return;

    let active = true;
    const loadPreviousCustomers = async () => {
      setCustomerSearchLoading(true);
      const { data, error } = await supabase.functions.invoke("get-fulfillment-orders", {
        body: { filter: "all" },
      });

      if (!active) return;
      if (!error && Array.isArray(data?.orders)) {
        // The endpoint returns newest orders first. Keeping the first order for
        // each email gives us that customer's latest known shipping address.
        const byEmail = new Map<string, PreviousCustomer>();
        for (const order of data.orders as PreviousOrder[]) {
          const customerEmail = order.profiles?.email?.trim();
          if (!customerEmail) continue;
          const key = customerEmail.toLowerCase();
          if (byEmail.has(key)) continue;

          byEmail.set(key, {
            email: customerEmail,
            fullName: order.shipping_name || order.profiles?.full_name || "",
            address1: order.shipping_address1 || order.profiles?.address_line1 || "",
            address2: order.shipping_address2 || order.profiles?.address_line2 || "",
            city: order.shipping_city || order.profiles?.city || "",
            state: order.shipping_state || order.profiles?.state || "",
            zip: order.shipping_zip || order.profiles?.zip_code || "",
            lastOrderNumber: order.order_number,
          });
        }
        setPreviousCustomers([...byEmail.values()]);
      }
      setCustomerSearchLoading(false);
    };

    void loadPreviousCustomers();
    return () => { active = false; };
  }, [isAdmin]);

  const matchingCustomers = useMemo(() => {
    const query = fullName.trim().toLowerCase();
    if (query.length < 2) return [];
    return previousCustomers
      .filter((customer) =>
        customer.fullName.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query),
      )
      .slice(0, 6);
  }, [fullName, previousCustomers]);

  const selectCustomer = (customer: PreviousCustomer) => {
    setFullName(customer.fullName);
    setEmail(customer.email);
    setAddress1(customer.address1);
    setAddress2(customer.address2);
    setCity(customer.city);
    setState(customer.state);
    setZip(customer.zip);
    setCustomerSearchOpen(false);
  };

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
                setCustomerSearchOpen(false);
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
                <div className="relative">
                  <div className="relative">
                    <Search
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      className={`${inputCls} pl-9`}
                      placeholder="Start typing a customer name"
                      value={fullName}
                      onFocus={() => setCustomerSearchOpen(true)}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setCustomerSearchOpen(true);
                      }}
                      onBlur={() => window.setTimeout(() => setCustomerSearchOpen(false), 150)}
                      autoComplete="off"
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={customerSearchOpen && fullName.trim().length >= 2}
                      aria-controls="previous-customer-options"
                    />
                  </div>
                  {customerSearchOpen && fullName.trim().length >= 2 && (
                    <div
                      id="previous-customer-options"
                      role="listbox"
                      className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-xl"
                    >
                      {customerSearchLoading ? (
                        <div className="flex items-center gap-2 px-3 py-3 text-xs text-muted-foreground">
                          <Loader2 size={13} className="animate-spin" /> Loading customers…
                        </div>
                      ) : matchingCustomers.length > 0 ? (
                        matchingCustomers.map((customer) => (
                          <button
                            key={customer.email.toLowerCase()}
                            type="button"
                            role="option"
                            aria-selected="false"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => selectCustomer(customer)}
                            className="w-full rounded-sm px-3 py-2 text-left transition-colors hover:bg-accent focus:bg-accent focus:outline-none"
                          >
                            <div className="text-sm font-medium text-foreground">{customer.fullName}</div>
                            <div className="truncate text-xs text-muted-foreground">{customer.email}</div>
                            {(customer.address1 || customer.city) && (
                              <div className="mt-0.5 truncate text-[11px] text-muted-foreground/80">
                                {[customer.address1, customer.city, customer.state, customer.zip]
                                  .filter(Boolean)
                                  .join(", ")}
                                {customer.lastOrderNumber ? ` · ${customer.lastOrderNumber}` : ""}
                              </div>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-3 text-xs text-muted-foreground">
                          No matching previous customer. Keep typing to add a new one.
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
                <div key={i} className="grid grid-cols-[minmax(0,1fr)_5rem_auto] items-center gap-2">
                  <select
                    className={`${inputCls} min-w-0`}
                    value={row.productId}
                    onChange={(e) => updateRow(i, { productId: e.target.value })}
                    aria-label={`Product ${i + 1}`}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {labelFor(p.id)}
                      </option>
                    ))}
                  </select>
                  <input
                    className={`${inputCls} text-center`}
                    type="number"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    value={row.quantity}
                    onFocus={(e) => e.currentTarget.select()}
                    onChange={(e) => updateRow(i, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                    aria-label={`Quantity for ${labelFor(row.productId)}`}
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
