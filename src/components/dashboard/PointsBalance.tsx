import { Sparkles, TrendingUp } from "lucide-react";
import { useRewards } from "@/hooks/useRewards";
import { motion } from "framer-motion";

interface PointsBalanceProps {
  balance: number;
  lifetime: number;
}

const PointsBalance = ({ balance, lifetime }: PointsBalanceProps) => {
  const { nextTier, pointsToNextTier, progressToNextTier } = useRewards(balance);

  return (
    <div className="glass-card rounded-xl p-6 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles size={16} className="text-primary" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">Points Balance</span>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-4xl font-bold text-foreground mb-1">
            {balance.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp size={12} />
            {lifetime.toLocaleString()} lifetime points
          </p>
        </motion.div>

        {nextTier && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">
                {pointsToNextTier} pts to {nextTier.label}
              </span>
              <span className="text-primary font-medium">
                {Math.round(progressToNextTier)}%
              </span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressToNextTier}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PointsBalance;
