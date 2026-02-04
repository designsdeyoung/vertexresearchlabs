import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const aminoAcids = [
  { label: "Gly", name: "Glycine", color: "hsl(var(--primary))" },
  { label: "His", name: "Histidine", color: "hsl(195 100% 60%)" },
  { label: "Lys", name: "Lysine", color: "hsl(195 100% 50%)" },
  { label: "Cu", name: "Copper", color: "hsl(30 80% 55%)" },
];

const MoleculeBuilder = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-primary mb-3">
            Peptide Synthesis
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground leading-tight">
            Precision
            <span className="block gradient-text">Molecular Assembly</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mt-4">
            Every peptide is synthesized with exacting precision, ensuring proper amino acid sequencing and bond formation.
          </p>
        </motion.div>

        {/* Molecule Builder Animation */}
        <div
          ref={containerRef}
          className="relative flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px]"
          aria-hidden="true"
        >
          {/* Peptide chain container */}
          <div className="flex items-center justify-center gap-0 flex-wrap">
            {aminoAcids.map((acid, index) => (
              <div key={acid.label} className="flex items-center">
                {/* Bond line (before amino acid, except first) */}
                {index > 0 && (
                  <motion.div
                    className="relative h-1 w-8 md:w-12 lg:w-16 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: index * 0.4 - 0.15, duration: 0.1 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary"
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{
                        delay: index * 0.4 - 0.1,
                        duration: 0.2,
                        ease: "easeOut",
                      }}
                    />
                    {/* Bond glow */}
                    <motion.div
                      className="absolute inset-0 bg-primary/30 blur-sm"
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{
                        delay: index * 0.4 - 0.1,
                        duration: 0.2,
                        ease: "easeOut",
                      }}
                    />
                  </motion.div>
                )}

                {/* Amino acid block */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{
                    delay: index * 0.4,
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  {/* Glow behind block */}
                  <motion.div
                    className="absolute inset-0 rounded-xl blur-xl"
                    style={{ backgroundColor: acid.color }}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 0.3 } : { opacity: 0 }}
                    transition={{ delay: index * 0.4 + 0.2, duration: 0.3 }}
                  />
                  
                  {/* Main block */}
                  <div
                    className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl border-2 flex flex-col items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    style={{
                      borderColor: acid.color,
                      backgroundColor: `color-mix(in srgb, ${acid.color} 10%, transparent)`,
                    }}
                  >
                    <span
                      className="text-lg md:text-xl lg:text-2xl font-bold"
                      style={{ color: acid.color }}
                    >
                      {acid.label}
                    </span>
                    <span className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                      {acid.name}
                    </span>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Complete state glow effect */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: aminoAcids.length * 0.4 + 0.3, duration: 0.5 }}
          >
            <motion.div
              className="w-full max-w-md h-32 bg-primary/10 rounded-full blur-3xl"
              animate={isInView ? {
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              } : {}}
              transition={{
                delay: aminoAcids.length * 0.4 + 0.5,
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Completion label */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: aminoAcids.length * 0.4 + 0.4, duration: 0.5 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30"
              animate={isInView ? {
                boxShadow: [
                  "0 0 0 0 rgba(0, 180, 216, 0)",
                  "0 0 20px 5px rgba(0, 180, 216, 0.3)",
                  "0 0 0 0 rgba(0, 180, 216, 0)",
                ],
              } : {}}
              transition={{
                delay: aminoAcids.length * 0.4 + 0.6,
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                GHK-Cu Peptide Assembled
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MoleculeBuilder;
