import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-60"
        style={{ background: "var(--gradient-hero)" }}
      />

      {/* Subtle grid pattern - reduced opacity on mobile */}
      <div
        className="absolute inset-0 opacity-[0.015] md:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[200px] md:h-[400px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 py-20 sm:py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary/50 border border-border/50 mb-6 sm:mb-8 animate-fade-up opacity-0">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            <span className="text-xs text-muted-foreground tracking-wide uppercase">
              Research Use Only
            </span>
          </div>

          {/* Main heading - responsive text with better stacking */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight mb-4 sm:mb-6 animate-fade-up opacity-0 stagger-1">
            <span className="block">High-Purity Peptide</span>
            <span className="block gradient-text">Research Materials</span>
          </h1>

          {/* Subheading - improved mobile readability */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8 sm:mb-10 animate-fade-up opacity-0 stagger-2 px-2 sm:px-0">
            Analytical-grade peptides for laboratory research applications.
            Verified purity. Comprehensive documentation.
          </p>

          {/* CTA Buttons - larger touch targets on mobile */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-up opacity-0 stagger-3 px-4 sm:px-0">
            <Button
              variant="hero"
              size="lg"
              asChild
              className="w-full sm:w-auto min-h-[48px] text-base"
            >
              <a href="#products">View Products</a>
            </Button>
            <Button
              variant="heroOutline"
              size="lg"
              asChild
              className="w-full sm:w-auto min-h-[48px] text-base"
            >
              <a href="#quality">Quality Standards</a>
            </Button>
          </div>

          {/* Scroll indicator - hidden on very small screens */}
          <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 animate-fade-in opacity-0 stagger-5 hidden sm:block">
            <a
              href="#products"
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md p-2"
              aria-label="Scroll to products section"
            >
              <span className="text-xs tracking-wide uppercase">Explore</span>
              <ArrowDown size={16} className="animate-bounce" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;