import { Sparkles } from "lucide-react";
import { useRewardsShop } from "@/contexts/RewardsShopContext";
import { useCountUp } from "@/hooks/useCountUp";

/** Sticky, header-adjacent point-balance chip. The number counts smoothly
 *  toward the live balance whenever a redemption changes it. */
const PointsChip = () => {
  const { balance } = useRewardsShop();
  const displayed = useCountUp(balance, { duration: 800 });

  return (
    <div className="pointer-events-none sticky top-[84px] z-40 -mb-10 flex justify-end px-6">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-navy py-2 pl-3 pr-4 text-white shadow-boutique-lift">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint/20">
          <Sparkles size={13} className="text-mint" />
        </span>
        <span className="font-display text-sm font-bold tabular-nums tracking-tight">
          {displayed.toLocaleString()}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">
          pts
        </span>
      </div>
    </div>
  );
};

export default PointsChip;
