import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronDown, FlaskConical, Package } from "lucide-react";
import { useInquiryCart, AUTOSHIP_DISCOUNT, THREE_PACK_DISCOUNT, THREE_PACK_AUTOSHIP_INTERVAL_DAYS } from "@/contexts/InquiryCartContext";
import { SITEWIDE_SALE } from "@/config/sale";
import type { Product } from "@/data/products";
import { toast } from "@/hooks/use-toast";
import { productGradient } from "@/lib/productVisuals";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  const { addItem, add3Pack, openCart } = useInquiryCart();
  const [subOpen, setSubOpen] = useState(false);

  const salePrice = SITEWIDE_SALE.active ? price * (1 - SITEWIDE_SALE.discount) : price;
  const subPrice = salePrice * (1 - AUTOSHIP_DISCOUNT);
  const threePackUnit = salePrice * (1 - THREE_PACK_DISCOUNT);
  const threePackTotal = threePackUnit * 3;
  const savings = price - salePrice;

  const handleAdd = (autoship: boolean) => {
    addItem(selected, { isAutoship: autoship });
    toast({
      title: autoship ? "Subscription added" : "Added to cart",
      description: `${name} ${size}`,
    });
    openCart();
  };

  const handle3Pack = () => {
    add3Pack(selected, { isAutoship: false });
    toast({ title: "3-Pack added", description: `${name} × 3` });
    openCart();
  };

  const handle3PackSubscribe = () => {
    add3Pack(selected, { isAutoship: true, intervalDays: THREE_PACK_AUTOSHIP_INTERVAL_DAYS });
    toast({ title: "3-Pack subscription added", description: `${name} × 3 · every 90 days` });
    openCart();
  };

  // 3-Pack on subscribe: 3-pack discount + autoship discount stacked
  const threePackSubUnit = threePackUnit * (1 - AUTOSHIP_DISCOUNT);
  const threePackSubTotal = threePackSubUnit * 3;

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

        {/* Deal ribbon — bracket-accented, dispensary style */}
        {!selected.outOfStock && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-deal px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-boutique">
            <span aria-hidden="true" className="text-white/70">[</span>
            Deal · 3 for {formatPrice(threePackTotal)}
            <span aria-hidden="true" className="text-white/70">]</span>
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
          onClick={() => handleAdd(false)}
          disabled={selected.outOfStock}
          className="h-11 w-full rounded-full bg-navy text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-200 hover:bg-navy-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {selected.outOfStock ? "Out of Stock" : "Add to Research Order"}
        </Button>

        {/* 3-Pack quick add (hidden when out of stock) */}
        {!selected.outOfStock && (
          <Button
            variant="outline"
            onClick={handle3Pack}
            className="h-10 w-full justify-between rounded-full border-navy/15 bg-cream/60 px-4 text-xs font-semibold text-navy hover:bg-cream hover:text-navy"
          >
            <span className="inline-flex items-center gap-1.5">
              <Package size={13} className="text-deal" />
              3-Pack — Save 10%
            </span>
            <span className="font-mono tabular-nums text-navy">{formatPrice(threePackTotal)}</span>
          </Button>
        )}

        {/* Subscribe accordion (hidden when out of stock) */}
        {!selected.outOfStock && (
        <Collapsible open={subOpen} onOpenChange={setSubOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md py-1.5 text-xs text-navy/55 transition-colors hover:text-navy">
            <span>Subscribe & save extra 10% (stacks with 3-Pack discount)</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${subOpen ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="mt-2 space-y-2 rounded-xl border border-navy/10 bg-cream/60 p-3">
              {/* 30-day single */}
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-navy/50">Single · every 30 days</p>
                <p className="text-xs text-navy/60">
                  <span className="font-mono font-medium text-navy">{formatPrice(subPrice)}</span>{" "}
                  / 30 days · Cancel anytime
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAdd(true)}
                  className="h-9 w-full rounded-full border-navy/25 text-navy hover:bg-navy/5 hover:text-navy"
                >
                  Subscribe — {formatPrice(subPrice)}/mo
                </Button>
              </div>

              {/* Divider */}
              <div className="border-t border-navy/10" />

              {/* 90-day 3-Pack */}
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-deal">3-Pack · every 90 days</p>
                <p className="text-xs text-navy/60">
                  <span className="font-mono font-medium text-navy">{formatPrice(threePackSubTotal)}</span>{" "}
                  / 90 days · {formatPrice(threePackSubUnit)} ea · Stacks 3-Pack 10% + Subscribe 10%
                </p>
                <Button
                  size="sm"
                  onClick={handle3PackSubscribe}
                  className="h-9 w-full rounded-full bg-navy text-white hover:bg-navy-soft"
                >
                  <Package size={13} className="mr-1.5" />
                  Subscribe 3-Pack — {formatPrice(threePackSubTotal)}/90d
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
