import { motion, MotionValue, useTransform } from "framer-motion";

interface MolecularLinesProps {
  scrollProgress: MotionValue<number>;
}

const MolecularLines = ({ scrollProgress }: MolecularLinesProps) => {
  // Fade in during scroll 20-40%, then stabilize
  const opacity = useTransform(scrollProgress, [0.15, 0.35, 0.7, 0.85], [0, 0.2, 0.2, 0.08]);
  
  // Subtle scale animation
  const scale = useTransform(scrollProgress, [0.2, 0.5], [0.95, 1]);
  
  // Line drawing progress
  const pathProgress = useTransform(scrollProgress, [0.15, 0.5], [0, 1]);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity }}
    >
      <motion.svg
        viewBox="0 0 800 600"
        className="absolute inset-0 w-full h-full"
        style={{ scale }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Hexagonal molecular structure - left side */}
        <motion.g stroke="url(#lineGradient)" fill="none" strokeWidth="1">
          {/* Hexagon 1 */}
          <motion.path
            d="M120 200 L160 175 L200 200 L200 250 L160 275 L120 250 Z"
            style={{
              pathLength: pathProgress,
              strokeDasharray: 1,
              strokeDashoffset: useTransform(pathProgress, [0, 1], [1, 0]),
            }}
          />
          {/* Hexagon 2 - connected */}
          <motion.path
            d="M200 200 L240 175 L280 200 L280 250 L240 275 L200 250"
            style={{
              pathLength: pathProgress,
              strokeDasharray: 1,
              strokeDashoffset: useTransform(pathProgress, [0, 1], [1, 0]),
            }}
          />
          {/* Bond lines */}
          <motion.path
            d="M160 275 L160 320 M240 275 L240 320"
            style={{
              pathLength: pathProgress,
              strokeDasharray: 1,
              strokeDashoffset: useTransform(pathProgress, [0.1, 1], [1, 0]),
            }}
          />
          {/* Additional hexagon below */}
          <motion.path
            d="M120 320 L160 295 L200 320 L200 370 L160 395 L120 370 Z"
            style={{
              pathLength: pathProgress,
              strokeDasharray: 1,
              strokeDashoffset: useTransform(pathProgress, [0.2, 1], [1, 0]),
            }}
          />
        </motion.g>

        {/* Pentagon structure - right side */}
        <motion.g stroke="url(#lineGradient)" fill="none" strokeWidth="1">
          <motion.path
            d="M580 180 L630 210 L615 265 L545 265 L530 210 Z"
            style={{
              pathLength: pathProgress,
              strokeDasharray: 1,
              strokeDashoffset: useTransform(pathProgress, [0.1, 1], [1, 0]),
            }}
          />
          {/* Connecting bonds */}
          <motion.path
            d="M630 210 L680 190 M615 265 L660 290 M545 265 L500 290"
            style={{
              pathLength: pathProgress,
              strokeDasharray: 1,
              strokeDashoffset: useTransform(pathProgress, [0.15, 1], [1, 0]),
            }}
          />
          {/* Lower structure */}
          <motion.path
            d="M560 320 L610 350 L595 405 L525 405 L510 350 Z"
            style={{
              pathLength: pathProgress,
              strokeDasharray: 1,
              strokeDashoffset: useTransform(pathProgress, [0.25, 1], [1, 0]),
            }}
          />
        </motion.g>

        {/* Scattered nodes/atoms */}
        <motion.g fill="hsl(var(--secondary))" opacity={0.4}>
          {[
            { cx: 160, cy: 175 },
            { cx: 200, cy: 200 },
            { cx: 240, cy: 175 },
            { cx: 280, cy: 200 },
            { cx: 580, cy: 180 },
            { cx: 630, cy: 210 },
            { cx: 615, cy: 265 },
            { cx: 160, cy: 320 },
            { cx: 560, cy: 320 },
          ].map((pos, i) => (
            <motion.circle
              key={i}
              cx={pos.cx}
              cy={pos.cy}
              r="3"
              style={{
                scale: useTransform(pathProgress, [i * 0.05, i * 0.05 + 0.3], [0, 1]),
                opacity: useTransform(pathProgress, [i * 0.05, i * 0.05 + 0.3], [0, 0.6]),
              }}
            />
          ))}
        </motion.g>

        {/* Fine grid lines - subtle technical background */}
        <motion.g stroke="hsl(var(--border))" strokeWidth="0.5" opacity={0.15}>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.line
              key={`h-${i}`}
              x1="0"
              y1={75 * i}
              x2="800"
              y2={75 * i}
              style={{
                opacity: useTransform(pathProgress, [0.3, 0.5], [0, 0.5]),
              }}
            />
          ))}
          {Array.from({ length: 11 }).map((_, i) => (
            <motion.line
              key={`v-${i}`}
              x1={80 * i}
              y1="0"
              x2={80 * i}
              y2="600"
              style={{
                opacity: useTransform(pathProgress, [0.3, 0.5], [0, 0.5]),
              }}
            />
          ))}
        </motion.g>
      </motion.svg>
    </motion.div>
  );
};

export default MolecularLines;
