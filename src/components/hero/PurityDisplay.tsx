import { motion, MotionValue, useTransform } from "framer-motion";

interface PurityDisplayProps {
  scrollProgress: MotionValue<number>;
}

const PurityDisplay = ({ scrollProgress }: PurityDisplayProps) => {
  // Fade in during zoom stage (50-70%)
  const opacity = useTransform(scrollProgress, [0.45, 0.55, 0.9, 1], [0, 1, 1, 0.8]);
  
  // Scale from small to prominent
  const scale = useTransform(scrollProgress, [0.45, 0.7], [0.8, 1]);
  
  // Ring animation progress
  const ringProgress = useTransform(scrollProgress, [0.5, 0.75], [0, 1]);
  
  // Micro-text fade in at end
  const microTextOpacity = useTransform(scrollProgress, [0.7, 0.85], [0, 1]);
  
  // Calculate stroke dashoffset for the ring (circumference = 2 * PI * radius)
  const circumference = 2 * Math.PI * 58;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
      style={{ opacity }}
    >
      <motion.div
        className="relative flex flex-col items-center"
        style={{ scale }}
      >
        {/* Analytical ring */}
        <div className="relative">
          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            className="absolute -inset-6"
          >
            {/* Background ring */}
            <circle
              cx="80"
              cy="80"
              r="58"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              opacity={0.3}
            />
            {/* Animated progress ring */}
            <motion.circle
              cx="80"
              cy="80"
              r="58"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: useTransform(
                  ringProgress,
                  [0, 1],
                  [circumference, circumference * 0.0038] // 99.62% of the ring
                ),
                rotate: "-90deg",
                transformOrigin: "center",
              }}
              filter="drop-shadow(0 0 8px hsl(var(--primary) / 0.5))"
            />
            {/* Tick marks */}
            {[0, 90, 180, 270].map((angle) => (
              <motion.line
                key={angle}
                x1="80"
                y1="14"
                x2="80"
                y2="20"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                style={{
                  transformOrigin: "80px 80px",
                  rotate: `${angle}deg`,
                  opacity: useTransform(ringProgress, [0.2, 0.4], [0, 0.6]),
                }}
              />
            ))}
          </svg>

          {/* Purity percentage */}
          <div className="relative z-10 flex flex-col items-center justify-center w-32 h-32">
            <motion.span
              className="text-4xl md:text-5xl font-semibold tracking-tight"
              style={{
                color: "hsl(var(--primary))",
                textShadow: "0 0 20px hsl(var(--primary) / 0.3)",
              }}
            >
              99.62
            </motion.span>
            <motion.span
              className="text-lg md:text-xl font-medium text-primary"
              style={{ opacity: useTransform(ringProgress, [0.3, 0.5], [0, 1]) }}
            >
              %
            </motion.span>
          </div>
        </div>

        {/* Label */}
        <motion.span
          className="mt-4 text-sm font-medium tracking-wider uppercase text-muted-foreground"
          style={{ opacity: useTransform(ringProgress, [0.4, 0.6], [0, 1]) }}
        >
          Verified Purity
        </motion.span>

        {/* Micro-text disclaimer */}
        <motion.p
          className="mt-6 text-xs text-muted-foreground/70 tracking-wide text-center max-w-[200px]"
          style={{ opacity: microTextOpacity }}
        >
          Analytical purity representation
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default PurityDisplay;
