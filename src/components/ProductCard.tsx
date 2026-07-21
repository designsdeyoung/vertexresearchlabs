import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FlaskConical } from "lucide-react";
import { useInquiryCart } from "@/contexts/InquiryCartContext";
import { SITEWIDE_SALE } from "@/config/sale";
import type { Product } from "@/data/products";
import { toast } from "@/hooks/use-toast";
import { productGradient } from "@/lib/productVisuals";

interface ProductCardProps {
  product: Product;
  /** All variants in the same group (including `product`). When length > 1,
   *  size selector pills are shown and switching swaps image, price, and the
   *  underlying product used for cart + detail link. */
  variants?: Product[];
}

const formatPrice = (p: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p);

/** Show the "Low stock — order soon" badge when this many units or fewer remain. */
const LOW_STOCK_THRESHOLD = 5;

/** Colored-dot spec pill (dispensary-style badge). */
const SpecPill = ({ dotClass, label }: { dotClass: string; label: string }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-navy/10 bg-cream/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-navy/70">
    <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
    {label}
  </span>
);

const ProductCard = ({ product, variants }: ProductCardProps) => {
  const allVariants =
    variants && variants.length > 0 ? variants : [product];
  const [selectedId, setSelectedId] = useState(product.id);
  const selected =
    allVariants.find((v) => v.id === selectedId) ?? allVariants[0];

  const { name, subtitle, size, price, image, category } = selected;
  const { addItem, openCart } = useInquiryCart();

  const salePrice = SITEWIDE_SALE.active ? price * (1 - SITEWIDE_SALE.discount) : price;
  const savings = price - salePrice;

  const handleAdd = () => {
    addItem(selected);
    toast({
      title: "Added to cart",
      description: `${name} ${size}`,
    });
    openCart();
  };

  return (
    <article className="group flex h-full flex-col rounded-card border border-navy/5 bg-white shadow-boutique transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-boutique-lift">
      {/* Image zone */}
      <Link
        to={`/product/${selected.id}`}
        className="relative block aspect-square max-h-[240px] w-full overflow-hidden rounded-t-card"
        style={{ background: productGradient(category) }}
        aria-label={`View ${name} ${size} details`}
      >
        {image ? (
          <img
            src={image}
            alt={`${name} ${size} research material`}
            loading="lazy"
            className={`h-full w-full scale-[1.5] object-contain object-center transition-transform duration-200 ease-out group-hover:scale-[1.55] ${selected.outOfStock ? "opacity-40 grayscale" : ""}`}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
            <FlaskConical size={28} className="text-navy/30" />
            <span className="font-display text-lg font-black leading-tight tracking-tight text-navy/60">
              {name}
            </span>
          </div>
        )}

        {selected.isNew && !selected.outOfStock && (
          <span className="absolute left-3 top-3 rounded-md bg-tierblue px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-boutique">
            New
          </span>
        )}
        {selected.outOfStock && (
          <span className="absolute left-3 top-3 rounded-md bg-navy/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        {/* Byline + name */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-navy/45">
            by Vertex Research Labs
          </p>
          <h3 className="mt-1 font-display text-lg font-bold leading-snug tracking-tight text-navy">
            <Link to={`/product/${selected.id}`} className="transition-colors hover:text-tierblue">
              {name}
            </Link>
          </h3>
          {subtitle && (
            <p className="text-xs text-navy/55 line-clamp-1">{subtitle}</p>
          )}
        </div>

        {/* Spec pills */}
        <div className="flex flex-wrap gap-1.5">
          <SpecPill dotClass="bg-tiergreen" label={`${selected.purity} Purity`} />
          <SpecPill dotClass="bg-tierblue" label="Lab Tested" />
          <SpecPill dotClass="bg-deal" label="COA on Request" />
        </div>

        {/* Size chips (variant selector when grouped, static chip otherwise) */}
        {allVariants.length > 1 ? (
          <div className="flex flex-wrap gap-1.5">
            {allVariants.map((v) => {
              const active = v.id === selected.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedId(v.id)}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors duration-200 ${
                    active
                      ? "border-navy bg-navy text-white"
                      : "border-navy/15 bg-transparent text-navy/60 hover:border-navy/40 hover:text-navy"
                  }`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            <span className="inline-flex rounded-full border border-navy/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-navy/60">
              {size} vial
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <span className="font-display text-2xl font-black tabular-nums tracking-tight text-navy">
            {formatPrice(salePrice)}
          </span>
          {SITEWIDE_SALE.active && (
            <>
              <span className="text-sm text-navy/40 line-through">
                {formatPrice(price)}
              </span>
              <span className="rounded-full bg-deal px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Save {formatPrice(savings)}
              </span>
            </>
          )}
        </div>

        {/* Low stock warning */}
        {!selected.outOfStock &&
          selected.stock !== undefined &&
          selected.stock > 0 &&
          selected.stock <= LOW_STOCK_THRESHOLD && (
            <p className="flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-deal">
              <AlertTriangle size={12} className="shrink-0" />
              Low stock — order soon
            </p>
          )}

        {/* Add to cart */}
        <Button
          onClick={handleAdd}
          disabled={selected.outOfStock}
          className="h-11 w-full rounded-full bg-navy text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-200 hover:bg-navy-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {selected.outOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
