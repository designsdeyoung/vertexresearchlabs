import { useState, useEffect } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
}

export const CountUp = ({ end, duration = 1 }: CountUpProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end === 0) return;
    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [end, duration]);

  return <>{count.toLocaleString()}</>;
};
