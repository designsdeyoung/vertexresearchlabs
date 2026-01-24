import { motion, MotionValue, useTransform } from "framer-motion";

interface PurityDisplayProps {
  scrollProgress: MotionValue<number>;
}

const PurityDisplay = ({ scrollProgress }: PurityDisplayProps) => {
  // Container fades in during zoom stage (45-55%)
  const containerOpacity = useTransform(scrollProgress, [0.4, 0.5, 0.9, 1], [0, 1, 1, 0.9]);
  
  // Scale from small to prominent
  const scale = useTransform(scrollProgress, [0.4, 0.65], [0.85, 1]);
  
  // The NUMBER is visible early at low opacity, then snaps to full
  const numberOpacity = useTransform(scrollProgress, [0.3, 0.35, 0.5, 0.55], [0, 0.3, 0.3, 1]);
  
  // Number scale pulse when it becomes fully visible
  const numberScale = useTransform(scrollProgress, [0.5, 0.55, 0.6], [1, 1.08, 1]);
  
  // Ring "catches up" FAST (0.5-0.7 = very quick animation)
  const ringProgress = useTransform(scrollProgress, [0.5, 0.72], [0, 1]);
  
  // Micro-text and labels fade in after ring animation
  const labelOpacity = useTransform(scrollProgress, [0.6, 0.75], [0, 1]);
  const microTextOpacity = useTransform(scrollProgress, [0.7, 0.85], [0, 1]);
  
  // Calculate stroke dashoffset for the ring (circumference = 2 * PI * radius)
  const circumference = 2 * Math.PI * 58;

  // Data points that appear around the ring
  const dataPoints = [
    { label: "HPLC", value: "Verified", angle: -45 },
    { label: "MW", value: "838.5", angle: 45 },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
      style={{ opacity: containerOpacity }}
    >
      <motion.div
        className="relative flex flex-col items-center"
        style={{ scale }}
      >
        {/* Outer glow effect */}
        <motion.div
          className="absolute inset-0 -inset-12 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
            opacity: useTransform(ringProgress, [0.5, 1], [0, 1]),
            filter: "blur(20px)",
          }}
        />

        {/* Analytical ring */}
        <div className="relative">
          <svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            className="absolute -inset-8"
          >
            {/* Background ring */}
            <circle
              cx="90"
              cy="90"
              r="58"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              opacity={0.3}
            />
            
            {/* Secondary outer ring */}
            <motion.circle
              cx="90"
              cy="90"
              r="68"
              fill="none"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="1"
              strokeDasharray="4 8"
              style={{
                opacity: useTransform(ringProgress, [0.3, 0.6], [0, 0.4]),
              }}
            />
            
            {/* Animated progress ring - FAST catch-up */}
            <motion.circle
              cx="90"
              cy="90"
              r="58"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
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
              filter="drop-shadow(0 0 10px hsl(var(--primary) / 0.6))"
            />
            
            {/* Tick marks */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <motion.line
                key={angle}
                x1="90"
                y1="24"
                x2="90"
                y2={angle % 90 === 0 ? "30" : "27"}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={angle % 90 === 0 ? "1.5" : "1"}
                style={{
                  transformOrigin: "90px 90px",
                  rotate: `${angle}deg`,
                  opacity: useTransform(ringProgress, [0.2, 0.5], [0, 0.5]),
                }}
              />
            ))}

            {/* End cap indicator */}
            <motion.circle
              cx="90"
              cy="32"
              r="3"
              fill="hsl(var(--primary))"
              style={{
                transformOrigin: "90px 90px",
                rotate: useTransform(ringProgress, [0, 1], ["-90deg", "267deg"]),
                opacity: ringProgress,
              }}
              filter="drop-shadow(0 0 4px hsl(var(--primary)))"
            />
          </svg>

          {/* Purity percentage - VISIBLE EARLY */}
          <div className="relative z-10 flex flex-col items-center justify-center w-36 h-36">
            <motion.div
              className="flex items-baseline"
              style={{
                opacity: numberOpacity,
                scale: numberScale,
              }}
            >
              <motion.span
                className="text-5xl md:text-6xl font-semibold tracking-tight tabular-nums"
                style={{
                  color: "hsl(var(--primary))",
                  textShadow: "0 0 30px hsl(var(--primary) / 0.4)",
                }}
              >
                99.62
              </motion.span>
              <motion.span
                className="text-xl md:text-2xl font-medium text-primary ml-0.5"
              >
                %
              </motion.span>
            </motion.div>
          </div>
        </div>

        {/* Label */}
        <motion.span
          className="mt-4 text-sm font-medium tracking-wider uppercase text-muted-foreground"
          style={{ opacity: labelOpacity }}
        >
          Verified Purity
        </motion.span>

        {/* Data point labels */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: labelOpacity }}
        >
          {dataPoints.map((point, i) => (
            <motion.div
              key={i}
              className="absolute text-xs text-muted-foreground/70"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) rotate(${point.angle}deg) translateY(-90px) rotate(-${point.angle}deg)`,
              }}
            >
              <span className="block text-[10px] uppercase tracking-wider opacity-70">
                {point.label}
              </span>
              <span className="block font-medium text-foreground/80">
                {point.value}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Micro-text disclaimer */}
        <motion.p
          className="mt-6 text-xs text-muted-foreground/70 tracking-wide text-center max-w-[220px]"
          style={{ opacity: microTextOpacity }}
        >
          Third-party HPLC analysis · Batch verified
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default PurityDisplay;
