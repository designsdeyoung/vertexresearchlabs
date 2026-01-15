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
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }}
      />

      {/* Glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="container relative z-10 mx-auto px-6 py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-8 animate-fade-up opacity-0">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground tracking-wide uppercase">
              Research Use Only
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight mb-6 animate-fade-up opacity-0 stagger-1">
            High-Purity Peptide
            <span className="block gradient-text">Reference Materials</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 animate-fade-up opacity-0 stagger-2">
            Analytical-grade peptides for laboratory research applications. 
            Verified purity. Comprehensive documentation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up opacity-0 stagger-3">
            <Button variant="hero" size="lg" asChild>
              <a href="#products">View Products</a>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href="#quality">Quality Standards</a>
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-fade-in opacity-0 stagger-5">
            <a 
              href="#products"
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-xs tracking-wide uppercase">Explore</span>
              <ArrowDown size={16} className="animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
