import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { RewardsShopProvider } from "@/contexts/RewardsShopContext";
import { REWARDS_TIERS } from "@/data/rewardsProgram";
import { useCountUp } from "@/hooks/useCountUp";
import TierCard from "@/components/rewards/TierCard";
import HowItWorks from "@/components/rewards/HowItWorks";
import RedemptionShop from "@/components/rewards/RedemptionShop";
import PointsChip from "@/components/rewards/PointsChip";
import RewardsFaq from "@/components/rewards/RewardsFaq";
import {
  AUTOSHIP_POINTS_PER_DOLLAR,
  REFERRAL_POINTS_MULTIPLIER,
} from "@/hooks/useRewards";

const rise = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

/** Hero multiplier that ticks up on load. */
const Multiplier = () => {
  const value = useCountUp(3, { duration: 900, startFrom: 0 });
  return (
    <span className="font-display font-black tabular-nums text-deal">
      {value}X
    </span>
  );
};

const Rewards = () => {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <SEOHead
        title="Vertex Rewards — Earn 3X Points on Research Materials"
        description="Earn 3X points on every $1 of research-grade materials and redeem them for free products. For laboratory research use only."
        canonical="/rewards"
      />
      <Header />

      <RewardsShopProvider>
        <PointsChip />

        <main className="flex-1 pb-24 pt-16 md:pt-20">
          {/* Hero */}
          <section className="container mx-auto mb-20 px-6 text-center md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-navy/50">
                Vertex Rewards · Loyalty Program
              </p>
              <h1 className="mx-auto max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight text-navy md:text-6xl">
                Get Rewarded{" "}
                <span className="font-accent font-normal italic tracking-normal">
                  for Loyalty
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-navy/65 md:text-lg">
                Earn <Multiplier /> points for every $1 spent on research
                materials — then trade them for free research products in the
                redemption shop.
              </p>
              <a
                href="#redemption-shop"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-navy px-10 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-navy-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                Browse the Redemption Shop
              </a>
              <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-navy/40">
                For research use only · Not for human consumption
              </p>
            </motion.div>
          </section>

          {/* How it works */}
          <div className="mb-20 md:mb-28">
            <HowItWorks />
          </div>

          {/* Tier showcase */}
          <section aria-label="Membership tiers" className="container mx-auto mb-20 px-6 md:mb-28">
            <div className="mb-10 text-center">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-navy/50">
                Membership Tiers
              </p>
              <h2 className="font-display text-3xl font-black tracking-tight text-navy md:text-4xl">
                Everyone Earns 3X. Tiers Unlock More.
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-navy/60">
                The base rate never changes — higher tiers add bonus-point
                events, early access, and exclusive redemptions.
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
              {REWARDS_TIERS.map((tier, i) => (
                <motion.div
                  key={tier.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={rise}
                >
                  <TierCard tier={tier} size="large" />
                </motion.div>
              ))}
            </div>

            {/* Earn faster strip */}
            <div className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-3">
              {[
                `Autoship orders earn ${AUTOSHIP_POINTS_PER_DOLLAR} pts per $1`,
                `Referrals earn ${REFERRAL_POINTS_MULTIPLIER}X points on your colleague's first order`,
              ].map((line) => (
                <span
                  key={line}
                  className="rounded-full border border-navy/10 bg-white px-4 py-2 text-xs font-medium text-navy/70 shadow-boutique"
                >
                  {line}
                </span>
              ))}
            </div>
          </section>

          {/* Redemption shop */}
          <div id="redemption-shop" className="mb-20 scroll-mt-28 md:mb-28">
            <RedemptionShop />
          </div>

          {/* FAQ */}
          <RewardsFaq />
        </main>
      </RewardsShopProvider>

      <Footer />
    </div>
  );
};

export default Rewards;
