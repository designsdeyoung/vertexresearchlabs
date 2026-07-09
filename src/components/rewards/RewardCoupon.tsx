import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, FlaskConical } from "lucide-react";
import type { RedemptionReward } from "@/data/rewardsProgram";
import { spendToEarn } from "@/data/rewardsProgram";
import { useRewardsShop } from "@/contexts/RewardsShopContext";
import { productGradient } from "@/lib/productVisuals";

const formatPrice = (p: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p);

const ROLL_MS = 700;

/** Brief, tasteful sparkle burst rendered once when a claim lands. */
const SparkleBurst = () => {
  const particles = [
    { x: -46, y: -38, c: "hsl(var(--deal))", s: 5 },
    { x: 42, y: -46, c: "hsl(var(--mint))", s: 4 },
    { x: -58, y: 6, c: "hsl(var(--tier-blue))", s: 4 },
    { x: 56, y: -6, c: "hsl(var(--deal))", s: 3 },
    { x: -28, y: -56, c: "hsl(var(--mint))", s: 3 },
    { x: 24, y: -60, c: "hsl(var(--tier-blue))", s: 5 },
    { x: -14, y: 40, c: "hsl(var(--mint))", s: 4 },
    { x: 34, y: 34, c: "hsl(var(--deal))", s: 4 },
    { x: 62, y: 22, c: "hsl(var(--mint))", s: 3 },
    { x: -50, y: 34, c: "hsl(var(--deal))", s: 3 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center" aria-hidden="true">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.4 }}
          animate={{ opacity: 0, x: p.x, y: p.y, scale: 1 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: i * 0.015 }}
          style={{ width: p.s, height: p.s, backgroundColor: p.c }}
          className="absolute rounded-full"
        />
      ))}
    </div>
  );
};

interface RewardCouponProps {
  reward: RedemptionReward;
}

/** Redemption coupon. Click Redeem → the price rolls down to $0.00, the card
 *  transforms into a claimed coupon (dashed border + ribbon), and a brief
 *  sparkle burst fires. Claims persist via RewardsShopContext. */
const RewardCoupon = ({ reward }: RewardCouponProps) => {
  const { balance, isClaimed, redeem } = useRewardsShop();
  const reduced = useReducedMotion();
  const claimed = isClaimed(reward.id);

  const { product, points } = reward;
  const affordable = balance >= points;
  const pointsToGo = Math.max(0, points - balance);
  const progress = Math.min((balance / points) * 100, 100);

  const [rollingPrice, setRollingPrice] = useState<number | null>(null);
  const [showBurst, setShowBurst] = useState(false);
  const rafRef = useRef<number>();

  useEffect(() => () => cancelAnimationFrame(rafRef.current ?? 0), []);

  const handleRedeem = () => {
    if (claimed || !affordable) return;
    if (reduced) {
      redeem(reward.id);
      return;
    }
    // Roll the price down to zero, then commit the claim + burst.
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / ROLL_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setRollingPrice(product.price * (1 - eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        redeem(reward.id);
        setRollingPrice(null);
        setShowBurst(true);
        setTimeout(() => setShowBurst(false), 900);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const rolling = rollingPrice !== null;

  return (
    <motion.article
      animate={reduced ? undefined : { scale: showBurst ? [1, 1.015, 1] : 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative flex h-full flex-col overflow-hidden rounded-card bg-white transition-all duration-200 ease-out ${
        claimed
          ? "border-2 border-dashed border-deal/70 shadow-none"
          : "border border-navy/5 shadow-boutique hover:-translate-y-1 hover:shadow-boutique-lift"
      }`}
    >
      {showBurst && <SparkleBurst />}

      {/* Claimed ribbon */}
      <AnimatePresence>
        {claimed && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-x-0 top-0 z-10 flex items-center justify-center gap-1.5 bg-deal py-1.5 text-white"
          >
            <BadgeCheck size={13} />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]">
              Reward claimed — eligible at checkout
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image zone */}
      <div
        className="relative flex h-36 items-center justify-center overflow-hidden"
        style={{ background: productGradient(product.category) }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={`${product.name} ${product.size} research material`}
            loading="lazy"
            className={`h-full w-full scale-[1.45] object-contain transition-opacity duration-200 ${claimed ? "opacity-80" : ""}`}
          />
        ) : (
          <FlaskConical size={36} className="text-navy/25" />
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-navy/45">
          by Vertex Research Labs
        </p>
        <h3 className="font-display text-base font-bold tracking-tight text-navy">
          {product.name}{" "}
          <span className="font-sans text-xs font-medium text-navy/50">{product.size}</span>
        </h3>

        {/* Price + free badge */}
        <div className="flex flex-wrap items-center gap-2">
          {rolling ? (
            <span className="font-display text-xl font-black tabular-nums tracking-tight text-navy">
              {formatPrice(Math.max(rollingPrice, 0))}
            </span>
          ) : (
            <span
              className={`font-display text-xl font-black tabular-nums tracking-tight ${
                claimed ? "text-navy/35 line-through decoration-deal/80 decoration-2" : "text-navy/40 line-through decoration-navy/40"
              }`}
            >
              {claimed ? formatPrice(0) : formatPrice(product.price)}
            </span>
          )}
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
              claimed ? "bg-tiergreen text-white" : "bg-tiergreen/10 text-tiergreen"
            }`}
          >
            Free with {points.toLocaleString()} pts
          </span>
        </div>

        <p className="text-[11px] text-navy/50">
          {points.toLocaleString()} points ≈ {formatPrice(spendToEarn(points))} in
          qualifying research orders
        </p>

        {/* Action */}
        <div className="mt-auto pt-2">
          {claimed ? (
            <div className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full border border-tiergreen/30 bg-tiergreen/10 text-[13px] font-semibold text-tiergreen">
              <BadgeCheck size={15} />
              Applied at checkout
            </div>
          ) : affordable ? (
            <button
              type="button"
              onClick={handleRedeem}
              disabled={rolling}
              className="h-11 w-full rounded-full bg-navy text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-navy-soft disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
            >
              {rolling ? "Redeeming…" : `Redeem · ${points.toLocaleString()} pts`}
            </button>
          ) : (
            <div>
              <div className="flex h-11 w-full items-center justify-center rounded-full border border-navy/15 bg-navy/[0.04] text-[13px] font-semibold text-navy/55">
                {pointsToGo.toLocaleString()} points to go
              </div>
              <div
                className="mt-2 h-1 w-full overflow-hidden rounded-full bg-navy/10"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${Math.round(progress)}% of the points needed for ${product.name}`}
              >
                <div
                  className="h-full rounded-full bg-tierblue transition-[width] duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default RewardCoupon;
