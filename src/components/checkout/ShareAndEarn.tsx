import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Copy,
  Share2,
  MessageSquare,
  Mail,
  Check,
  Gift,
} from "lucide-react";

interface ShareAndEarnProps {
  referralCode: string;
}

const SITE_URL = "https://vertexresearchlabs.lovable.app";

const ShareAndEarn = ({ referralCode }: ShareAndEarnProps) => {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const shareUrl = `${SITE_URL}?ref=${referralCode}&discount=${referralCode}`;
  const shareMessage = `Use my code ${referralCode} for 10% off at Vertex Research Labs! ${shareUrl}`;

  const handleCopy = async (type: "code" | "link") => {
    const text = type === "code" ? referralCode : shareUrl;
    await navigator.clipboard.writeText(text);
    setCopied(type);
    toast({ title: "Copied!", description: type === "code" ? "Discount code copied" : "Share link copied" });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSMS = () => {
    const encoded = encodeURIComponent(shareMessage);
    window.open(`sms:?&body=${encoded}`, "_blank");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent("10% off Vertex Research Labs");
    const body = encodeURIComponent(shareMessage);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="glass-card rounded-xl p-6 mb-6 border-primary/20 relative overflow-hidden"
    >
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <Gift size={20} className="text-primary" />
          <h2 className="text-lg font-medium text-foreground">Share & Earn</h2>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Share your code with friends — they get <span className="text-primary font-medium">10% off</span>, you earn{" "}
          <span className="text-primary font-medium">3× points</span> on their order.
        </p>

        {/* Code badge */}
        <div className="flex items-center gap-3 mb-4">
          <Badge className="text-base px-4 py-1.5 font-mono tracking-wider bg-primary/10 text-primary border-primary/30">
            {referralCode}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy("code")}
            className="text-xs"
          >
            {copied === "code" ? <Check size={14} /> : <Copy size={14} />}
            {copied === "code" ? "Copied" : "Copy Code"}
          </Button>
        </div>

        {/* Shareable link */}
        <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 mb-4">
          <p className="text-xs text-muted-foreground mb-2">Your shareable link (auto-applies discount):</p>
          <div className="flex items-center gap-2">
            <code className="text-xs text-foreground break-all flex-1 font-mono">
              {shareUrl}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy("link")}
              className="flex-shrink-0"
            >
              {copied === "link" ? <Check size={14} /> : <Copy size={14} />}
            </Button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="flex gap-2">
          <Button variant="heroOutline" size="sm" onClick={handleSMS} className="flex-1">
            <MessageSquare size={14} />
            Share via SMS
          </Button>
          <Button variant="heroOutline" size="sm" onClick={handleEmail} className="flex-1">
            <Mail size={14} />
            Share via Email
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ShareAndEarn;
