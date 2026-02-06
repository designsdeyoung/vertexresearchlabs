import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Users, Check, Share2 } from "lucide-react";
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

  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: "Copied!", description: "Referral link copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const totalEarned = referrals.reduce((sum, r) => sum + r.points_awarded, 0);
  const pendingCount = referrals.filter((r) => r.status === "pending" || r.status === "signed_up").length;

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Share2 size={16} className="text-primary" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">Refer & Earn</span>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Share your link — your friend gets <span className="text-foreground font-medium">$15 off</span>, you earn{" "}
        <span className="text-primary font-medium">750 points</span>.
      </p>

      {/* Referral Link */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-xs text-muted-foreground truncate font-mono">
          {referralLink}
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy} className="flex-shrink-0">
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-lg bg-secondary/30">
          <p className="text-lg font-semibold text-foreground">{referrals.length}</p>
          <p className="text-[10px] text-muted-foreground">Referrals</p>
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
