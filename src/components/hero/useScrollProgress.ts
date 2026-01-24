import { useScroll, useTransform, MotionValue } from "framer-motion";
import { RefObject } from "react";

interface ScrollProgressResult {
  scrollYProgress: MotionValue<number>;
  // Stage indicators (0-1 within each stage)
  stage1Progress: MotionValue<number>; // 0-25%
  stage2Progress: MotionValue<number>; // 25-50%
  stage3Progress: MotionValue<number>; // 50-75%
  stage4Progress: MotionValue<number>; // 75-100%
}

export const useScrollProgress = (
  containerRef: RefObject<HTMLElement>
): ScrollProgressResult => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Stage 1: 0% to 25%
  const stage1Progress = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  
  // Stage 2: 25% to 50%
  const stage2Progress = useTransform(scrollYProgress, [0.25, 0.5], [0, 1]);
  
  // Stage 3: 50% to 75%
  const stage3Progress = useTransform(scrollYProgress, [0.5, 0.75], [0, 1]);
  
  // Stage 4: 75% to 100%
  const stage4Progress = useTransform(scrollYProgress, [0.75, 1], [0, 1]);

  return {
    scrollYProgress,
    stage1Progress,
    stage2Progress,
    stage3Progress,
    stage4Progress,
  };
};
