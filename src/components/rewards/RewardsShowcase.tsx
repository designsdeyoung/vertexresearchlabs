import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { REWARDS_TIERS } from "@/data/rewardsProgram";
import TierCard from "./TierCard";

const rise = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

/** Small sparkle + flying-points motif next to the program lockup. */
const SparkleMotif = () => (
  <svg
    viewBox="0 0 88 60"
    className="h-12 w-[70px] shrink-0"
    aria-hidden="true"
  >
    <path
      d="M6 50 Q 34 44 58 26"
      fill="none"
      stroke="hsl(var(--mint))"
      strokeWidth="1.5"
      strokeDasharray="2 5"
      strokeLinecap="round"
      opacity="0.8"
    />
    <path
      d="M64 20 l2.6 6.4 6.4 2.6 -6.4 2.6 -2.6 6.4 -2.6 -6.4 -6.4 -2.6 6.4 -2.6 z"
      fill="hsl(var(--mint))"
    />
    <path
      d="M78 6 l1.7 4.1 4.1 1.7 -4.1 1.7 -1.7 4.1 -1.7 -4.1 -4.1 -1.7 4.1 -1.7 z"
      fill="white"
      opacity="0.9"
    />
    <circle cx="30" cy="42" r="2" fill="white" opacity="0.55" />
    <circle cx="46" cy="33" r="1.5" fill="hsl(var(--mint))" opacity="0.7" />
  </svg>
);

/** Homepage loyalty banner — navy program card with a curved, mint-stroked
 *  right edge beside the three escalating tier cards. */
const RewardsShowcase = () => {
  return (
    <section aria-label="Vertex Rewards program" className="bg-cream py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
          {/* Program lockup card */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={rise}
            className="relative"
          >
            <div className="bg-navy-watermark relative flex h-full flex-col justify-center overflow-hidden rounded-card bg-navy px-8 py-12 shadow-boutique lg:rounded-r-[140px] lg:px-12 lg:pr-20">
              {/* Accent stroke tracing the curved edge */}
              <div
                className="pointer-events-none absolute inset-y-3 right-3 hidden w-[130px] rounded-r-[128px] border-r-2 border-mint/70 lg:block"
                aria-hidden="true"
              />

              <div className="flex items-start justify-between gap-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mint">
                  Loyalty Program
                </p>
                <SparkleMotif />
              </div>

              <h2 className="mt-2 font-display text-4xl font-black leading-[1.02] tracking-tight text-white md:text-5xl">
                Vertex{" "}
                <span className="font-accent font-normal italic tracking-normal text-mint">
                  Rewards
                </span>
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
                Earn 3X points on every $1 of research materials — then trade
                them for free products from the redemption shop. No forms, no
                fine print: your account starts earning with your first order.
              </p>

              <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-white/45">
                For research use only · Not for human consumption
              </p>
            </div>
          </motion.div>

          {/* Tier cards */}
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {REWARDS_TIERS.map((tier, i) => (
              <motion.div
                key={tier.id}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={rise}
              >
                <TierCard tier={tier} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          custom={4}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={rise}
          className="mt-10 flex justify-center"
        >
          <Link
            to="/rewards"
            className="inline-flex h-12 items-center justify-center rounded-full bg-navy px-10 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-navy-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            Learn More
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default RewardsShowcase;
