import { useState } from "react";
import { Bitcoin, Copy, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const BTC_ADDRESS = "3J9SVQBVXCVVCC6SQrjfEZ43jXuT3BeG39";

const BitcoinReminder = ({ total }: { total: number }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(BTC_ADDRESS);
    setCopied(true);
    toast({ title: "BTC address copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="glass-card rounded-xl p-6 mb-6 border-[#f7931a]/30 bg-[#f7931a]/5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Bitcoin size={20} className="text-[#f7931a]" />
        <h2 className="text-lg font-medium text-foreground">Bitcoin Payment Required</h2>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Please send the equivalent of{" "}
        <span className="text-foreground font-semibold">
          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total)}
        </span>{" "}
        in BTC to the address below. Your order will ship once payment is confirmed on-chain.
      </p>

      <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
        <code className="text-xs font-mono text-foreground flex-1 break-all">{BTC_ADDRESS}</code>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleCopy}>
          {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
        </Button>
      </div>

      <div className="flex items-start gap-2 mt-3">
        <AlertTriangle size={14} className="text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          Use the current BTC/USD exchange rate at the time of sending. Include sufficient network fees for timely confirmation.
        </p>
      </div>
    </motion.div>
  );
};

export default BitcoinReminder;
