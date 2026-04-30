import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Flame, ArrowRight } from "lucide-react";
import ghkVial from "@/assets/showcase/ghk-cu-png.png";
import bpcVial from "@/assets/showcase/bpc-157-png.png";
import tb500Vial from "@/assets/showcase/tb-500-png.png";
import tesamorelinVial from "@/assets/showcase/tesamorelin-png.png";
import nadVial from "@/assets/showcase/nad-plus-png.png";
import semaxVial from "@/assets/showcase/semax-png.png";
import FloatingParticles from "./FloatingParticles";

// Curated best sellers (most popular)
const vials = [
  { src: bpcVial, alt: "BPC-157 Peptide Research Vial", name: "BPC-157", tagline: "Recovery & repair research", productId: "bpc-157" },
  { src: ghkVial, alt: "GHK-Cu Copper Peptide Research Vial", name: "GHK-Cu", tagline: "Skin & tissue research", productId: "ghk-cu" },
  { src: tb500Vial, alt: "TB-500 Peptide Research Vial", name: "TB-500", tagline: "Tissue regeneration research", productId: "tb-500" },
  { src: nadVial, alt: "NAD+ Research Vial", name: "NAD+", tagline: "Cellular energy research", productId: "nad-plus" },
  { src: tesamorelinVial, alt: "Tesamorelin Peptide Research Vial", name: "Tesamorelin", tagline: "Metabolic research", productId: "tesamorelin" },
  { src: semaxVial, alt: "Semax Peptide Research Vial", name: "Semax", tagline: "Cognitive research", productId: "semax" },
];

const BestSellersShowcase = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Auto-rotate every 3.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % vials.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const carouselY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const getVialPosition = (index: number) => {
    const offset = (index - activeIndex + vials.length) % vials.length;
    if (offset === 0) return { x: 0, scale: 1, opacity: 1, blur: 0, rotateY: 0, z: 100 };
    if (offset === 1) return { x: 220, scale: 0.6, opacity: 0.4, blur: 3, rotateY: 25, z: -50 };
    if (offset === vials.length - 1) return { x: -220, scale: 0.6, opacity: 0.4, blur: 3, rotateY: -25, z: -50 };
    return { x: offset > vials.length / 2 ? -300 : 300, scale: 0.4, opacity: 0, blur: 5, rotateY: 0, z: -100 };
  };

  const active = vials[activeIndex];

  return (
    <section
      ref={containerRef}
      aria-label="Best selling research peptides"
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <FloatingParticles count={30} />
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
            <Flame size={12} className="text-primary" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
              Best Sellers
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground md:text-4xl lg:text-5xl">
            Researcher Favorites
          </h2>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            Our most-ordered reference materials — verified purity, lot-specific COAs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Carousel */}
          <motion.div
            className="relative flex items-center justify-center h-[420px] md:h-[520px]"
            style={{ y: carouselY, perspective: 1000 }}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="w-48 h-48 md:w-64 md:h-64 bg-primary/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
              {vials.map((vial, index) => {
                const pos = getVialPosition(index);
                const isFront = (index - activeIndex + vials.length) % vials.length === 0;
                return (
                  <motion.div
                    key={vial.name}
                    className="absolute cursor-pointer"
                    animate={{ x: pos.x, scale: pos.scale, opacity: pos.opacity, rotateY: pos.rotateY, zIndex: pos.z }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    onClick={() => setActiveIndex(index)}
                    whileHover={!isFront ? { scale: pos.scale * 1.05, opacity: pos.opacity + 0.1 } : {}}
                  >
                    <motion.img
                      src={vial.src}
                      alt={vial.alt}
                      className="w-auto object-contain"
                      style={{
                        height: isFront ? "clamp(340px, 45vw, 480px)" : "clamp(220px, 32vw, 340px)",
                        filter: `blur(${pos.blur}px) drop-shadow(0 20px 40px rgba(0, 0, 0, ${isFront ? '0.7' : '0.4'})) drop-shadow(0 0 60px rgba(0, 180, 216, ${isFront ? '0.15' : '0'}))`,
                      }}
                      animate={isFront ? { y: [0, -10, 0] } : {}}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {vials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2"
                  }`}
                  aria-label={`View ${vials[index].name}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Active vial info */}
          <div className="text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
                  Featured · #{activeIndex + 1} of {vials.length}
                </span>
                <h3 className="mt-3 text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
                  {active.name}
                </h3>
                <p className="mt-3 text-base text-muted-foreground md:text-lg">
                  {active.tagline}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <Link
                    to={`/product/${active.productId}`}
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30"
                  >
                    View {active.name}
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <a
                    href="#products"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-card"
                  >
                    Shop All
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellersShowcase;
