import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface DNAHelixProps {
  className?: string;
  nodeCount?: number;
}

const DNAHelix = ({ className = "", nodeCount = 8 }: DNAHelixProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effect based on scroll
  const translateY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Generate helix nodes
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: i,
    delay: i * 0.15,
  }));

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ y: translateY }}
      >
        {/* Helix container with 3D perspective */}
        <motion.div
          className="relative w-[200px] h-[400px] md:w-[280px] md:h-[500px]"
          style={{ perspective: 800, transformStyle: "preserve-3d" }}
          animate={{ rotateY: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Strand 1 - Left helix */}
          <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
            {nodes.map((node, index) => {
              const yPosition = (index / (nodeCount - 1)) * 100;
              const phase = (index / nodeCount) * Math.PI * 2;
              const xOffset = Math.sin(phase) * 60;
              const zOffset = Math.cos(phase) * 60;

              return (
                <motion.div
                  key={`strand1-${node.id}`}
                  className="absolute left-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary/60"
                  style={{
                    top: `${yPosition}%`,
                    x: xOffset,
                    z: zOffset,
                    transformStyle: "preserve-3d",
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: node.delay,
                    ease: "easeInOut",
                  }}
                >
                  {/* Inner glow */}
                  <div className="absolute inset-0 rounded-full bg-primary blur-sm" />
                </motion.div>
              );
            })}
          </div>

          {/* Strand 2 - Right helix (offset by PI) */}
          <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
            {nodes.map((node, index) => {
              const yPosition = (index / (nodeCount - 1)) * 100;
              const phase = (index / nodeCount) * Math.PI * 2 + Math.PI;
              const xOffset = Math.sin(phase) * 60;
              const zOffset = Math.cos(phase) * 60;

              return (
                <motion.div
                  key={`strand2-${node.id}`}
                  className="absolute left-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary/40"
                  style={{
                    top: `${yPosition}%`,
                    x: xOffset,
                    z: zOffset,
                    transformStyle: "preserve-3d",
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: node.delay + 1,
                    ease: "easeInOut",
                  }}
                >
                  {/* Inner glow */}
                  <div className="absolute inset-0 rounded-full bg-primary/50 blur-sm" />
                </motion.div>
              );
            })}
          </div>

          {/* Connecting rungs between strands */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {nodes.map((node, index) => {
              const yPosition = (index / (nodeCount - 1)) * 100;
              const phase1 = (index / nodeCount) * Math.PI * 2;
              const phase2 = phase1 + Math.PI;
              const x1 = 50 + (Math.sin(phase1) * 30);
              const x2 = 50 + (Math.sin(phase2) * 30);

              return (
                <motion.line
                  key={`rung-${node.id}`}
                  x1={`${x1}%`}
                  y1={`${yPosition}%`}
                  x2={`${x2}%`}
                  y2={`${yPosition}%`}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  strokeOpacity={0.2}
                  animate={{
                    strokeOpacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: node.delay,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </svg>
        </motion.div>

        {/* Central glow effect */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-64 bg-primary/10 rounded-full blur-3xl" />
      </motion.div>
    </div>
  );
};

export default DNAHelix;
