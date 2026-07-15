import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, FlaskConical } from "lucide-react";
import { products } from "@/data/products";
import { SITEWIDE_SALE } from "@/config/sale";
import { productGradient } from "@/lib/productVisuals";

/** Curated best-sellers with compliant compound-class descriptors
 *  (no benefit/treatment claims — research-use language only). */
const FEATURED: { id: string; blurb: string }[] = [
  { id: "klow", blurb: "GHK-Cu · BPC-157 · TB-500 · KPV blend" },
  { id: "glp3", blurb: "GIP/GLP-1/GCG triagonist peptide" },
  { id: "ghk-cu", blurb: "Copper tripeptide reference standard" },
  { id: "nad-plus-1000", blurb: "Coenzyme reference material" },
  { id: "semax", blurb: "Heptapeptide reference standard" },
  { id: "mots-c", blurb: "Mitochondrial-derived peptide" },
];

const formatPrice = (p: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p);

const FeaturedPeptides = () => {
  const railRef = useRef<HTMLDivElement>(null);

  const featured = FEATURED.map(({ id, blurb }) => {
    const product = products.find((p) => p.id === id);
    return product ? { product, blurb } : null;
  }).filter(Boolean) as { product: (typeof products)[number]; blurb: string }[];

  const scrollNext = () => {
    railRef.current?.scrollBy({ left: 280, behavior: "smooth" });
  };

  return (
    <section aria-label="Featured peptides" className="relative bg-cream py-16 md:py-24">
      <div className="container mx-auto px-6">
        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-navy/50">
              Best Sellers
            </p>
            <h2 className="font-display text-3xl font-black tracking-tight text-navy md:text-4xl">
              Featured Peptides
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#products"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors hover:text-tierblue"
            >
              View All
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Scroll to more featured peptides"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-navy/15 bg-white text-navy shadow-boutique transition-all duration-200 hover:-translate-y-0.5 hover:shadow-boutique-lift md:flex"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll-snap rail */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-cream to-transparent md:w-16" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-cream to-transparent md:w-16" aria-hidden />

        <div
          ref={railRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 scroll-px-6 md:px-[max(1.5rem,calc((100vw-1400px)/2+2rem))] md:scroll-px-[max(1.5rem,calc((100vw-1400px)/2+2rem))] [scrollbar-width:thin] [scrollbar-color:hsl(var(--navy)/0.2)_transparent]"
        >
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
                transition={{ duration: 0.45, delay: Math.min(i * 0.06, 0.3), ease: "easeOut" }}
                className="snap-start"
              >
                <Link
                  to={`/product/${product.id}`}
                  className="group flex h-full w-[230px] flex-col rounded-card border border-navy/5 bg-white shadow-boutique transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-boutique-lift sm:w-[250px]"
                >
                  {/* Image zone */}
                  <div
                    className="relative h-[180px] overflow-hidden rounded-t-card"
                    style={{ background: productGradient(product.category) }}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={`${displayName} ${product.size} research vial`}
                        loading="lazy"
                        className="h-full w-full scale-[1.45] object-contain transition-transform duration-200 ease-out group-hover:scale-[1.5]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FlaskConical size={36} className="text-navy/25" />
                      </div>
                    )}
                    {product.isNew && (
                      <span className="absolute left-3 top-3 rounded-md bg-navy px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white">
                        New
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col gap-1.5 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/45">
                      by Vertex Research Labs
                    </p>
                    <h3 className="font-display text-base font-bold tracking-tight text-navy transition-colors group-hover:text-tierblue">
                      {displayName}
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-navy/50">
                      {product.size} · ≥99% purity
                    </p>
                    <p className="line-clamp-2 text-xs leading-relaxed text-navy/60">
                      {blurb}
                    </p>

                    <div className="mt-auto flex items-baseline gap-2 pt-2">
                      <span className="font-display text-lg font-black tabular-nums tracking-tight text-navy">
                        {formatPrice(salePrice)}
                      </span>
                      {SITEWIDE_SALE.active && (
                        <span className="text-xs text-navy/40 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>

                    <span className="mt-2 inline-flex h-9 items-center justify-center rounded-full bg-navy text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors duration-200 group-hover:bg-navy-soft">
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
