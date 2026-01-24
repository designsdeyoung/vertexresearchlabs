import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, FileCheck, Microscope } from "lucide-react";
import ghkVial from "@/assets/showcase/ghk-vial.png";
import bpcVial from "@/assets/showcase/bpc-vial.png";
import tbVial from "@/assets/showcase/tb-vial.png";
import FloatingParticles from "./FloatingParticles";
import ScientificMeters from "./ScientificMeters";

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
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Simple, smooth animations
  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.95]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]);

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      
      {/* Floating particles */}
      <FloatingParticles count={40} />

      {/* Subtle glow behind vial */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Top section - Vial + Bullet Points */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          
          {/* Left side - Vial Images with depth */}
          <motion.div
            className="relative flex items-center justify-center h-[450px] md:h-[550px] lg:h-[600px]"
            style={{
              y: imageY,
            }}
          >
            {/* Background vial - TB-500 (left back) */}
            <motion.div
              className="absolute"
              style={{
                left: '5%',
                top: '10%',
                scale: imageScale,
                opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.7, 0.7, 0.3]),
              }}
            >
              <img
                src={tbVial}
                alt="TB-500 Peptide Research Vial"
                className="w-auto h-[280px] md:h-[350px] lg:h-[400px] object-contain drop-shadow-xl blur-[1px] opacity-70"
              />
            </motion.div>

            {/* Background vial - BPC-157 (right back) */}
            <motion.div
              className="absolute"
              style={{
                right: '5%',
                top: '8%',
                scale: imageScale,
                opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.7, 0.7, 0.3]),
              }}
            >
              <img
                src={bpcVial}
                alt="BPC-157 Peptide Research Vial"
                className="w-auto h-[300px] md:h-[370px] lg:h-[420px] object-contain drop-shadow-xl blur-[1px] opacity-70"
              />
            </motion.div>

            {/* Glow effect behind main vial */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 md:w-64 md:h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            </div>
            
            {/* Main vial - GHK-Cu (front center) */}
            <motion.img
              src={ghkVial}
              alt="GHK-Cu Copper Peptide Research Vial"
              className="relative z-10 w-auto h-[380px] md:h-[480px] lg:h-[530px] object-contain drop-shadow-2xl"
              style={{
                scale: imageScale,
                opacity: imageOpacity,
              }}
            />
          </motion.div>

          {/* Right side - Content */}
          <div className="space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <span className="inline-block text-xs font-medium tracking-widest uppercase text-primary">
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground leading-tight">
                Research-Grade
                <span className="block gradient-text">Quality Assurance</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-md">
                Every compound meets stringent analytical standards for your research needs.
              </p>
            </motion.div>

            {/* Bullet Points */}
            <div className="space-y-5">
              {bulletPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="group"
                >
                  <div className="flex items-start gap-4 p-5 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm transition-all duration-300 hover:bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <point.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {point.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section - Scientific Meters */}
        <div className="glass-card rounded-2xl p-8 md:p-12 border border-border/50">
          <ScientificMeters />
        </div>
      </div>
    </section>
  );
};

export default VialShowcase;
