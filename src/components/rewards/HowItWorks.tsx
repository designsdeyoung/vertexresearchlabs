import { motion, useReducedMotion } from "framer-motion";
import { ShoppingCart, Sparkles, Gift } from "lucide-react";

const STEPS = [
  {
    icon: ShoppingCart,
    title: "Shop",
    desc: "Order research-grade materials — every dollar counts automatically.",
  },
  {
    icon: Sparkles,
    title: "Earn 3X Points",
    desc: "3 points land in your account for every $1 spent, on every order.",
  },
  {
    icon: Gift,
    title: "Redeem for Credit",
    desc: "Turn points into store credit — up to $250 off, applied at checkout.",
  },
];

/** Three numbered steps joined by a dashed line that draws in on scroll.
 *  The dashed path is revealed by a solid path animating inside an SVG mask. */
const HowItWorks = () => {
  const reduced = useReducedMotion();

  return (
    <section aria-label="How Vertex Rewards works" className="container mx-auto px-6">
      <div className="relative mx-auto max-w-4xl">
        {/* Connecting line (desktop) */}
        <svg
          viewBox="0 0 800 24"
          preserveAspectRatio="none"
          className="absolute left-[16.6%] right-[16.6%] top-7 hidden h-6 w-[66.8%] md:block"
          aria-hidden="true"
        >
          <defs>
            <mask id="hiw-draw">
              <motion.path
                d="M 0 12 H 800"
                stroke="white"
                strokeWidth="24"
                fill="none"
                initial={{ pathLength: reduced ? 1 : 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
              />
            </mask>
          </defs>
          <path
            d="M 0 12 H 800"
            stroke="hsl(var(--navy) / 0.35)"
            strokeWidth="2"
            strokeDasharray="2 10"
            strokeLinecap="round"
            fill="none"
            mask="url(#hiw-draw)"
          />
        </svg>

        <div className="grid gap-10 md:grid-cols-3 md:gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: "easeOut" }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-boutique">
                <step.icon size={22} strokeWidth={1.75} />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-deal font-mono text-[10px] font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-navy">
                {step.title}
              </h3>
              <p className="mt-1.5 max-w-[240px] text-sm leading-relaxed text-navy/65">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
