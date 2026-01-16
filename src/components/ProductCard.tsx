import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, FlaskConical, Plus } from "lucide-react";
import { useInquiryCart } from "@/contexts/InquiryCartContext";
import type { Product } from "@/data/products";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { name, subtitle, size, price, description, purity, testing, documentation, intendedUse, disclaimer, image, category } = product;
  const { addItem, openCart } = useInquiryCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Added to inquiry",
      description: `${name} has been added to your list.`,
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
            <span className="text-lg font-semibold text-primary">{formatPrice(price)}</span>
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

        {/* Intended Use */}
        <div className="pt-4 border-t border-border/50 mb-4">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
            Intended Use
          </h4>
          <p className="text-xs text-muted-foreground">{intendedUse}</p>
        </div>

        {/* Disclaimer */}
        <div className="mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <p className="text-[10px] text-muted-foreground/60 italic">{disclaimer}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
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
            Add to Inquiry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
