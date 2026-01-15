import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, FlaskConical, Info } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { name, subtitle, description, purity, testing, documentation, intendedUse, disclaimer, image, category } = product;

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
          {subtitle && (
            <span className="text-xs text-muted-foreground">({subtitle})</span>
          )}
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
          <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50 border border-border">
            <Info size={14} className="text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">{disclaimer}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <Button variant="ghost" size="sm" className="flex-1 text-xs">
            <FileText size={14} />
            COA
          </Button>
          <Button variant="catalog" size="sm" className="flex-1 text-xs">
            <ExternalLink size={14} />
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
