import { useRef, lazy, Suspense } from "react";
import { motion, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, FlaskConical, FileCheck, Shield, Microscope, Package } from "lucide-react";
import { useScrollProgress } from "./hero/useScrollProgress";
import MolecularLines from "./hero/MolecularLines";
import PurityDisplay from "./hero/PurityDisplay";

// Lazy load the 3D scene for better initial load
const Hero3DScene = lazy(() => import("./hero/Hero3DScene"));

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScrollProgress(containerRef);

  // Background transition from white to stainless steel gray
  const backgroundOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0.6, 0.8]);
  
  // Content opacity - fade out as we enter the purity zoom stage
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25, 0.45], [1, 1, 0]);
  
  // Content scale and blur during transition
  const contentScale = useTransform(scrollYProgress, [0.25, 0.45], [1, 0.95]);
  const contentBlur = useTransform(scrollYProgress, [0.3, 0.45], [0, 10]);

  // 3D scene opacity - always visible but dims during purity focus
  const sceneOpacity = useTransform(scrollYProgress, [0.5, 0.7], [1, 0.3]);

  return (
    <section
      ref={containerRef}
      className="relative h-[300vh]"
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background gradient - transitions from light to stainless steel */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "var(--gradient-hero)",
            opacity: backgroundOpacity,
          }}
        />
        
        {/* Secondary background layer for steel transition */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, hsl(210 10% 96%) 0%, hsl(210 8% 90%) 50%, hsl(210 10% 94%) 100%)",
            opacity: useTransform(scrollYProgress, [0.3, 0.6], [0, 0.5]),
          }}
        />

        {/* Subtle grid pattern */}
        <motion.div
          className="absolute inset-0 opacity-[0.015] md:opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            opacity: useTransform(scrollYProgress, [0, 0.4, 0.7], [0.025, 0.015, 0.008]),
          }}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[200px] md:h-[400px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px]"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.5], [1, 0.3]),
          }}
        />

        {/* Molecular background lines */}
        <MolecularLines scrollProgress={scrollYProgress} />

        {/* 3D Vial Scene */}
        <motion.div
          className="absolute inset-0 z-10"
          style={{ opacity: sceneOpacity }}
        >
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              </div>
            }
          >
            <Hero3DScene scrollProgress={scrollYProgress} />
          </Suspense>
        </motion.div>

        {/* Purity Display - overlays during focus stage */}
        <PurityDisplay scrollProgress={scrollYProgress} />

        {/* Main content container */}
        <div className="relative z-30 h-full flex flex-col pointer-events-none">
          {/* Text content - positioned at top */}
          <motion.div
            className="flex-shrink-0 pt-20 sm:pt-28 pointer-events-auto"
            style={{
              opacity: contentOpacity,
              scale: contentScale,
              filter: useTransform(contentBlur, (b) => `blur(${b}px)`),
            }}
          >
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-3xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary/50 border border-border/50 mb-6 sm:mb-8 animate-fade-up opacity-0">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                  <span className="text-xs text-muted-foreground tracking-wide uppercase">
                    Research Use Only
                  </span>
                </div>

                {/* Main heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight mb-4 sm:mb-6 animate-fade-up opacity-0 stagger-1">
                  <span className="block">High-Purity Peptide</span>
                  <span className="block gradient-text">Research Materials</span>
                </h1>

                {/* Subheading */}
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8 sm:mb-10 animate-fade-up opacity-0 stagger-2 px-2 sm:px-0">
                  Analytical-grade peptides for laboratory research applications.
                  Verified purity. Comprehensive documentation.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-up opacity-0 stagger-3 px-4 sm:px-0">
                  <Button
                    variant="hero"
                    size="lg"
                    asChild
                    className="w-full sm:w-auto min-h-[48px] text-base"
                  >
                    <a href="#products">View Products</a>
                  </Button>
                  <Button
                    variant="heroOutline"
                    size="lg"
                    asChild
                    className="w-full sm:w-auto min-h-[48px] text-base"
                  >
                    <a href="#quality">Quality Standards</a>
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-8 sm:mt-10 animate-fade-up opacity-0 stagger-4">
                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8">
                    <div className="flex items-center gap-2 text-muted-foreground/70">
                      <Microscope size={14} className="text-muted-foreground/50" />
                      <span className="text-xs tracking-wide">Independent Analytical Testing</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground/70">
                      <FileCheck size={14} className="text-muted-foreground/50" />
                      <span className="text-xs tracking-wide">Certificates of Analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground/70">
                      <FlaskConical size={14} className="text-muted-foreground/50" />
                      <span className="text-xs tracking-wide">Research Use Only</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground/70">
                      <Shield size={14} className="text-muted-foreground/50" />
                      <span className="text-xs tracking-wide">Quality-Controlled Supply</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground/70">
                      <Package size={14} className="text-muted-foreground/50" />
                      <span className="text-xs tracking-wide">Secure & Discreet Shipping</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator - visible only at start */}
        <motion.div
          className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 hidden sm:block z-30"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]),
          }}
        >
          <a
            href="#products"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md p-2"
            aria-label="Scroll to products section"
          >
            <span className="text-xs tracking-wide uppercase">Explore</span>
            <ArrowDown size={16} className="animate-bounce" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
