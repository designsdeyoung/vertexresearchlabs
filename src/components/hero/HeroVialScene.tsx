import { motion, MotionValue, useTransform } from "framer-motion";
import heroVial from "@/assets/hero/hero-vial.png";

interface HeroVialSceneProps {
  scrollProgress: MotionValue<number>;
}

const HeroVialScene = ({ scrollProgress }: HeroVialSceneProps) => {
  // Stage 2: Rotation effect (15-40%)
  const rotateY = useTransform(scrollProgress, [0.1, 0.25, 0.4], [0, 12, 0]);
  const rotateX = useTransform(scrollProgress, [0.15, 0.3, 0.45], [0, -5, 0]);
  
  // Combined scale - starts smaller, grows during scroll
  const scale = useTransform(scrollProgress, (progress) => {
    if (progress < 0.35) {
      return 0.9 + progress * 0.2; // 0.9 to ~0.97
    }
    return 0.97 + (progress - 0.35) * 2.5; // 0.97 to ~2.6
  });
  
  // Vertical position - moves up as we zoom
  const y = useTransform(scrollProgress, [0, 0.5, 0.8], ["0%", "-10%", "-25%"]);
  
  // Opacity - fade slightly during final stage to emphasize purity number
  const opacity = useTransform(scrollProgress, [0, 0.6, 0.85, 1], [1, 1, 0.4, 0.3]);
  
  // Blur during zoom stage
  const blur = useTransform(scrollProgress, [0.5, 0.7], [0, 4]);
  
  // Glow effect intensity
  const glowOpacity = useTransform(scrollProgress, [0.3, 0.5], [0, 0.6]);

  // Floating animation for initial state
  const floatY = useTransform(scrollProgress, [0, 0.15], [0, 1]);

  return (
    <motion.div
      className="absolute inset-0 flex items-start justify-center pointer-events-none pt-4"
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
          className="absolute inset-0 -inset-x-12 -inset-y-16 rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.2) 0%, transparent 70%)",
            opacity: glowOpacity,
            filter: "blur(30px)",
          }}
        />
        
        {/* Subtle drop shadow for depth */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-8 rounded-[100%]"
          style={{
            background: "radial-gradient(ellipse at center, hsl(var(--foreground) / 0.15) 0%, transparent 70%)",
            filter: "blur(8px)",
            opacity: useTransform(scrollProgress, [0, 0.5], [0.6, 0.2]),
          }}
        />
        
        {/* Main vial image */}
        <motion.img
          src={heroVial}
          alt="Research peptide vial"
          className="relative w-auto h-[240px] md:h-[320px] lg:h-[380px] object-contain"
          style={{
            opacity,
            filter: useTransform(blur, (b) => `blur(${b}px) drop-shadow(0 20px 40px hsl(var(--foreground) / 0.1))`),
          }}
          draggable={false}
        />
        
        {/* Glass reflection overlay - subtle shimmer effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(
              120deg,
              transparent 0%,
              transparent 35%,
              hsl(0 0% 100% / 0.08) 40%,
              hsl(0 0% 100% / 0.15) 45%,
              hsl(0 0% 100% / 0.08) 50%,
              transparent 55%,
              transparent 100%
            )`,
            opacity: useTransform(rotateY, [-15, 0, 15], [0.5, 0.2, 0.5]),
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default HeroVialScene;
