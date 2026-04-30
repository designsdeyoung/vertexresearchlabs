import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container mx-auto px-6 pb-24 pt-32 md:pt-40">
        <div className="mx-auto max-w-[700px] text-center">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
            Research Grade Materials
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl">
            High-Purity Peptide Research Materials
          </h1>
          <p className="mx-auto mt-5 max-w-[520px] text-base leading-relaxed text-muted-foreground">
            Analytical-grade research compounds. Independent third-party testing.
            Certificate of Analysis available for every product.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 min-w-[180px] bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <a href="#products">Browse Catalog</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 min-w-[180px] border-border bg-transparent text-foreground hover:bg-card"
            >
              <a href="/quality">Quality Standards</a>
            </Button>
          </div>

          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            Research Use Only
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
