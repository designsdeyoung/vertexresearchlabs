import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useInquiryCart } from "@/contexts/InquiryCartContext";
import { motion } from "framer-motion";
import { CountUp } from "@/components/checkout/CountUp";
import { finalizeOrder, PENDING_ORDER_KEY, type FinalizeResult, type PendingOrder } from "@/lib/finalizeOrder";

import ShareAndEarn from "@/components/checkout/ShareAndEarn";
import {
  CheckCircle2,
  Mail,
  FileText,
  Home,
  Sparkles,
  ArrowRight,
  Phone,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { clearCart } = useInquiryCart();

  const state = location.state as { pointsEarned?: number; creditApplied?: number; total?: number; orderNumber?: string; referralCode?: string; paymentMethod?: string } | null;

  const [finalizedResult, setFinalizedResult] = useState<FinalizeResult | null>(null);
  const [finalizing, setFinalizing] = useState(false);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const paymentIntentParam = searchParams.get("payment_intent");
    const redirectStatus = searchParams.get("redirect_status");
    if (redirectStatus !== "succeeded" || !paymentIntentParam) return;

    let raw: string | null = null;
    try { raw = localStorage.getItem(PENDING_ORDER_KEY); } catch { /* noop */ }
    if (!raw) return;

    let pending: PendingOrder | null = null;
    try { pending = JSON.parse(raw) as PendingOrder; } catch { return; }
    if (!pending || pending.paymentIntentId !== paymentIntentParam) return;

    setFinalizing(true);
    finalizeOrder(pending)
      .then((res) => {
        setFinalizedResult(res);
        try { localStorage.removeItem(PENDING_ORDER_KEY); } catch { /* noop */ }
        clearCart();
      })
      .catch((e) => {
        console.error("OrderConfirmation finalize failed", e);
      })
      .finally(() => setFinalizing(false));
  }, [searchParams, clearCart]);

  const displayed = finalizedResult ?? state ?? {};
  const pointsEarned = (displayed as { pointsEarned?: number }).pointsEarned || 0;
  const creditApplied = (displayed as { creditApplied?: number }).creditApplied || 0;
  const orderNumber = (displayed as { orderNumber?: string | null }).orderNumber || null;
  const referralCode = (displayed as { referralCode?: string | null }).referralCode || null;
  const totalAmount = (displayed as { total?: number }).total;
  const isManualInvoice = (state as { manualInvoice?: boolean } | null)?.manualInvoice === true;
  const payment = (state as { payment?: { amount?: number; memo?: string; note?: string; methods?: { id: string; label: string; emoji: string; to: string }[] } } | null)?.payment ?? null;

  // Emergency manual-invoice fallback confirmation
  if (isManualInvoice) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <FileText size={38} className="text-primary" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">Order Request Received</h1>
            {orderNumber && (
              <div className="inline-flex items-center gap-2 bg-secondary/50 border border-border/50 rounded-lg px-4 py-2 mb-5">
                <span className="text-xs text-muted-foreground">Request</span>
                <span className="text-base font-mono font-semibold text-foreground tracking-wider">{orderNumber}</span>
              </div>
            )}
            <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
              Your order is reserved. To complete it, send payment using any of the options
              below — we also emailed you a copy. No card has been charged.
            </p>

            {/* Payment instructions — pay by any app */}
            {payment?.methods && payment.methods.length > 0 && (
              <div className="rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/10 to-transparent p-6 mb-6 max-w-md mx-auto text-left">
                <p className="text-[11px] uppercase tracking-[0.18em] text-primary font-bold text-center mb-4">Pay by any of these</p>
                <div className="flex items-center justify-between py-2.5 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-2xl font-extrabold text-primary">${Number(payment.amount ?? totalAmount ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between py-2.5 mb-2">
                  <span className="text-sm text-muted-foreground">Note / memo</span>
                  <span className="text-sm font-bold text-foreground font-mono">{payment.memo}</span>
                </div>
                <div className="space-y-2">
                  {payment.methods.map((m) => (
                    <div key={m.id} className="flex items-center justify-between gap-3 rounded-lg bg-secondary/40 border border-border/40 px-3.5 py-2.5">
                      <span className="text-sm font-semibold text-foreground">{m.emoji} {m.label}</span>
                      <span className="text-sm font-bold text-primary font-mono">{m.to}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed text-center">
                  Send the amount above with any option and put{" "}
                  <span className="text-foreground font-semibold">{payment.memo}</span> in the note so we can match your order.
                </p>
                {payment.note && (
                  <p className="text-[11px] text-muted-foreground/70 mt-3 pt-3 border-t border-border/30 leading-relaxed text-center">
                    {payment.note}
                  </p>
                )}
              </div>
            )}

            <div className="glass-card rounded-xl p-5 mb-8 text-left max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <Mail size={18} className="text-primary" />
                <p className="text-sm font-medium text-foreground">What happens next</p>
              </div>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Send your payment using any option above</li>
                <li>We confirm payment (usually same day)</li>
                <li>Your order ships within 1 business day and points are credited</li>
              </ol>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-8">
              <ShieldCheck size={14} className="text-primary" />
              For laboratory research use only. Not for human or veterinary use.
            </div>

            <Button variant="hero" onClick={() => navigate("/")}>
              <Home size={16} /> Back to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-2xl">
          {finalizing && (
            <div className="mb-6 flex items-center justify-center gap-2 text-sm text-muted-foreground glass-card rounded-lg py-3">
              <Loader2 size={16} className="animate-spin text-primary" />
              Finalizing your order…
            </div>
          )}
          {/* Success Header */}

          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <CheckCircle2 size={40} className="text-primary" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-semibold text-foreground mb-4"
            >
              Payment Successful
            </motion.h1>
            {orderNumber && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="inline-flex items-center gap-2 bg-secondary/50 border border-border/50 rounded-lg px-4 py-2 mb-4"
              >
                <span className="text-xs text-muted-foreground">Order</span>
                <span className="text-base font-mono font-semibold text-foreground tracking-wider">{orderNumber}</span>
              </motion.div>
            )}
            {orderNumber && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28 }}
                className="text-xs text-muted-foreground mb-2"
              >
                Keep this for your records
              </motion.p>
            )}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground max-w-md mx-auto"
            >
              Thank you for your order. Your payment has been received and your research materials will ship shortly.
            </motion.p>
          </div>

          {/* Payment Confirmed Block */}
          {totalAmount ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-xl p-6 mb-6 border-primary/30 bg-primary/5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-primary" size={22} />
                  <div>
                    <p className="text-sm font-medium text-foreground">Payment Confirmed</p>
                    <p className="text-xs text-muted-foreground">Charged securely via Stripe</p>
                  </div>
                </div>
                <span className="text-lg font-semibold text-foreground">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </motion.div>
          ) : null}

          {/* Rewards Earned Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-xl p-6 mb-6 border-primary/20 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={20} className="text-primary" />
                <h2 className="text-lg font-medium text-foreground">Vertex Rewards</h2>
              </div>

              {pointsEarned > 0 && (
                <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      +<CountUp end={pointsEarned} duration={1.5} /> pts
                    </p>
                    <p className="text-xs text-muted-foreground">earned on this order</p>
                  </div>
                </div>
              )}

              {!pointsEarned && (
                <p className="text-sm text-muted-foreground mb-4">
                  Points will be added to your account once your order is confirmed.
                  Earn <span className="text-primary font-medium">3 points per $1</span> on every order.
                </p>
              )}

              {!user && (
                <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary/30">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={18} className="text-primary" />
                    <p className="text-sm text-foreground font-semibold">
                      Activate Your Account
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Check your email for a magic link — one click to claim your points and unlock your rewards dashboard.
                  </p>
                  <p className="text-xs text-primary font-medium">
                    Activate to track your referral earnings and redeem rewards.
                  </p>
                </div>
              )}

              {user && (
                <Button variant="hero" size="sm" asChild>
                  <Link to="/dashboard">
                    <Sparkles size={14} />
                    View Your Dashboard
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>

          {/* Share & Earn Section */}
          {referralCode && <ShareAndEarn referralCode={referralCode} />}

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-lg p-6">
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Mail size={20} className="text-primary" />
                What Happens Next
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">1</span>
                  <span>Our team will review your order request and verify product availability.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">2</span>
                  <span>You will receive a confirmation email with pricing and shipping details.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">3</span>
                  <span>Upon confirmation, your order will be processed and shipped with appropriate documentation.</span>
                </li>
              </ul>
            </div>

            {/* Documentation */}
            <div className="glass-card rounded-lg p-6">
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                Documentation
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Relevant documentation for your order:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Certificate of Analysis available on request where applicable
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Product specifications and handling guidelines
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Shipping and storage requirements
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="glass-card rounded-lg p-6 bg-secondary/30">
              <h2 className="text-lg font-medium text-foreground mb-4">Questions?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions about your order, please contact us{orderNumber ? ` with your order number (${orderNumber}) for faster help` : ''}:
              </p>
              <div className="space-y-2">
                <p className="text-sm flex items-center gap-2">
                  <Mail size={14} className="text-primary" />
                  <span className="text-muted-foreground">Email: </span>
                  <a href="mailto:orders@vertexresearchlabs.com" className="text-primary hover:underline">
                    orders@vertexresearchlabs.com
                  </a>
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Phone size={14} className="text-primary" />
                  <span className="text-muted-foreground">Phone: </span>
                  <a href="tel:727-295-1338" className="text-primary hover:underline">
                    (727) 295-1338
                  </a>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" onClick={() => navigate("/")}>
              <Home size={18} />
              Return to Home
            </Button>
            {!user && (
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/dashboard">
                  <Sparkles size={16} />
                  View Rewards
                </Link>
              </Button>
            )}
            {user && (
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/dashboard">
                  View Dashboard
                </Link>
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
