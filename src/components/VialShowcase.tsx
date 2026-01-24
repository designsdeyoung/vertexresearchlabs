import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { Shield, FileCheck, Microscope } from "lucide-react";
import { useScrollProgress } from "./hero/useScrollProgress";
import MolecularLines from "./hero/MolecularLines";
import PurityDisplay from "./hero/PurityDisplay";
import ghkVial from "@/assets/showcase/ghk-vial.png";

const bulletPoints = [
  {
    icon: Shield,
    title: "Quality Controlled Supply",
    description: "Verified purity exceeding 99% through rigorous analytical testing",
  },
  {
    icon: FileCheck,
    title: "Certificates of Analysis",
    description: "Comprehensive COA documentation included with every order",
  },
  {
    icon: Microscope,
    title: "Independent Lab Testing",
    description: "Third-party verification ensures accuracy and consistency",
  },
];

const VialShowcase = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScrollProgress(containerRef);

  // Background transition
  const backgroundOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0.6, 0.8]);

  // Image animation
  const imageScale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const imageY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);

  // Bullet points stagger animation
  const bulletOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const bulletY = useTransform(scrollYProgress, [0, 0.15], [30, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[300vh]"
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background gradient */}
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

        {/* Main content layout */}
        <div className="relative z-20 h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left side - Vial Image */}
              <motion.div
                className="relative flex items-center justify-center order-1"
                style={{
                  opacity: imageOpacity,
                  scale: imageScale,
                  y: imageY,
                }}
              >
                <img
                  src={ghkVial}
                  alt="GHK-Cu Copper Peptide Research Vial"
                  className="w-auto h-[50vh] lg:h-[70vh] max-h-[600px] object-contain drop-shadow-2xl"
                />
              </motion.div>

              {/* Right side - Bullet Points */}
              <motion.div
                className="order-2 space-y-6"
                style={{
                  opacity: bulletOpacity,
                  y: bulletY,
                }}
              >
                <div className="space-y-2 mb-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">
                    Research-Grade Quality
                  </h2>
                  <p className="text-muted-foreground">
                    Every compound meets stringent analytical standards
                  </p>
                </div>

                {bulletPoints.map((point, index) => (
                  <motion.div
                    key={point.title}
                    className="glass-card p-5 sm:p-6 rounded-xl border border-border/50"
                    style={{
                      opacity: useTransform(
                        scrollYProgress,
                        [0.05 + index * 0.05, 0.15 + index * 0.05],
                        [0, 1]
                      ),
                      x: useTransform(
                        scrollYProgress,
                        [0.05 + index * 0.05, 0.15 + index * 0.05],
                        [20, 0]
                      ),
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <point.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {point.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {point.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Purity Display - overlays during focus stage */}
        <PurityDisplay scrollProgress={scrollYProgress} />
      </div>
    </section>
  );
};

export default VialShowcase;
