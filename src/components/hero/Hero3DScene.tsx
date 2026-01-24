import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Preload } from "@react-three/drei";
import { MotionValue, useMotionValueEvent } from "framer-motion";
import VialModel from "./VialModel";
import StudioLighting from "./StudioLighting";
import ParticleField from "./ParticleField";

interface Hero3DSceneProps {
  scrollProgress: MotionValue<number>;
}

// Loading fallback component
const LoadingFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
  </div>
);

// Check for WebGL support
const isWebGLSupported = () => {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
};

// Check for reduced motion preference
const prefersReducedMotion = () => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const Hero3DScene = ({ scrollProgress }: Hero3DSceneProps) => {
  const [progress, setProgress] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check browser support on mount
  useEffect(() => {
    setIsSupported(isWebGLSupported());
    setReducedMotion(prefersReducedMotion());
  }, []);

  // Sync framer motion value to state for Three.js
  useMotionValueEvent(scrollProgress, "change", (latest) => {
    setProgress(latest);
  });

  // Fallback for unsupported browsers or reduced motion
  if (!isSupported || reducedMotion) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/src/assets/hero/hero-vial.png"
          alt="Research peptide vial"
          className="w-auto h-[300px] md:h-[400px] object-contain"
          style={{
            filter: "drop-shadow(0 20px 40px hsl(var(--foreground) / 0.1))",
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 45,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
        >
          {/* Studio lighting setup */}
          <StudioLighting scrollProgress={progress} />

          {/* Environment map for realistic reflections */}
          <Environment preset="studio" environmentIntensity={0.5} />

          {/* Floating particles (clean room effect) */}
          <ParticleField scrollProgress={progress} count={60} />

          {/* 3D Vial model */}
          <VialModel scrollProgress={progress} />

          {/* Preload assets */}
          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Hero3DScene;
