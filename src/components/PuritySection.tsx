import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, FileCheck, ShieldCheck, FlaskConical } from "lucide-react";
import PurityDial from "./PurityDial";
import ScientificMeters from "./ScientificMeters";

const trustChips = [
  { icon: FlaskConical, label: "HPLC-MS Tested" },
  { icon: ShieldCheck, label: "ISO 17025 Labs" },
  { icon: FileCheck, label: "Lot-Specific COA" },
];

const PuritySection = () => {
  return (
    <section
      id="purity"
      aria-label="Purity and laboratory verification"
      className="relative overflow-hidden border-y border-border/60 bg-gradient-to-b from-background via-secondary/20 to-background py-20 md:py-28"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-[120px]" />

      <div className="container relative z-10 mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
            Verified Purity · Every Lot
          </span>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground md:text-4xl lg:text-5xl">
            Independently tested.
            <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Documented to the decimal.
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Every batch is verified by third-party laboratories using HPLC-MS, with a
            lot-specific Certificate of Analysis available before you order.
          </p>
        </motion.div>

        {/* Stat panel */}
        <div className="glass-card relative rounded-2xl border border-border/50 p-6 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-5 lg:gap-12">
            {/* Purity Dial */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center lg:col-span-2"
            >
              <PurityDial value={99.62} label="HPLC Purity" size="lg" />
              <div className="mt-4 text-center">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Reference Lot
                </div>
                <div className="font-mono text-xs text-foreground/80">
                  CGM-003 · Verified
                </div>
              </div>
            </motion.div>

            {/* Meters */}
            <div className="lg:col-span-3">
              <ScientificMeters />
            </div>
          </div>

          {/* Trust chips + CTA */}
          <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-border/50 pt-8 md:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              {trustChips.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1.5"
                >
                  <Icon size={12} className="text-primary" />
                  <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-foreground/80">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/quality/testing"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20"
            >
              View Certificates of Analysis
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PuritySection;
