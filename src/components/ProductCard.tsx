import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, FlaskConical, Plus, Sparkles, Package, Zap, Repeat } from "lucide-react";
import { useInquiryCart } from "@/contexts/InquiryCartContext";
import { THREE_PACK_DISCOUNT, AUTOSHIP_DISCOUNT } from "@/contexts/InquiryCartContext";
import { SITEWIDE_SALE } from "@/config/sale";
import { calculatePointsForPrice } from "@/hooks/useRewards";
import type { Product } from "@/data/products";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { name, subtitle, size, price, description, purity, testing, documentation, intendedUse, disclaimer, image, category } = product;
  const { addItem, add3Pack, openCart } = useInquiryCart();
  const [isAutoship, setIsAutoship] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const salePrice = SITEWIDE_SALE.active ? price * (1 - SITEWIDE_SALE.discount) : price;
  const autoshipUnitPrice = salePrice * (1 - AUTOSHIP_DISCOUNT);
  const threePackUnitPrice = salePrice * (1 - THREE_PACK_DISCOUNT) * (isAutoship ? (1 - AUTOSHIP_DISCOUNT) : 1);
  const threePackTotal = threePackUnitPrice * 3;
  const singleDisplayPrice = isAutoship ? autoshipUnitPrice : salePrice;

  const handleAddToCart = () => {
    addItem(product, { isAutoship });
    toast({
      title: isAutoship ? "Autoship added" : "Added to cart",
      description: isAutoship
        ? `${name} — ships every 30 days, 10% off + 2× points.`
        : `${name} has been added to your list.`,
    });
    openCart();
  };

  const handleAdd3Pack = () => {
    add3Pack(product, { isAutoship });
    toast({
      title: isAutoship ? "Autoship 3-Pack added" : "3-Pack added!",
      description: `${name} × 3 added with 10% savings${isAutoship ? " + 10% autoship" : ""}.`,
    });
    openCart();
  };

  return (
    <div className="glass-card glass-card-hover rounded-lg overflow-hidden flex flex-col h-full group">
      {/* Product Image */}
      {image && (
        <div className="relative aspect-square overflow-hidden bg-secondary/30">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {category}
            </span>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-xs text-primary font-medium">{purity}</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Category tag (shown if no image) */}
        {!image && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {category}
            </span>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-xs text-primary font-medium">{purity}</span>
            </div>
          </div>
        )}

        {/* Product name */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical size={16} className="text-primary" />
            <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300">
              {name}
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{size} • {subtitle}</span>
            <div className="flex items-center gap-2">
              {(product.originalPrice || SITEWIDE_SALE.active || isAutoship) && (
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice || price)}</span>
              )}
              <span className="text-lg font-semibold text-primary">{formatPrice(singleDisplayPrice)}</span>
              {SITEWIDE_SALE.active && (
                <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">-{SITEWIDE_SALE.discount * 100}%</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Sparkles size={10} className="text-primary/70" />
            <span className="text-[10px] text-primary/70 font-medium">
              Earn {calculatePointsForPrice(singleDisplayPrice) * (isAutoship ? 2 : 1)} pts{isAutoship ? " (2×)" : ""}
            </span>
          </div>
        </div>

        {/* Subscribe & Save toggle */}
        <div className="mb-3 p-3 rounded-lg border border-border/60 bg-secondary/20">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsAutoship(false)}
              className={`text-left p-2 rounded-md border transition-all ${
                !isAutoship
                  ? "border-primary bg-primary/10"
                  : "border-border/40 bg-background/30 hover:border-border"
              }`}
            >
              <div className="text-xs font-semibold text-foreground">One-time</div>
              <div className="text-[10px] text-muted-foreground">{formatPrice(salePrice)}</div>
            </button>
            <button
              type="button"
              onClick={() => setIsAutoship(true)}
              className={`text-left p-2 rounded-md border transition-all ${
                isAutoship
                  ? "border-primary bg-primary/10 shadow-[0_0_12px_-2px_hsl(var(--primary)/0.5)]"
                  : "border-border/40 bg-background/30 hover:border-border"
              }`}
            >
              <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                <Repeat size={11} /> Subscribe
              </div>
              <div className="text-[10px] text-muted-foreground">
                {formatPrice(autoshipUnitPrice)} • every 30d • 2× pts
              </div>
            </button>
          </div>
        </div>

        {/* 3-Pack Upgrade */}
        <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-1.5 mb-1">
            <Package size={14} className="text-primary" />
            <span className="text-xs font-semibold text-primary">
              3-Pack — Save {SITEWIDE_SALE.active ? '~19%' : '10%'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              3 × {formatPrice(threePackUnitPrice)}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground line-through">{formatPrice(price * 3)}</span>
              <span className="text-sm font-semibold text-primary">{formatPrice(threePackTotal)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {description}
        </p>

        {/* Specifications */}
        <div className="space-y-2 pt-4 border-t border-border/50 mb-4">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
            Specifications
          </h4>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Purity</span>
            <span className="text-foreground font-mono text-xs">{purity}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Testing</span>
            <span className="text-foreground text-xs text-right max-w-[60%]">{testing}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Documentation</span>
            <span className="text-foreground text-xs text-right max-w-[60%]">{documentation}</span>
          </div>
        </div>

        {/* Key Highlights */}
        <div className="pt-4 border-t border-border/50 mb-4">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
            Highlights
          </h4>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Lyophilized Powder</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Third-Party Tested</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Ships Same Day</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <p className="text-[10px] text-muted-foreground/60 italic">{disclaimer}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="flex-1 text-xs" asChild>
              <Link to={`/product/${product.id}`}>
                <ExternalLink size={14} />
                Details
              </Link>
            </Button>
            <Button 
              variant="catalog" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={handleAddToCart}
            >
              <Plus size={14} />
              Add to Cart
            </Button>
          </div>
          <Button 
            variant="heroOutline" 
            size="sm" 
            className="w-full text-xs"
            onClick={handleAdd3Pack}
          >
            <Package size={14} />
            Add 3-Pack & Save 10%
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
