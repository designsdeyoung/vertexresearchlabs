import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  scrollProgress: number;
  count?: number;
}

const ParticleField = ({ scrollProgress, count = 80 }: ParticleFieldProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random particle positions
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread particles in a larger area around the vial
      positions[i3] = (Math.random() - 0.5) * 8;
      positions[i3 + 1] = (Math.random() - 0.5) * 6;
      positions[i3 + 2] = (Math.random() - 0.5) * 4 - 1;

      // Random slow velocities
      velocities[i3] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.001;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.001;
    }

    return { positions, velocities };
  }, [count]);

  // Animate particles
  useFrame((state) => {
    if (pointsRef.current) {
      const positionAttribute = pointsRef.current.geometry.getAttribute(
        "position"
      ) as THREE.BufferAttribute;
      const positions = positionAttribute.array as Float32Array;
      const time = state.clock.getElapsedTime();

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Gentle floating motion
        positions[i3] += velocities[i3] + Math.sin(time * 0.5 + i) * 0.001;
        positions[i3 + 1] += velocities[i3 + 1] + Math.cos(time * 0.3 + i) * 0.001;
        positions[i3 + 2] += velocities[i3 + 2];

        // Wrap around when particles go too far
        if (positions[i3] > 4) positions[i3] = -4;
        if (positions[i3] < -4) positions[i3] = 4;
        if (positions[i3 + 1] > 3) positions[i3 + 1] = -3;
        if (positions[i3 + 1] < -3) positions[i3 + 1] = 3;
        if (positions[i3 + 2] > 2) positions[i3 + 2] = -3;
        if (positions[i3 + 2] < -3) positions[i3 + 2] = 2;
      }

      positionAttribute.needsUpdate = true;

      // Fade particles slightly during focus stage
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.4 - scrollProgress * 0.2;

      // Subtle rotation
      pointsRef.current.rotation.y = time * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="white"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleField;
