import { motion } from "framer-motion";
import { REWARD_TIERS } from "@/hooks/useRewards";

/** Store-credit redemption ladder — the real, working redemption mechanic.
 *  Mirrors REWARD_TIERS exactly, so it stays congruent with the packing
 *  slips, the points-login emails, and the checkout CreditRedemption panel. */
const CreditLadder = () => {
  return (
    <section
      aria-label="Redeem points for store credit"
      className="container mx-auto px-6"
    >
      <div className="mb-10 text-center">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-deal">
          Redeem Your Points
        </p>
        <h2 className="font-display text-3xl font-black tracking-tight text-navy md:text-4xl">
          Turn Points Into{" "}
          <span className="font-accent font-normal italic tracking-normal">
            Store Credit
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-navy/60">
          Redeem at checkout or from your dashboard — pick a tier and it comes
          straight off your order. Points never expire.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
        {REWARD_TIERS.map((tier, i) => (
          <motion.div
            key={tier.points}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: (i % 4) * 0.06, duration: 0.4, ease: "easeOut" }}
            className="flex h-full flex-col items-center rounded-card border border-navy/5 bg-white p-5 text-center shadow-boutique transition-shadow hover:shadow-boutique-lift"
          >
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-navy/45">
              {tier.points.toLocaleString()} pts
            </span>
            <span className="mt-2 font-display text-4xl font-black leading-none tracking-tight text-deal">
              ${tier.credit}
            </span>
            <span className="mt-1 font-display text-xs font-bold uppercase tracking-[0.12em] text-navy/70">
              off
            </span>
            <span className="mt-3 w-full border-t border-navy/5 pt-2 text-[11px] text-navy/50">
              min. order ${tier.minCart}
            </span>
          </motion.div>
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-xl text-center text-[11px] leading-relaxed text-navy/45">
        Earn 3 points per $1 spent — every 250 points is $10 off, up to $250 off
        at 5,000 points. One credit per order, and it stacks with a discount code.
      </p>
    </section>
  );
};

export default CreditLadder;
