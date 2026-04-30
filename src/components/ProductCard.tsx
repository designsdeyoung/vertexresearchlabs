import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, FlaskConical, Package } from "lucide-react";
import { useInquiryCart, AUTOSHIP_DISCOUNT, THREE_PACK_DISCOUNT, THREE_PACK_AUTOSHIP_INTERVAL_DAYS } from "@/contexts/InquiryCartContext";
import { SITEWIDE_SALE } from "@/config/sale";
import type { Product } from "@/data/products";
import { toast } from "@/hooks/use-toast";
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
    <article
      className="group flex h-full flex-col rounded-xl border border-border bg-card transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Image */}
      <Link
        to={`/product/${selected.id}`}
        className="relative block h-[200px] overflow-hidden rounded-t-xl bg-background/40"
        aria-label={`View ${name} ${size} details`}
      >
        {image ? (
          <img
            src={image}
            alt={`${name} ${size} research material`}
            loading="lazy"
            className={`h-full w-full object-contain object-center scale-[1.6] transition-transform duration-300 group-hover:scale-[1.7] ${selected.outOfStock ? "opacity-40 grayscale" : ""}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FlaskConical size={48} className="text-muted-foreground/30" />
          </div>
        )}
        {selected.outOfStock && (
          <span className="absolute left-3 top-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-400">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Badges */}
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider text-primary">
            ≥99% Purity
          </span>
          <span className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {category}
          </span>
        </div>

        {/* Name */}
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">
            <Link to={`/product/${selected.id}`} className="hover:text-primary transition-colors">
              {name}
            </Link>
          </h3>
          {subtitle && (
            <p className="text-[13px] text-muted-foreground line-clamp-1">{subtitle}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {size} · Research Grade
          </p>
        </div>

        {/* Size variant pills */}
        {allVariants.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {allVariants.map((v) => {
              const active = v.id === selected.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedId(v.id)}
                  aria-pressed={active}
                  className={`rounded-md border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                    active
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-border bg-transparent text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-display text-xl font-bold text-primary">
            {formatPrice(salePrice)}
          </span>
          {SITEWIDE_SALE.active && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(price)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <Button
          onClick={() => handleAdd(false)}
          disabled={selected.outOfStock}
          className="h-10 w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {selected.outOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>

        {/* 3-Pack quick add (hidden when out of stock) */}
        {!selected.outOfStock && (
          <Button
            variant="outline"
            onClick={handle3Pack}
            className="h-9 w-full justify-between border-primary/30 bg-primary/5 px-3 text-xs text-foreground hover:bg-primary/10 hover:text-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <Package size={13} className="text-primary" />
              3-Pack — Save 10%
            </span>
            <span className="font-mono text-primary">{formatPrice(threePackTotal)}</span>
          </Button>
        )}

        {/* Subscribe accordion (hidden when out of stock) */}
        {!selected.outOfStock && (
        <Collapsible open={subOpen} onOpenChange={setSubOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md py-1.5 text-xs text-muted-foreground transition-colors hover:text-primary">
            <span>Subscribe & save extra 10% (stacks with 3-Pack & sale)</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${subOpen ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="mt-2 space-y-2 rounded-md border border-border bg-background/40 p-3">
              {/* 30-day single */}
              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Single · every 30 days</p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-mono font-medium text-foreground">{formatPrice(subPrice)}</span>{" "}
                  / 30 days · Cancel anytime
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAdd(true)}
                  className="h-9 w-full border-primary/40 text-primary hover:bg-primary/10 hover:text-primary"
                >
                  Subscribe — {formatPrice(subPrice)}/mo
                </Button>
              </div>

              {/* Divider */}
              <div className="border-t border-border/60" />

              {/* 90-day 3-Pack */}
              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-wider text-primary">3-Pack · every 90 days</p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-mono font-medium text-foreground">{formatPrice(threePackSubTotal)}</span>{" "}
                  / 90 days · {formatPrice(threePackSubUnit)} ea · Stacks 3-Pack 10% + Subscribe 10%
                </p>
                <Button
                  size="sm"
                  onClick={handle3PackSubscribe}
                  className="h-9 w-full bg-primary/90 text-primary-foreground hover:bg-primary"
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
