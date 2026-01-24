import { motion, MotionValue, useTransform } from "framer-motion";
import heroVial from "@/assets/hero/hero-vial.png";

interface HeroVialSceneProps {
  scrollProgress: MotionValue<number>;
}

const HeroVialScene = ({ scrollProgress }: HeroVialSceneProps) => {
  // Stage 1-2: Initial floating and rotation (0-25%)
  const initialScale = useTransform(scrollProgress, [0, 0.15], [0.85, 0.9]);
  
  // Stage 2: Rotation effect (15-40%)
  const rotateY = useTransform(scrollProgress, [0.1, 0.25, 0.4], [0, 12, 0]);
  const rotateX = useTransform(scrollProgress, [0.15, 0.3, 0.45], [0, -5, 0]);
  
  // Stage 3-4: Zoom toward purity (40-75%)
  const zoomScale = useTransform(scrollProgress, [0.35, 0.65], [0.9, 1.8]);
  
  // Combined scale
  const scale = useTransform(scrollProgress, (progress) => {
    if (progress < 0.35) {
      return 0.85 + progress * 0.14; // 0.85 to ~0.9
    }
    return 0.9 + (progress - 0.35) * 3; // 0.9 to ~2.85
  });
  
  // Vertical position - moves up as we zoom
  const y = useTransform(scrollProgress, [0, 0.5, 0.8], ["0%", "-5%", "-15%"]);
  
  // Opacity - fade slightly during final stage to emphasize purity number
  const opacity = useTransform(scrollProgress, [0, 0.6, 0.85, 1], [1, 1, 0.4, 0.3]);
  
  // Blur during zoom stage
  const blur = useTransform(scrollProgress, [0.5, 0.7], [0, 4]);
  
  // Glow effect intensity
  const glowOpacity = useTransform(scrollProgress, [0.3, 0.5], [0, 0.6]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      style={{
        perspective: "1200px",
      }}
    >
      <motion.div
        className="relative"
        style={{
          scale,
          rotateY,
          rotateX,
          y,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glow effect behind vial */}
        <motion.div
          className="absolute inset-0 -inset-x-8 -inset-y-12 rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
            opacity: glowOpacity,
            filter: "blur(20px)",
          }}
        />
        
        {/* Main vial image */}
        <motion.img
          src={heroVial}
          alt="Research peptide vial"
          className="relative w-auto h-[280px] md:h-[360px] lg:h-[420px] object-contain drop-shadow-2xl"
          style={{
            opacity,
            filter: useTransform(blur, (b) => `blur(${b}px)`),
          }}
          draggable={false}
        />
        
        {/* Glass reflection overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(
              135deg,
              transparent 0%,
              transparent 40%,
              hsl(0 0% 100% / 0.1) 45%,
              transparent 50%,
              transparent 100%
            )`,
            opacity: useTransform(rotateY, [-15, 0, 15], [0.3, 0, 0.3]),
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default HeroVialScene;
