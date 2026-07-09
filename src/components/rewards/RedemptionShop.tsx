import { motion } from "framer-motion";
import { REDEMPTION_REWARDS } from "@/data/rewardsProgram";
import RewardCoupon from "./RewardCoupon";

/** The redemption shop — a grid of claimable reward coupons. */
const RedemptionShop = () => {
  return (
    <section aria-label="Redemption shop" className="container mx-auto px-6">
      <div className="mb-10 text-center">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-deal">
          Redemption Shop
        </p>
        <h2 className="font-display text-3xl font-black tracking-tight text-navy md:text-4xl">
          Spend Points, Not Dollars
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-navy/60">
          Claim a coupon below and it's applied to your next qualifying order at
          checkout — the product ships free.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {REDEMPTION_REWARDS.map((reward, i) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: (i % 3) * 0.08, duration: 0.45, ease: "easeOut" }}
          >
            <RewardCoupon reward={reward} />
          </motion.div>
        ))}
      </div>

      <p className="mt-6 text-center text-[11px] text-navy/45">
        One claimed reward per order · Claimed coupons never expire while your
        account is active
      </p>
    </section>
  );
};

export default RedemptionShop;
