import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Stripe publishable key — safe to expose
const STRIPE_PUBLISHABLE_KEY =
  "pk_live_51Sq34bC1sO3DYmPXdFqAIIBaPTK9NYgPs9Ss339B5XEEzS7NQpg12F1nAr8ksKnJ6o0sKjh7LpTl73s78jhTP5jj00pjJnAdrZ";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface StripePaymentProps {
  amount: number;
  email: string;
  metadata?: Record<string, string | number | boolean | null>;
  disabled?: boolean;
  onSuccess: (paymentIntentId: string) => void | Promise<void>;
}

const PaymentForm = ({
  disabled,
  onSuccess,
  amount,
}: {
  disabled?: boolean;
  amount: number;
  onSuccess: (paymentIntentId: string) => void | Promise<void>;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      toast({
        title: "Payment error",
        description: submitError.message || "Please check your details.",
        variant: "destructive",
      });
      setProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
    });

    if (error) {
      toast({
        title: "Payment failed",
        description: error.message || "Card was declined.",
        variant: "destructive",
      });
      setProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      await onSuccess(paymentIntent.id);
    } else {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <PaymentElement options={{ layout: "tabs" }} />
      <Button
        type="button"
        variant="hero"
        size="xl"
        className="w-full"
        disabled={!stripe || processing || disabled}
        onClick={handlePay}
      >
        {processing ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Processing…
          </>
        ) : (
          <>
            <CreditCard size={18} /> Pay $
            {amount.toFixed(2)}
          </>
        )}
      </Button>
    </div>
  );
};

const StripePayment = ({ amount, email, metadata, disabled, onSuccess }: StripePaymentProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchIntent = async () => {
      if (amount < 0.5) return;
      setLoading(true);
      setError(null);
      try {
        const { data, error: fnErr } = await supabase.functions.invoke("create-payment-intent", {
          body: { amount, email, metadata },
        });
        if (fnErr || !data?.clientSecret) {
          throw new Error(fnErr?.message || data?.error || "Failed to initialize payment");
        }
        if (!cancelled) setClientSecret(data.clientSecret);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to initialize payment");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchIntent();
    return () => {
      cancelled = true;
    };
    // Re-create the intent when the amount changes meaningfully
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  if (loading || !clientSecret) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
        <Loader2 size={16} className="animate-spin mr-2" />
        {error ? error : "Preparing secure payment…"}
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "hsl(var(--primary))",
            colorBackground: "hsl(var(--secondary))",
            colorText: "hsl(var(--foreground))",
            borderRadius: "8px",
            fontFamily: "system-ui, sans-serif",
          },
        },
      }}
    >
      <PaymentForm amount={amount} disabled={disabled} onSuccess={onSuccess} />
    </Elements>
  );
};

export default StripePayment;
