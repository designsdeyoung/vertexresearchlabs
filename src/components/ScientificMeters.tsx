import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface LabMeterProps {
  label: string;
  value: number;
  maxValue?: number;
  unit?: string;
  color?: "primary" | "success" | "warning";
  inverted?: boolean; // For metrics where lower is better (like toxicity)
  delay?: number;
}

const LabMeter = ({
  label,
  value,
  maxValue = 100,
  unit = "%",
  color = "primary",
  inverted = false,
  delay = 0,
}: LabMeterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const percentage = (value / maxValue) * 100;
  const displayPercentage = inverted ? 100 - percentage : percentage;

  const colorClasses = {
    primary: "from-primary to-primary/70",
    success: "from-emerald-500 to-emerald-400",
    warning: "from-amber-500 to-amber-400",
  };

  const glowClasses = {
    primary: "shadow-primary/30",
    success: "shadow-emerald-500/30",
    warning: "shadow-amber-500/30",
  };

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      {/* Beaker/Tube Container */}
      <div className="relative w-16 h-32 md:w-20 md:h-40">
        {/* Glass tube outline */}
        <div className="absolute inset-0 rounded-b-2xl rounded-t-lg border-2 border-border/60 bg-background/50 backdrop-blur-sm overflow-hidden">
          {/* Measurement marks */}
          <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between py-2 px-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-px bg-border/50" />
                <span className="text-[8px] text-muted-foreground/50">
                  {100 - i * 25}
                </span>
              </div>
            ))}
          </div>

          {/* Liquid fill */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${colorClasses[color]} rounded-b-xl`}
            initial={{ height: 0 }}
            animate={isInView ? { height: `${displayPercentage}%` } : { height: 0 }}
            transition={{
              duration: 1.5,
              delay: delay,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            {/* Liquid surface shine */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-white/30 rounded-full blur-sm" />
            
            {/* Bubbles */}
            <motion.div
              className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-white/40"
              animate={{ y: [-5, -15, -5], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: delay }}
            />
            <motion.div
              className="absolute bottom-4 right-3 w-1 h-1 rounded-full bg-white/30"
              animate={{ y: [-3, -10, -3], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: delay + 0.5 }}
            />
          </motion.div>
        </div>

        {/* Tube cap */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 md:w-12 h-3 bg-muted-foreground/20 rounded-t-lg border border-border/50" />

        {/* Glow effect */}
        <motion.div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full blur-xl ${glowClasses[color]} opacity-0`}
          animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
          transition={{ duration: 1, delay: delay + 0.5 }}
        />
      </div>

      {/* Value Display */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: delay + 0.8 }}
      >
        <div className="text-xl md:text-2xl font-bold text-foreground">
          {inverted ? (value === 0 ? "ND" : `<${value}`) : value}
          {!inverted && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
          {label}
        </div>
      </motion.div>
    </div>
  );
};

interface ScientificMetersProps {
  className?: string;
}

const ScientificMeters = ({ className = "" }: ScientificMetersProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const metrics = [
    { label: "HPLC Purity", value: 99.62, unit: "%", color: "primary" as const, delay: 0 },
    { label: "Heavy Metals", value: 0, unit: "ppm", color: "success" as const, inverted: true, delay: 0.2 },
    { label: "Endotoxins", value: 0, unit: "EU/mg", color: "success" as const, inverted: true, delay: 0.4 },
    { label: "Microbial", value: 0, unit: "", color: "success" as const, inverted: true, delay: 0.6 },
  ];

  return (
    <div ref={containerRef} className={className}>
      {/* Section Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-xs font-medium tracking-widest uppercase text-primary">
          Laboratory Analysis
        </span>
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mt-2">
          COA Verified Results
        </h3>
      </motion.div>

      {/* Meters Grid */}
      <div className="flex justify-center gap-6 md:gap-10 flex-wrap">
        {metrics.map((metric) => (
          <LabMeter
            key={metric.label}
            label={metric.label}
            value={metric.value}
            unit={metric.unit}
            color={metric.color}
            inverted={metric.inverted}
            delay={metric.delay}
          />
        ))}
      </div>

      {/* Legend */}
      <motion.div
        className="flex justify-center gap-6 mt-8 text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-t from-primary to-primary/70" />
          <span>Purity Level</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-t from-emerald-500 to-emerald-400" />
          <span>Not Detected</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ScientificMeters;
