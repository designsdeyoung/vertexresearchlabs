import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface CountUpOptions {
  duration?: number;
  /** Animate from this value on mount (e.g. 0 for a load-in tick-up).
   *  Omit to only animate subsequent changes. */
  startFrom?: number;
}

/** Animates a number toward `target` with an ease-out curve whenever the
 *  target changes. Snaps instantly when the user prefers reduced motion. */
export function useCountUp(
  target: number,
  { duration = 900, startFrom }: CountUpOptions = {},
) {
  const reduced = useReducedMotion();
  const initial = startFrom ?? target;
  const [value, setValue] = useState(reduced ? target : initial);
  const fromRef = useRef(reduced ? target : initial);

  useEffect(() => {
    if (fromRef.current === target) return;
    if (reduced) {
      fromRef.current = target;
      setValue(target);
      return;
    }
    const from = fromRef.current;
    fromRef.current = target;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduced]);

  return value;
}
