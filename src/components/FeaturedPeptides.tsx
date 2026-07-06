import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FlaskConical } from "lucide-react";
import { products } from "@/data/products";
import { SITEWIDE_SALE } from "@/config/sale";

/** Curated best-sellers with compliant compound-class descriptors
 *  (no benefit/treatment claims — research-use language only). */
const FEATURED: { id: string; blurb: string }[] = [
  { id: "bpc-157", blurb: "Pentadecapeptide reference standard" },
  { id: "klow", blurb: "GHK-Cu · BPC-157 · TB-500 · KPV blend" },
  { id: "retatrutide", blurb: "GIP/GLP-1/GCG triagonist peptide" },
  { id: "ghk-cu", blurb: "Copper tripeptide reference standard" },
  { id: "tb-500", blurb: "Thymosin β4 fragment" },
  { id: "nad-plus-1000", blurb: "Coenzyme reference material" },
  { id: "semax", blurb: "Heptapeptide reference standard" },
  { id: "mots-c", blurb: "Mitochondrial-derived peptide" },
];

const formatPrice = (p: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p);

const FeaturedPeptides = () => {
  const featured = FEATURED.map(({ id, blurb }) => {
    const product = products.find((p) => p.id === id);
    return product ? { product, blurb } : null;
  }).filter(Boolean) as { product: (typeof products)[number]; blurb: string }[];

  return (
    <section aria-label="Featured peptides" className="relative bg-background py-16 md:py-24">
      <div className="container mx-auto px-6">
        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              Best Sellers
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Featured Peptides
            </h2>
          </div>
          <a
            href="#products"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all peptides
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </div>

      {/* Scroll-snap rail */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent md:w-16" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent md:w-16" aria-hidden />

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 scroll-px-6 md:px-[max(1.5rem,calc((100vw-1400px)/2+2rem))] md:scroll-px-[max(1.5rem,calc((100vw-1400px)/2+2rem))] [scrollbar-width:thin] [scrollbar-color:hsl(var(--border))_transparent]">
          {featured.map(({ product, blurb }, i) => {
            const salePrice = SITEWIDE_SALE.active
              ? product.price * (1 - SITEWIDE_SALE.discount)
              : product.price;
            const displayName = product.name.split(" / ")[0];
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.06, 0.3) }}
                className="snap-start"
              >
                <Link
                  to={`/product/${product.id}`}
                  className="group flex h-full w-[230px] flex-col rounded-xl border border-border/70 bg-card/70 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 sm:w-[250px]"
                >
                  {/* Image */}
                  <div className="relative h-[190px] overflow-hidden rounded-t-xl">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_70%,hsl(172_66%_50%/0.10),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={`${displayName} ${product.size} research vial`}
                        loading="lazy"
                        className="h-full w-full scale-[1.55] object-contain transition-transform duration-300 group-hover:scale-[1.65]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FlaskConical size={40} className="text-muted-foreground/30" />
                      </div>
                    )}
                    {product.isNew && (
                      <span className="absolute left-3 top-3 rounded-md border border-primary/40 bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                        New
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col gap-1.5 p-4">
                    <h3 className="font-display text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                      {displayName}
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {product.size} · ≥99% purity
                    </p>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {blurb}
                    </p>

                    <div className="mt-auto flex items-baseline gap-2 pt-2">
                      <span className="font-display text-lg font-bold text-primary">
                        {formatPrice(salePrice)}
                      </span>
                      {SITEWIDE_SALE.active && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>

                    <span className="mt-2 inline-flex h-9 items-center justify-center rounded-md border border-border bg-transparent text-xs font-semibold text-foreground transition-colors group-hover:border-primary/50 group-hover:bg-primary/10 group-hover:text-primary">
                      View Product
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPeptides;
