import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCompliance } from "@/contexts/ComplianceContext";
import { useInquiryCart, computeUnitPrice } from "@/contexts/InquiryCartContext";
import { FREE_SHIPPING_THRESHOLD, FLAT_RATE_SHIPPING } from "@/contexts/InquiryCartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { calculatePointsForPrice } from "@/hooks/useRewards";
import { getStoredReferralCode } from "@/hooks/useReferralCapture";
import CreditRedemption from "@/components/checkout/CreditRedemption";
import StripePayment from "@/components/checkout/StripePayment";
import {
  Shield,
  Building2,
  Mail,
  User,
  FileText,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

interface ActiveCredit {
  id: string;
  amount: number;
  points_cost: number;
  min_cart: number;
  max_percent: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { hasAcknowledged, eligibilityType, resetCompliance } = useCompliance();
  const { items, clearCart, subtotal, shippingCost, total, qualifiesForFreeShipping, hasAutoship } = useInquiryCart();
  const { user, profile } = useAuth();

  const [selectedCredit, setSelectedCredit] = useState<ActiveCredit | null>(null);
  const paymentMethod = "stripe";
  const [showPayment, setShowPayment] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountValid, setDiscountValid] = useState<boolean | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountReferrerId, setDiscountReferrerId] = useState<string | null>(null);
  const [promoFreeShipping, setPromoFreeShipping] = useState(false);
  const [discountMessage, setDiscountMessage] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Apply discount code (10% off subtotal)
  const discountAmount = discountValid ? subtotal * 0.1 : 0;

  // Override shipping when promo grants free shipping
  const effectiveShipping = promoFreeShipping ? 0 : shippingCost;
  const effectiveTotal = subtotal + effectiveShipping;

  // Calculate discount from credit
  const creditDiscount = selectedCredit
    ? Math.min(selectedCredit.amount, effectiveTotal * (selectedCredit.max_percent / 100))
    : 0;
  const finalTotal = Math.max(0, effectiveTotal - creditDiscount - discountAmount);
  const pointsEarned = calculatePointsForPrice(subtotal);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setDiscountLoading(true);
    setDiscountValid(null);
    setDiscountMessage(null);
    try {
      const { data, error } = await supabase.functions.invoke("validate-discount", {
        body: {
          code: discountCode.trim(),
          customerEmail: formData.email,
        },
      });

      if (error || !data?.valid) {
        setDiscountValid(false);
        setDiscountReferrerId(null);
        setPromoFreeShipping(false);
        setDiscountMessage(data?.reason || error?.message || "Invalid or expired code. Please try again.");
      } else {
        setDiscountValid(true);
        setDiscountReferrerId(data.referrerId);
        setPromoFreeShipping(!!data.freeShipping);
        setDiscountMessage(null);
      }
    } catch {
      setDiscountValid(false);
      setDiscountReferrerId(null);
      setPromoFreeShipping(false);
      setDiscountMessage("Invalid or expired code. Please try again.");
    } finally {
      setDiscountLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    organization: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    notes: "",
  });

  // Pre-fill from profile
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: profile.full_name || prev.fullName,
        email: profile.email || prev.email,
        phoneNumber: profile.phone_number || prev.phoneNumber,
        organization: profile.organization || prev.organization,
      }));
    }
  }, [profile]);

  // Auto-apply discount code from URL param
  const [autoApplyDone, setAutoApplyDone] = useState(false);
  useEffect(() => {
    const discountParam = searchParams.get("discount");
    if (discountParam && !autoApplyDone) {
      const code = discountParam.trim().toUpperCase();
      setDiscountCode(code);
      // Clean param from URL
      searchParams.delete("discount");
      setSearchParams(searchParams, { replace: true });
      setAutoApplyDone(true);
    }
  }, [searchParams, setSearchParams, autoApplyDone]);

  // Trigger validation once discount code is set from URL and email is available
  useEffect(() => {
    if (autoApplyDone && discountCode && discountValid === null && !discountLoading && formData.email) {
      handleApplyDiscount();
    }
  }, [autoApplyDone, discountCode, discountValid, discountLoading, formData.email]);

  const [finalConfirmation, setFinalConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not acknowledged
  if (!hasAcknowledged) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
              <Shield size={32} className="text-destructive" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-4">Research Access Required</h1>
            <p className="text-muted-foreground mb-6">
              Please complete the research access acknowledgment before proceeding to checkout.
            </p>
            <Button variant="hero" onClick={() => navigate("/research-access")}>
              Complete Research Access
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Redirect if no items
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <h1 className="text-2xl font-semibold text-foreground mb-4">No Items Selected</h1>
            <p className="text-muted-foreground mb-6">
              Your inquiry list is empty. Please add products before proceeding.
            </p>
            <Button variant="hero" onClick={() => navigate("/")}>
              Browse Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const eligibilityLabels: Record<string, string> = {
    individual: "Individual Researcher",
    laboratory: "Laboratory or Institution",
    organization: "Other Research Organization",
  };

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalConfirmation) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm that your order is for laboratory research use only.",
        variant: "destructive",
      });
      return;
    }

    // Autoship branch: redirect to Stripe Checkout (subscription mode)
    if (hasAutoship) {
      setIsSubmitting(true);
      try {
        const autoshipLines = items
          .filter((i) => i.isAutoship)
          .map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            unitAmount: computeUnitPrice(i),
            quantity: i.quantity,
            is3Pack: !!i.is3Pack,
            intervalDays: i.intervalDays ?? (i.is3Pack ? 90 : 30),
          }));
        const oneTimeLines = items
          .filter((i) => !i.isAutoship)
          .map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            unitAmount: computeUnitPrice(i),
            quantity: i.quantity,
          }));

        const origin = window.location.origin;
        const { data, error } = await supabase.functions.invoke("create-subscription-checkout", {
          body: {
            email: formData.email,
            customerName: formData.fullName,
            autoshipLines,
            oneTimeLines,
            shippingAmount: effectiveShipping,
            shippingAddress: {
              line1: formData.addressLine1,
              line2: formData.addressLine2,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zipCode,
              country: formData.country,
              phone: formData.phoneNumber,
              organization: formData.organization,
            },
            successUrl: `${origin}/order-confirmation?autoship=1`,
            cancelUrl: `${origin}/checkout`,
          },
        });
        if (error || !data?.url) {
          throw new Error(error?.message || "Could not start subscription checkout");
        }
        window.location.href = data.url;
      } catch (err) {
        console.error(err);
        toast({
          title: "Subscription error",
          description: err instanceof Error ? err.message : "Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
      return;
    }

    setShowPayment(true);
    // Scroll payment section into view
    setTimeout(() => {
      document.getElementById("stripe-payment-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleStripeSuccess = async (stripePaymentIntentId: string) => {
    setIsSubmitting(true);

    const orderItems = items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      size: item.product.size,
      price: item.product.price,
      quantity: item.quantity,
      lineTotal: item.product.price * item.quantity,
    }));

    // Build order data for email (will be re-sent with orderNumber after award-points)
    const orderItems2 = orderItems;

    try {
      const effectivePaymentMethod = finalTotal === 0 ? "credit" : paymentMethod;

      // Award points via edge function FIRST to get order number
      // Use discount code as referrer if applied, otherwise fall back to URL-captured code
      const referralCode = discountValid ? discountCode.trim().toUpperCase() : getStoredReferralCode();
      const { data: awardData, error: awardError } = await supabase.functions.invoke("award-points", {
        body: {
          customerEmail: formData.email,
          customerName: formData.fullName,
          items: orderItems,
          subtotal,
          shipping: effectiveShipping,
          total: finalTotal,
          creditApplied: creditDiscount,
          creditId: selectedCredit?.id || null,
          referrerCode: referralCode,
          discountCode: discountValid ? discountCode.trim().toUpperCase() : null,
          discountAmount: discountAmount,
          paymentMethod: effectivePaymentMethod,
          stripePaymentIntentId,
        },
      });

      if (awardError) {
        console.error("Error awarding points:", awardError);
      } else {
        console.log("Points awarded:", awardData);
      }

      const orderNumber = awardData?.orderNumber || null;

      // Build order data for email with order number + rewards data
      const orderData = {
        customer: formData,
        eligibilityType,
        items: orderItems2,
        subtotal,
        shipping: effectiveShipping,
        total: finalTotal,
        orderNumber,
        pointsEarned: awardData?.pointsEarned || pointsEarned,
        referralCode: awardData?.referralCode || null,
        isNewAccount: awardData?.accountCreated || false,
        discountAmount: discountAmount,
        discountCode: discountValid ? discountCode.trim().toUpperCase() : null,
        paymentMethod: effectivePaymentMethod,
      };
      // Send order confirmation email with order number
      const { error: emailError } = await supabase.functions.invoke("send-order-confirmation", {
        body: orderData,
      });

      if (emailError) {
        console.error("Error sending order confirmation:", emailError);
      }

      // Welcome email is now triggered automatically by the award-points function
      // for new accounts (delayed 4 minutes via Resend scheduled send)

      toast({
        title: "Order Submitted",
        description: "A confirmation email has been sent to your inbox.",
      });

      clearCart();
      resetCompliance();
      navigate("/order-confirmation", {
        state: {
          pointsEarned: awardData?.pointsEarned || pointsEarned,
          creditApplied: creditDiscount,
          total: finalTotal,
          orderNumber,
          referralCode: awardData?.referralCode || null,
          paymentMethod: effectivePaymentMethod,
        },
      });
    } catch (err) {
      console.error("Error submitting order:", err);
      toast({
        title: "Error",
        description: "There was a problem submitting your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCoveredByCredits = () => {
    void handleStripeSuccess(`credit-${Date.now()}`);
  };

  const isFormValid =
    formData.fullName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phoneNumber.trim() !== "" &&
    formData.addressLine1.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.state.trim() !== "" &&
    formData.zipCode.trim() !== "" &&
    formData.country.trim() !== "" &&
    finalConfirmation;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Button variant="ghost" size="sm" className="mb-8 -ml-2" onClick={() => navigate("/research-access")}>
            <ArrowLeft size={16} />
            Back to Research Access
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-semibold text-foreground mb-2">Checkout</h1>
              <p className="text-muted-foreground mb-8">Complete your research materials order</p>

              <form onSubmit={handleContinueToPayment} className="space-y-6">
                {/* Contact Information */}
                <div className="glass-card rounded-lg p-6">
                  <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                    <User size={20} className="text-primary" />
                    Contact Information
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input id="fullName" required maxLength={100} value={formData.fullName} onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))} placeholder="Dr. Jane Smith" className="bg-secondary/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" required maxLength={255} value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} placeholder="jane.smith@research.edu" className="bg-secondary/50" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input id="phoneNumber" type="tel" required maxLength={30} value={formData.phoneNumber} onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))} placeholder="(555) 123-4567" className="bg-secondary/50" />
                    </div>
                  </div>
                </div>

                {/* Organization */}
                <div className="glass-card rounded-lg p-6">
                  <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                    <Building2 size={20} className="text-primary" />
                    Organization Details
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization / University (Optional)</Label>
                      <Input id="organization" maxLength={200} value={formData.organization} onChange={(e) => setFormData((prev) => ({ ...prev, organization: e.target.value }))} placeholder="University Research Laboratory" className="bg-secondary/50" />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="glass-card rounded-lg p-6">
                  <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                    <Mail size={20} className="text-primary" />
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="addressLine1">Address Line 1 *</Label>
                      <Input id="addressLine1" required maxLength={200} value={formData.addressLine1} onChange={(e) => setFormData((prev) => ({ ...prev, addressLine1: e.target.value }))} placeholder="123 Research Drive, Building A" className="bg-secondary/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                      <Input id="addressLine2" maxLength={200} value={formData.addressLine2} onChange={(e) => setFormData((prev) => ({ ...prev, addressLine2: e.target.value }))} placeholder="Suite 100, Room 205" className="bg-secondary/50" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" required maxLength={100} value={formData.city} onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))} placeholder="San Francisco" className="bg-secondary/50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State / Province *</Label>
                        <Input id="state" required maxLength={100} value={formData.state} onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))} placeholder="California" className="bg-secondary/50" />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP / Postal Code *</Label>
                        <Input id="zipCode" required maxLength={20} value={formData.zipCode} onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))} placeholder="94102" className="bg-secondary/50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Input id="country" required maxLength={100} value={formData.country} onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))} placeholder="United States" className="bg-secondary/50" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discount Code */}
                <div className="glass-card rounded-lg p-6">
                  <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-primary" />
                    Discount Code
                  </h2>
                  <div className="flex gap-2">
                    <Input
                      placeholder=""
                      value={discountCode}
                      onChange={(e) => {
                        setDiscountCode(e.target.value.toUpperCase());
                        if (discountValid !== null) {
                          setDiscountValid(null);
                          setDiscountReferrerId(null);
                          setPromoFreeShipping(false);
                          setDiscountMessage(null);
                        }
                      }}
                      className="bg-secondary/50 uppercase"
                      maxLength={30}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleApplyDiscount}
                      disabled={discountLoading || !discountCode.trim()}
                    >
                      {discountLoading ? "..." : "Apply"}
                    </Button>
                  </div>
                  {discountValid === true && (
                    <p className="text-xs text-primary mt-2 flex items-center gap-1">
                      <Sparkles size={10} /> 10% discount applied{promoFreeShipping ? " + FREE shipping" : ""} — you save {formatPrice(discountAmount + (promoFreeShipping && !qualifiesForFreeShipping ? FLAT_RATE_SHIPPING : 0))}
                    </p>
                  )}
                  {discountValid === false && (
                    <p className="text-xs text-destructive mt-2">{discountMessage || "Invalid or expired code. Please try again."}</p>
                  )}
                </div>

                {/* Credit Redemption — works for logged-in users AND guests via email lookup */}
                <CreditRedemption
                  profileId={profile?.id}
                  email={formData.email}
                  cartTotal={total}
                  pointsBalance={profile?.points_balance ?? 0}
                  isAuthenticated={!!profile?.id}
                  selectedCredit={selectedCredit}
                  onSelectCredit={setSelectedCredit}
                />


                {/* Additional Notes */}
                <div className="glass-card rounded-lg p-6">
                  <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-primary" />
                    Additional Notes
                  </h2>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Instructions (Optional)</Label>
                    <Textarea id="notes" maxLength={1000} value={formData.notes} onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Any special requirements, preferred shipping methods, or additional information..." className="bg-secondary/50 min-h-[80px]" />
                  </div>
                </div>

                {/* Final Confirmation */}
                <div className="glass-card rounded-lg p-6 border-l-4 border-l-primary">
                  <div className="flex items-start space-x-3">
                    <Checkbox id="finalConfirmation" checked={finalConfirmation} onCheckedChange={(checked) => setFinalConfirmation(checked === true)} className="mt-1" />
                    <Label htmlFor="finalConfirmation" className="cursor-pointer leading-relaxed">
                      <span className="font-medium text-foreground">Final Confirmation Required</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        I confirm that this order is for laboratory research use only and that I agree to the{" "}
                        <Link to="/terms" className="text-primary hover:underline">
                          Terms & Conditions
                        </Link>
                        . I understand that all products from Vertex Research Labs are not intended for human or veterinary use.
                      </p>
                    </Label>
                  </div>
                </div>

                {/* Continue to Payment OR Stripe Payment */}
                {!showPayment ? (
                  <Button type="submit" variant="hero" size="xl" className="w-full" disabled={!isFormValid || isSubmitting}>
                    <CreditCard size={18} />
                    {hasAutoship ? (isSubmitting ? "Redirecting…" : "Continue to Subscription Checkout") : (finalTotal === 0 ? "Complete Order" : "Continue to Payment")}
                  </Button>
                ) : finalTotal === 0 ? (
                  <div id="stripe-payment-section" className="glass-card rounded-lg p-6 border-l-4 border-l-primary">
                    <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-primary" />
                      Covered by Vertex Credit
                    </h2>
                    <p className="text-xs text-muted-foreground mb-4">
                      Your credit covers this order total. No card payment is required.
                    </p>
                    <Button type="button" variant="hero" size="xl" className="w-full" disabled={isSubmitting} onClick={handleCoveredByCredits}>
                      <CheckCircle2 size={18} />
                      {isSubmitting ? "Submitting…" : "Submit Order"}
                    </Button>
                    <button
                      type="button"
                      onClick={() => setShowPayment(false)}
                      className="text-xs text-muted-foreground hover:text-foreground mt-4 underline"
                    >
                      ← Edit order details
                    </button>
                  </div>
                ) : (
                  <div id="stripe-payment-section" className="glass-card rounded-lg p-6 border-l-4 border-l-primary">
                    <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                      <CreditCard size={20} className="text-primary" />
                      Payment — {formatPrice(finalTotal)}
                    </h2>
                    <p className="text-xs text-muted-foreground mb-4">
                      Secure payment powered by Stripe. Apple Pay, Google Pay, and all major cards accepted.
                    </p>
                    <StripePayment
                      amount={finalTotal}
                      email={formData.email}
                      metadata={{
                        customer_name: formData.fullName,
                        customer_email: formData.email,
                      }}
                      disabled={isSubmitting}
                      onSuccess={handleStripeSuccess}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPayment(false)}
                      className="text-xs text-muted-foreground hover:text-foreground mt-4 underline"
                    >
                      ← Edit order details
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-lg p-6 sticky top-28">
                <h2 className="text-lg font-medium text-foreground mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.is3Pack ? "3" : "1"}-${item.isAutoship ? "a" : "o"}`} className="flex justify-between items-start py-2 border-b border-border/30 last:border-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {item.product.name}
                          {item.isAutoship && <span className="ml-1.5 text-[10px] text-primary font-medium">· Autoship</span>}
                          {item.is3Pack && <span className="ml-1.5 text-[10px] text-primary font-medium">· 3-Pack</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.product.size} × {item.quantity}
                          {item.isAutoship && " · every 30d"}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-foreground">{formatPrice(computeUnitPrice(item) * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">US Shipping</span>
                    {qualifiesForFreeShipping || promoFreeShipping ? (
                      <span className="text-primary font-medium">FREE</span>
                    ) : (
                      <span className="text-foreground font-medium">{formatPrice(FLAT_RATE_SHIPPING)}</span>
                    )}
                  </div>
                  {!qualifiesForFreeShipping && !promoFreeShipping && <p className="text-xs text-muted-foreground">Free shipping on orders over ${FREE_SHIPPING_THRESHOLD}</p>}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-primary flex items-center gap-1">
                        <Sparkles size={12} />
                        Discount ({discountCode})
                      </span>
                      <span className="text-primary font-medium">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  {creditDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-primary flex items-center gap-1">
                        <Sparkles size={12} />
                        Vertex Credit
                      </span>
                      <span className="text-primary font-medium">-{formatPrice(creditDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base pt-2 border-t border-border/30">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="font-semibold text-foreground">{formatPrice(finalTotal)}</span>
                  </div>

                  {/* Points preview */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Sparkles size={10} className="text-primary" />
                      Points you'll earn
                    </span>
                    <span className="text-primary font-medium">+{pointsEarned} pts</span>
                  </div>
                </div>

                {/* Compliance Badge */}
                <div className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={16} className="text-primary" />
                    <span className="text-xs font-medium text-primary">Research Access Verified</span>
                  </div>
                  <p className="text-xs text-muted-foreground">All required acknowledgments have been completed.</p>
                </div>

                {/* Warning */}
                <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className="text-muted-foreground mt-0.5" />
                    <p className="text-xs text-muted-foreground">For laboratory research use only. Not for human or veterinary use.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
