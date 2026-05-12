import { useEffect, useState } from "react";
import { REWARD_TIERS } from "@/hooks/useRewards";
import { Gift, Lock, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface RewardsLadderProps {
  balance: number;
  profileId?: string;
  onRedeemed?: () => Promise<void> | void;
}

interface ActiveCredit {
  id: string;
  amount: number;
  expires_at: string;
}

const RewardsLadder = ({ balance, profileId }: RewardsLadderProps) => {
  const [activeCredit, setActiveCredit] = useState<ActiveCredit | null>(null);

  useEffect(() => {
    if (!profileId) {
      setActiveCredit(null);
      return;
    }

    supabase
      .from("credits")
      .select("id, amount, expires_at")
      .eq("profile_id", profileId)
      .eq("status", "active")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setActiveCredit((data as ActiveCredit | null) ?? null);
      });
  }, [profileId]);

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Gift size={16} className="text-primary" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">Rewards Ladder</span>
      </div>

      {activeCredit ? (
        <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <p className="text-sm font-medium text-foreground">${activeCredit.amount} credit ready at checkout</p>
          <p className="text-xs text-muted-foreground">Apply it on your next order before it expires.</p>
        </div>
      ) : null}

      <div className="space-y-3">
        {REWARD_TIERS.map((tier) => {
          const unlocked = balance >= tier.points;
          return (
            <div
              key={tier.points}
              className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                unlocked
                  ? "border-primary/30 bg-primary/5"
                  : "border-border/50 bg-secondary/20 opacity-70"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  unlocked ? "bg-primary/20" : "bg-secondary"
                }`}
              >
                {unlocked ? (
                  <CheckCircle2 size={18} className="text-primary" />
                ) : (
                  <Lock size={14} className="text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                  {tier.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tier.points.toLocaleString()} pts • Min cart ${tier.minCart}
                </p>
              </div>
              {unlocked ? (
                <span className="shrink-0 text-[11px] font-medium text-primary uppercase tracking-wider">
                  Unlocked
                </span>
              ) : (
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {(tier.points - balance).toLocaleString()} pts to go
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-muted-foreground/70 mt-4 text-center">
        Redeem your unlocked rewards at checkout — pick the credit that fits your cart.
      </p>
    </div>
  );
};

export default RewardsLadder;
