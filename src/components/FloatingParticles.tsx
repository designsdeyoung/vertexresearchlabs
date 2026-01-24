import { useEffect, useRef } from "react";

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

const FloatingParticles = ({ count = 50, className = "" }: FloatingParticlesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing particles
    container.innerHTML = "";

    // Create particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      
      // Random size between 1-4px
      const size = Math.random() * 3 + 1;
      
      // Random position
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Random animation duration between 15-40s
      const duration = Math.random() * 25 + 15;
      
      // Random delay
      const delay = Math.random() * -20;
      
      // Random opacity between 0.1-0.4
      const opacity = Math.random() * 0.3 + 0.1;

      particle.className = "absolute rounded-full bg-primary pointer-events-none";
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        opacity: ${opacity};
        animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
      `;

      container.appendChild(particle);
    }
  }, [count]);

  return (
    <>
      <style>{`
        @keyframes floatParticle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: var(--particle-opacity, 0.2);
          }
          25% {
            transform: translate(10px, -20px) scale(1.1);
            opacity: calc(var(--particle-opacity, 0.2) * 1.5);
          }
          50% {
            transform: translate(-5px, -40px) scale(0.9);
            opacity: var(--particle-opacity, 0.2);
          }
          75% {
            transform: translate(-15px, -20px) scale(1.05);
            opacity: calc(var(--particle-opacity, 0.2) * 0.8);
          }
        }
      `}</style>
      <div
        ref={containerRef}
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        aria-hidden="true"
      />
    </>
  );
};

export default FloatingParticles;
