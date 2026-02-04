import { useRef, useEffect, useState } from "react";
import { motion, useInView, useSpring, useTransform, useMotionValue } from "framer-motion";

interface PurityDialProps {
  value?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}

// Helper component to display animated value
const ValueDisplay = ({ 
  springValue, 
  isInView, 
  config, 
  label 
}: { 
  springValue: ReturnType<typeof useSpring>; 
  isInView: boolean; 
  config: { fontSize: string }; 
  label: string;
}) => {
  const [displayVal, setDisplayVal] = useState("0.00");
  
  useEffect(() => {
    const unsubscribe = springValue.on("change", (v) => {
      setDisplayVal(v.toFixed(2));
    });
    return () => unsubscribe();
  }, [springValue]);

  return (
    <motion.div
      className="flex flex-col items-center -mt-2"
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ delay: 0.8, duration: 0.4 }}
    >
      <span className={`font-bold text-primary ${config.fontSize}`}>
        {displayVal}%
      </span>
      <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
        {label}
      </span>
    </motion.div>
  );
};

const PurityDial = ({ value = 99.62, label = "HPLC Purity", size = "md" }: PurityDialProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  // Spring animation for smooth needle movement
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 1,
  });

  // Transform spring value to rotation (180 degrees = full scale from 80 to 100)
  const needleRotation = useTransform(springValue, [80, 100], [-90, 90]);

  // Counter animation
  const displayValue = useTransform(springValue, (v) => v.toFixed(2));

  useEffect(() => {
    if (isInView && !hasAnimated) {
      // Start from 80% and animate to target
      springValue.set(80);
      const timeout = setTimeout(() => {
        springValue.set(value);
        setHasAnimated(true);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isInView, hasAnimated, springValue, value]);

  // Size configurations
  const sizeConfig = {
    sm: { width: 160, height: 100, strokeWidth: 8, fontSize: "text-xl" },
    md: { width: 220, height: 130, strokeWidth: 10, fontSize: "text-2xl" },
    lg: { width: 280, height: 160, strokeWidth: 12, fontSize: "text-3xl" },
  };

  const config = sizeConfig[size];
  const radius = 70;
  const centerX = config.width / 2;
  const centerY = config.height - 20;

  // Arc path for the gauge background (180 degree arc)
  const createArc = (startAngle: number, endAngle: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Tick marks at 90%, 95%, 98%, 99%
  const ticks = [90, 95, 98, 99];
  const getTickPosition = (percent: number) => {
    // Map 80-100 to -180 to 0 degrees (left to right arc)
    const angle = ((percent - 80) / 20) * 180 - 180;
    const rad = (angle * Math.PI) / 180;
    const innerRadius = radius - 15;
    const outerRadius = radius + 5;
    return {
      x1: centerX + innerRadius * Math.cos(rad),
      y1: centerY + innerRadius * Math.sin(rad),
      x2: centerX + outerRadius * Math.cos(rad),
      y2: centerY + outerRadius * Math.sin(rad),
      labelX: centerX + (radius + 18) * Math.cos(rad),
      labelY: centerY + (radius + 18) * Math.sin(rad),
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center"
      aria-hidden="true"
    >
      <svg
        width={config.width}
        height={config.height}
        viewBox={`0 0 ${config.width} ${config.height}`}
        className="overflow-visible"
      >
        <defs>
          {/* Gradient for the arc - red to yellow to green */}
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(0 84% 60%)" /> {/* red */}
            <stop offset="40%" stopColor="hsl(45 93% 58%)" /> {/* yellow/amber */}
            <stop offset="70%" stopColor="hsl(142 71% 45%)" /> {/* green */}
            <stop offset="100%" stopColor="hsl(var(--primary))" /> {/* primary cyan */}
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background arc (track) */}
        <path
          d={createArc(-180, 0)}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          opacity={0.3}
        />

        {/* Colored arc with gradient */}
        <motion.path
          d={createArc(-180, 0)}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        />

        {/* Tick marks */}
        {ticks.map((tick) => {
          const pos = getTickPosition(tick);
          return (
            <g key={tick}>
              <motion.line
                x1={pos.x1}
                y1={pos.y1}
                x2={pos.x2}
                y2={pos.y2}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.6 } : { opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              />
              <motion.text
                x={pos.labelX}
                y={pos.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] fill-muted-foreground"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.6 } : { opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                {tick}%
              </motion.text>
            </g>
          );
        })}

        {/* Needle */}
        <motion.g
          style={{ rotate: needleRotation, originX: `${centerX}px`, originY: `${centerY}px` }}
          filter="url(#glow)"
        >
          {/* Needle body */}
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX}
            y2={centerY - radius + 10}
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            strokeLinecap="round"
          />
          {/* Needle tip glow */}
          <circle
            cx={centerX}
            cy={centerY - radius + 10}
            r={4}
            fill="hsl(var(--primary))"
          />
        </motion.g>

        {/* Center pivot */}
        <circle
          cx={centerX}
          cy={centerY}
          r={8}
          fill="hsl(var(--card))"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
        />
      </svg>

      {/* Value display */}
      <ValueDisplay
        springValue={springValue}
        isInView={isInView}
        config={config}
        label={label}
      />

      {/* Completion glow */}
      <motion.div
        className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={hasAnimated ? {
          opacity: [0, 0.5, 0],
          scale: [0.8, 1.2, 1],
        } : { opacity: 0 }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
      />
    </div>
  );
};

export default PurityDial;
