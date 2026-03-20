import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Bitcoin, Copy, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const BTC_ADDRESS = "3J9SVQBVXCVVCC6SQrjfEZ43jXuT3BeG39";

interface BitcoinPaymentProps {
  paymentMethod: "standard" | "bitcoin";
  onPaymentMethodChange: (method: "standard" | "bitcoin") => void;
  total: number;
}

const BitcoinPayment = ({ paymentMethod, onPaymentMethodChange, total }: BitcoinPaymentProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(BTC_ADDRESS);
    setCopied(true);
    toast({ title: "BTC address copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-lg p-6">
      <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
        <CreditCard size={20} className="text-primary" />
        Payment Method
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          type="button"
          onClick={() => onPaymentMethodChange("standard")}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            paymentMethod === "standard"
              ? "border-primary bg-primary/10"
              : "border-border/50 bg-secondary/30 hover:border-border"
          }`}
        >
          <CreditCard size={20} className={paymentMethod === "standard" ? "text-primary" : "text-muted-foreground"} />
          <p className="text-sm font-medium text-foreground mt-2">Card / Invoice</p>
          <p className="text-xs text-muted-foreground">Pay after review</p>
        </button>

        <button
          type="button"
          onClick={() => onPaymentMethodChange("bitcoin")}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            paymentMethod === "bitcoin"
              ? "border-primary bg-primary/10"
              : "border-border/50 bg-secondary/30 hover:border-border"
          }`}
        >
          <Bitcoin size={20} className={paymentMethod === "bitcoin" ? "text-primary" : "text-muted-foreground"} />
          <p className="text-sm font-medium text-foreground mt-2">Bitcoin</p>
          <p className="text-xs text-muted-foreground">Send BTC directly</p>
        </button>
      </div>

      {paymentMethod === "bitcoin" && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-5 space-y-4">
          <div className="flex justify-center">
            <div className="bg-white p-3 rounded-xl">
              <QRCodeSVG value={`bitcoin:${BTC_ADDRESS}`} size={160} />
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Send BTC to this address</p>
            <div className="flex items-center gap-2 justify-center">
              <code className="text-xs font-mono text-foreground bg-secondary/50 px-3 py-1.5 rounded break-all">
                {BTC_ADDRESS}
              </code>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleCopy}>
                {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
              </Button>
            </div>
          </div>

          <div className="text-center p-3 rounded-lg bg-secondary/30 border border-border/50">
            <p className="text-sm text-muted-foreground">
              Send the USD equivalent of your{" "}
              <span className="text-foreground font-semibold">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total)}
              </span>{" "}
              total in BTC.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Your order ships once payment is confirmed on-chain.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BitcoinPayment;
