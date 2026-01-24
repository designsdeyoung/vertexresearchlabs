import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Float } from "@react-three/drei";
import * as THREE from "three";
import heroVial from "@/assets/hero/hero-vial.png";

interface VialModelProps {
  scrollProgress: number;
}

const VialModel = ({ scrollProgress }: VialModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const liquidRef = useRef<THREE.Mesh>(null);

  // Create label texture from the vial image
  const labelTexture = useTexture(heroVial);

  // Glass material with physical properties
  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("hsl(195, 100%, 50%)").multiplyScalar(0.15),
        metalness: 0,
        roughness: 0.05,
        transmission: 0.95,
        thickness: 0.5,
        ior: 1.45,
        transparent: true,
        opacity: 0.3,
        envMapIntensity: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      }),
    []
  );

  // Cap material - brushed aluminum
  const capMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("hsl(210, 10%, 75%)"),
        metalness: 0.9,
        roughness: 0.3,
      }),
    []
  );

  // Liquid material with subtle glow
  const liquidMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("hsl(195, 80%, 60%)"),
        metalness: 0,
        roughness: 0.1,
        transmission: 0.8,
        thickness: 0.3,
        transparent: true,
        opacity: 0.6,
        emissive: new THREE.Color("hsl(195, 100%, 50%)"),
        emissiveIntensity: 0.1,
      }),
    []
  );

  // Stopper material
  const stopperMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("hsl(210, 5%, 30%)"),
        metalness: 0,
        roughness: 0.8,
      }),
    []
  );

  // Animation frame - rotate based on scroll
  useFrame((state) => {
    if (groupRef.current) {
      // Full 360° rotation mapped to scroll progress (0-70%)
      const rotationProgress = Math.min(scrollProgress / 0.7, 1);
      const targetRotation = rotationProgress * Math.PI * 2;
      
      // Smooth rotation with slight lag
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation,
        0.1
      );

      // Subtle idle wobble
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.02;
      groupRef.current.rotation.z = Math.cos(time * 0.3) * 0.01;

      // Scale up slightly during scroll
      const scale = 1 + scrollProgress * 0.2;
      groupRef.current.scale.setScalar(scale);
    }

    // Liquid shimmer effect
    if (liquidRef.current) {
      const time = state.clock.getElapsedTime();
      (liquidRef.current.material as THREE.MeshPhysicalMaterial).emissiveIntensity =
        0.1 + Math.sin(time * 2) * 0.05;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.1}
      floatIntensity={0.3}
      floatingRange={[-0.05, 0.05]}
    >
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Glass vial body */}
        <mesh ref={glassRef} material={glassMaterial} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 2, 32, 1, true]} />
        </mesh>

        {/* Glass bottom (rounded) */}
        <mesh material={glassMaterial} position={[0, -1, 0]}>
          <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>

        {/* Liquid inside */}
        <mesh ref={liquidRef} material={liquidMaterial} position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 1.2, 32]} />
        </mesh>

        {/* Rubber stopper */}
        <mesh material={stopperMaterial} position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.35, 0.38, 0.25, 32]} />
        </mesh>

        {/* Aluminum crimp cap */}
        <mesh material={capMaterial} position={[0, 1.15, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.2, 32]} />
        </mesh>

        {/* Cap top */}
        <mesh material={capMaterial} position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
        </mesh>

        {/* Cap crimp ring */}
        <mesh material={capMaterial} position={[0, 1.05, 0]}>
          <torusGeometry args={[0.41, 0.03, 8, 32]} />
        </mesh>

        {/* Subtle label band */}
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.405, 0.405, 0.8, 32, 1, true]} />
          <meshStandardMaterial
            color="white"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Point light inside liquid for glow effect */}
        <pointLight
          position={[0, -0.3, 0]}
          color="hsl(195, 100%, 60%)"
          intensity={0.3}
          distance={2}
        />
      </group>
    </Float>
  );
};

export default VialModel;
