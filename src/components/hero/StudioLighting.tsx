import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StudioLightingProps {
  scrollProgress: number;
}

const StudioLighting = ({ scrollProgress }: StudioLightingProps) => {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.SpotLight>(null);

  // Animate lighting intensity based on scroll
  useFrame(() => {
    if (keyLightRef.current) {
      // Slightly increase key light during scroll
      keyLightRef.current.intensity = 1.2 + scrollProgress * 0.3;
    }
    if (rimLightRef.current) {
      // Rim light gets stronger during focus stage
      rimLightRef.current.intensity = 0.5 + scrollProgress * 0.5;
    }
  });

  return (
    <>
      {/* Ambient fill - soft overall illumination */}
      <ambientLight intensity={0.4} color="hsl(210, 20%, 98%)" />

      {/* Key light - main illumination from upper right (lab ceiling panel) */}
      <directionalLight
        ref={keyLightRef}
        position={[3, 5, 2]}
        intensity={1.2}
        color="hsl(210, 10%, 100%)"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={15}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />

      {/* Fill light - softer from left side */}
      <directionalLight
        position={[-2, 3, 1]}
        intensity={0.4}
        color="hsl(200, 30%, 95%)"
      />

      {/* Rim light - creates edge definition on glass */}
      <spotLight
        ref={rimLightRef}
        position={[-2, 2, -3]}
        angle={0.4}
        penumbra={0.5}
        intensity={0.5}
        color="hsl(195, 50%, 90%)"
        castShadow={false}
      />

      {/* Bottom fill - prevents harsh shadows underneath */}
      <directionalLight
        position={[0, -3, 2]}
        intensity={0.2}
        color="hsl(210, 20%, 90%)"
      />

      {/* Accent light - subtle cyan highlight */}
      <pointLight
        position={[1, 0, 3]}
        intensity={0.3}
        color="hsl(195, 100%, 70%)"
        distance={8}
      />
    </>
  );
};

export default StudioLighting;
