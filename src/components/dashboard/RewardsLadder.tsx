import { REWARD_TIERS } from "@/hooks/useRewards";
import { Gift, Lock, CheckCircle2 } from "lucide-react";

interface RewardsLadderProps {
  balance: number;
}

const RewardsLadder = ({ balance }: RewardsLadderProps) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Gift size={16} className="text-primary" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">Rewards Ladder</span>
      </div>

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
              {unlocked && (
                <span className="text-xs font-medium text-primary px-2 py-1 rounded-full bg-primary/10">
                  Unlocked
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground/60 mt-4">
        Credits cannot stack or be used on the same order earned. Expire after 12 months of inactivity.
      </p>
    </div>
  );
};

export default RewardsLadder;
