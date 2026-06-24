import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, FileCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import bpcVial from "@/assets/showcase/bpc-157-png.png";
import ghkVial from "@/assets/showcase/ghk-cu-png.png";
import tb500Vial from "@/assets/showcase/tb-500-png.png";
import semaxVial from "@/assets/showcase/semax-png.png";
import nadVial from "@/assets/showcase/nad-plus-png.png";

/* Vial lineup, center-out. Center vial is tallest; flanks step down.
 * The showcase PNGs are square with ~62% transparent side padding, so each
 * image gets an explicit box at the vial's real aspect (~0.45) and
 * `object-cover` crops the dead space — keeping the row tightly clustered. */
const vials = [
  { src: ghkVial, alt: "GHK-Cu research vial", box: "hidden sm:block h-[155px] w-[70px] md:h-[190px] md:w-[86px]", z: "", delay: 0.35, float: "animate-float-sm" },
  { src: tb500Vial, alt: "TB-500 research vial", box: "h-[200px] w-[90px] md:h-[250px] md:w-[112px]", z: "", delay: 0.25, float: "animate-float" },
  { src: bpcVial, alt: "BPC-157 research vial", box: "h-[265px] w-[119px] md:h-[330px] md:w-[148px]", z: "z-10", delay: 0.15, float: "animate-float" },
  { src: semaxVial, alt: "Semax research vial", box: "h-[200px] w-[90px] md:h-[250px] md:w-[112px]", z: "", delay: 0.3, float: "animate-float-sm" },
  { src: nadVial, alt: "NAD+ research vial", box: "hidden sm:block h-[155px] w-[70px] md:h-[190px] md:w-[86px]", z: "", delay: 0.4, float: "animate-float" },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-molecule" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 500px at 75% 30%, hsl(217 91% 60% / 0.10), transparent 60%), radial-gradient(700px 450px at 15% 75%, hsl(172 66% 50% / 0.08), transparent 60%), linear-gradient(180deg, transparent 60%, hsl(215 33% 6%) 100%)",
        }}
        aria-hidden
      />

      <div className="container relative z-10 mx-auto px-6 pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-[560px]"
          >
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-glow-pulse" aria-hidden />
              Research-Grade Reference Materials
            </p>

            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-5xl xl:text-[3.4rem]">
              Research-Grade Peptides. Built on{" "}
              <span className="bg-gradient-to-r from-primary via-cyan-400 to-accent bg-clip-text text-transparent">
                Purity, Precision, and Transparency.
              </span>
            </h1>

            <p className="mt-5 max-w-[480px] text-base leading-relaxed text-muted-foreground md:text-lg">
              Ultra-high purity reference materials, verified batch
              documentation, and strict quality standards for researchers who
              demand certainty.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 min-w-[180px] bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40"
              >
                <a href="#products">
                  Shop Peptides
                  <ArrowRight size={16} />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 min-w-[180px] border-border bg-card/40 text-foreground backdrop-blur-sm hover:border-primary/40 hover:bg-card"
              >
                <Link to="/quality/testing">
                  <FileText size={16} />
                  View COAs
                </Link>
              </Button>
            </div>

            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
              Research use only · Not for human consumption
            </p>
          </motion.div>

          {/* Vial composition */}
          <div className="relative mx-auto flex h-[330px] w-full max-w-[560px] items-end justify-center md:h-[480px]">
            {/* Back glow */}
            <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[110px] animate-glow-pulse md:h-[420px] md:w-[420px]" aria-hidden />

            {/* Vials */}
            <div className="relative z-10 flex items-end justify-center gap-1.5 pb-14 md:gap-2 md:pb-16">
              {vials.map((v) => (
                <motion.img
                  key={v.alt}
                  src={v.src}
                  alt={v.alt}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: v.delay, ease: "easeOut" }}
                  className={`${v.box} ${v.z} ${v.float} relative shrink-0 object-cover`}
                  style={{
                    filter:
                      "drop-shadow(0 24px 32px rgba(0,0,0,0.65)) drop-shadow(0 0 50px hsl(172 66% 50% / 0.12))",
                  }}
                />
              ))}
            </div>

            {/* Platform */}
            <div className="absolute inset-x-6 bottom-8 h-20 md:inset-x-10" aria-hidden>
              <div
                className="absolute inset-0 rounded-[100%]"
                style={{
                  background:
                    "radial-gradient(ellipse at center, hsl(172 66% 50% / 0.28) 0%, hsl(217 91% 60% / 0.10) 45%, transparent 70%)",
                }}
              />
              <div className="absolute inset-x-[12%] top-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="absolute inset-x-[24%] top-[calc(50%+10px)] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            </div>

            {/* Floating trust chips */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="glass-panel absolute -right-2 top-6 hidden items-center gap-2 rounded-full px-3.5 py-2 sm:flex md:right-0"
            >
              <BadgeCheck size={14} className="shrink-0 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/90">
                ≥99% Purity · HPLC-MS
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="glass-panel absolute -left-2 bottom-2 z-20 hidden items-center gap-2 rounded-full px-3.5 py-2 sm:flex md:left-4"
            >
              <FileCheck size={14} className="shrink-0 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/90">
                COA on request
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
