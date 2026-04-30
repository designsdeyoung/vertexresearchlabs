import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, FlaskConical } from "lucide-react";
import { useInquiryCart, AUTOSHIP_DISCOUNT } from "@/contexts/InquiryCartContext";
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
}

const formatPrice = (p: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p);

const ProductCard = ({ product }: ProductCardProps) => {
  const { name, subtitle, size, price, purity, image, category } = product;
  const { addItem, openCart } = useInquiryCart();
  const [subOpen, setSubOpen] = useState(false);

  const salePrice = SITEWIDE_SALE.active ? price * (1 - SITEWIDE_SALE.discount) : price;
  const subPrice = salePrice * (1 - AUTOSHIP_DISCOUNT);

  const handleAdd = (autoship: boolean) => {
    addItem(product, { isAutoship: autoship });
    toast({
      title: autoship ? "Subscription added" : "Added to cart",
      description: `${name} ${size}`,
    });
    openCart();
  };

  return (
    <article
      className="group flex h-full flex-col rounded-xl border border-border bg-card transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Image */}
      <Link
        to={`/product/${product.id}`}
        className="relative block h-[200px] overflow-hidden rounded-t-xl bg-background/40"
        aria-label={`View ${name} details`}
      >
        {image ? (
          <img
            src={image}
            alt={`${name} ${size} research material`}
            loading="lazy"
            className="h-full w-full object-contain p-6"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FlaskConical size={48} className="text-muted-foreground/30" />
          </div>
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
            <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
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
          className="h-10 w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Add to Cart
        </Button>

        {/* Subscribe accordion */}
        <Collapsible open={subOpen} onOpenChange={setSubOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md py-1.5 text-xs text-muted-foreground transition-colors hover:text-primary">
            <span>Subscribe & save 10%</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${subOpen ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="mt-2 space-y-2 rounded-md border border-border bg-background/40 p-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-mono font-medium text-foreground">
                  {formatPrice(subPrice)}
                </span>{" "}
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
          </CollapsibleContent>
        </Collapsible>
      </div>
    </article>
  );
};

export default ProductCard;
