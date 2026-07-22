import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  FlaskConical,
  Fingerprint,
  FileCheck,
  ShieldAlert,
} from "lucide-react";
import ghkCuCoa from "@/assets/coa/ghk-cu-coa.jpg";
import retatrutideCoa from "@/assets/coa/retatrutide-coa.jpg";

const features = [
  {
    icon: FlaskConical,
    title: "Purity Testing",
    sub: "HPLC & LC-MS verification",
  },
  {
    icon: Fingerprint,
    title: "Identity Confirmed",
    sub: "Peptide sequence validation",
  },
  {
    icon: FileCheck,
    title: "Independently Verified",
    sub: "COA available on request",
  },
  {
    icon: ShieldAlert,
    title: "Research-Only Standards",
    sub: "For laboratory research use only",
  },
];

const coas = [
  { name: "GHK-Cu", size: "50mg", image: ghkCuCoa, productId: "ghk-cu" },
  { name: "RP-300", size: "10mg", image: retatrutideCoa, productId: "retatrutide" },
];

const QualityTransparency = () => {
  return (
    <section
      id="quality"
      aria-label="Quality and transparency"
      className="relative overflow-hidden border-y border-border/60 bg-gradient-to-b from-background via-secondary/30 to-background py-20 md:py-28"
    >
      <div className="pointer-events-none absolute left-0 top-1/4 h-[400px] w-[500px] rounded-full bg-primary/8 blur-[130px]" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[350px] w-[450px] rounded-full bg-accent/8 blur-[130px]" aria-hidden />

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — copy + feature bullets */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
              Verified · Documented · Trusted
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
              Quality & Transparency
            </h2>
            <p className="mt-4 max-w-[460px] text-base leading-relaxed text-muted-foreground">
              Our reference materials are tested by independent laboratories to
              ensure purity, identity, and consistency. Certificates of Analysis
              are available on request where applicable.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                    <Icon size={16} className="text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">
                      {title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/quality"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Explore our quality standards
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {/* Right — latest COAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="glass-panel p-6 md:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Latest Certificates of Analysis
                </h3>
                <Link
                  to="/quality/testing"
                  className="group inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                  View all COAs
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {coas.map((coa) => (
                  <div
                    key={coa.name}
                    className="group overflow-hidden rounded-xl border border-border/70 bg-background/50 transition-colors hover:border-primary/40"
                  >
                    <Link
                      to={`/product/${coa.productId}`}
                      aria-label={`View ${coa.name} product and COA`}
                      className="block"
                    >
                      <div className="relative h-32 overflow-hidden border-b border-border/50 bg-white/95">
                        <img
                          src={coa.image}
                          alt={`${coa.name} Certificate of Analysis preview`}
                          loading="lazy"
                          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.04]"
                        />
                      </div>
                    </Link>
                    <div className="flex items-center justify-between gap-2 p-3">
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm font-semibold text-foreground">
                          {coa.name}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {coa.size} · HPLC verified
                        </p>
                      </div>
                      <a
                        href={coa.image}
                        download={`${coa.name.toLowerCase()}-coa.jpg`}
                        aria-label={`Download ${coa.name} COA`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                      >
                        <Download size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-5 border-t border-border/50 pt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Independent ISO-accredited laboratory testing · HPLC-MS
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QualityTransparency;
