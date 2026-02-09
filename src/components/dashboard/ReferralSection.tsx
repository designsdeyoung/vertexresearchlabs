import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Users, Check, Share2, MessageSquare, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReferralSectionProps {
  referralCode: string;
  profileId: string;
}

interface Referral {
  id: string;
  referred_email: string;
  status: string;
  points_awarded: number;
  created_at: string;
}

const ReferralSection = ({ referralCode, profileId }: ReferralSectionProps) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase
      .from("referrals")
      .select("*")
      .eq("referrer_id", profileId)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setReferrals(data as Referral[]);
      });
  }, [profileId]);

  const referralLink = `https://vertexresearchlabs.lovable.app?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: "Copied!", description: "Referral link copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareSMS = () => {
    const msg = encodeURIComponent(
      `Check out Vertex Research Labs — get $15 off your first order: ${referralLink}`
    );
    window.open(`sms:?body=${msg}`, "_blank");
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent("$15 off Vertex Research Labs");
    const body = encodeURIComponent(
      `Hey, I've been using Vertex Research Labs for research peptides and thought you'd be interested.\n\nUse my link to get $15 off your first order:\n${referralLink}\n\nThe link is tracked automatically — no code needed.`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const totalEarned = referrals.reduce((sum, r) => sum + r.points_awarded, 0);
  const pendingCount = referrals.filter((r) => r.status === "pending" || r.status === "signed_up").length;
  const completedCount = referrals.filter((r) => r.status === "completed").length;

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Share2 size={16} className="text-primary" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">Refer & Earn</span>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Share your code — your friend gets <span className="text-foreground font-medium">10% off</span>, you earn{" "}
        <span className="text-primary font-medium">3× points</span> on their order.
      </p>

      {/* Discount Code */}
      <div className="mb-3">
        <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider font-medium">Your discount code</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2.5 rounded-lg bg-primary/5 border border-primary/20 text-base text-foreground font-mono font-bold tracking-widest text-center">
            {referralCode}
          </div>
          <Button variant="outline" size="sm" onClick={() => {
            navigator.clipboard.writeText(referralCode);
            setCopied(true);
            toast({ title: "Copied!", description: "Discount code copied to clipboard." });
            setTimeout(() => setCopied(false), 2000);
          }} className="flex-shrink-0">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </Button>
        </div>
      </div>

      {/* Referral Link */}
      <div className="mb-3">
        <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider font-medium">Or share your link</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-xs text-muted-foreground truncate font-mono">
            {referralLink}
          </div>
          <Button variant="outline" size="sm" onClick={handleCopy} className="flex-shrink-0">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </Button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="flex gap-2 mb-2">
        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleShareSMS}>
          <MessageSquare size={13} />
          Share via SMS
        </Button>
        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleShareEmail}>
          <Mail size={13} />
          Share via Email
        </Button>
      </div>

      <p className="text-[10px] text-muted-foreground mb-5">
        Tracked automatically — your friends don't need a code.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-lg bg-secondary/30">
          <p className="text-lg font-semibold text-foreground">{referrals.length}</p>
          <p className="text-[10px] text-muted-foreground">Clicks</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-secondary/30">
          <p className="text-lg font-semibold text-foreground">{pendingCount}</p>
          <p className="text-[10px] text-muted-foreground">Pending</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-secondary/30">
          <p className="text-lg font-semibold text-primary">{totalEarned}</p>
          <p className="text-[10px] text-muted-foreground">Pts Earned</p>
        </div>
      </div>

      {referrals.length > 0 && (
        <div className="divide-y divide-border/50">
          {referrals.slice(0, 3).map((r) => (
            <div key={r.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs text-foreground">{r.referred_email}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{r.status}</p>
              </div>
              {r.points_awarded > 0 && (
                <span className="text-xs font-medium text-primary">+{r.points_awarded} pts</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReferralSection;
