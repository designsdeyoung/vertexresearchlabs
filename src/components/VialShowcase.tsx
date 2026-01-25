import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
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

const vials = [
  { src: ghkVial, alt: "GHK-Cu Copper Peptide Research Vial", name: "GHK-Cu" },
  { src: bpcVial, alt: "BPC-157 Peptide Research Vial", name: "BPC-157" },
  { src: tbVial, alt: "TB-500 Peptide Research Vial", name: "TB-500" },
];

const VialShowcase = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Auto-rotate every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % vials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simple parallax for the whole carousel
  const carouselY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  // Calculate position for each vial based on its offset from active
  const getVialPosition = (index: number) => {
    const offset = (index - activeIndex + vials.length) % vials.length;
    
    // Positions: 0 = front, 1 = right-back, 2 = left-back
    if (offset === 0) {
      return {
        x: 0,
        z: 100,
        scale: 1,
        opacity: 1,
        blur: 0,
        rotateY: 0,
      };
    } else if (offset === 1) {
      return {
        x: 120,
        z: -50,
        scale: 0.75,
        opacity: 0.6,
        blur: 2,
        rotateY: 25,
      };
    } else {
      return {
        x: -120,
        z: -50,
        scale: 0.75,
        opacity: 0.6,
        blur: 2,
        rotateY: -25,
      };
    }
  };

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
          
          {/* Left side - Revolver Carousel */}
          <motion.div
            className="relative flex items-center justify-center h-[450px] md:h-[550px] lg:h-[600px]"
            style={{ y: carouselY, perspective: 1000 }}
          >
            {/* Glow effect behind main vial */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                className="w-48 h-48 md:w-64 md:h-64 bg-primary/20 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            {/* Rotating vials */}
            <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
              {vials.map((vial, index) => {
                const pos = getVialPosition(index);
                const isFront = (index - activeIndex + vials.length) % vials.length === 0;
                
                return (
                  <motion.div
                    key={vial.name}
                    className="absolute cursor-pointer"
                    animate={{
                      x: pos.x,
                      scale: pos.scale,
                      opacity: pos.opacity,
                      rotateY: pos.rotateY,
                      zIndex: pos.z,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    onClick={() => setActiveIndex(index)}
                    whileHover={!isFront ? { scale: pos.scale * 1.05, opacity: pos.opacity + 0.1 } : {}}
                  >
                    <motion.img
                      src={vial.src}
                      alt={vial.alt}
                      className="w-auto object-contain drop-shadow-2xl"
                      style={{
                        height: isFront ? "clamp(380px, 50vw, 530px)" : "clamp(280px, 40vw, 420px)",
                        filter: `blur(${pos.blur}px)`,
                      }}
                      animate={isFront ? {
                        y: [0, -10, 0],
                      } : {}}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    
                    {/* Product label for front vial */}
                    <AnimatePresence>
                      {isFront && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-center"
                        >
                          <span className="text-lg md:text-xl font-semibold text-primary">
                            {vial.name}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Carousel indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {vials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? "bg-primary w-6" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`View ${vials[index].name}`}
                />
              ))}
            </div>
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
