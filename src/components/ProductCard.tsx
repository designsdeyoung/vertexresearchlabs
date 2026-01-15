import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";

interface ProductCardProps {
  name: string;
  sequence?: string;
  purity: string;
  cas?: string;
  molecularWeight?: string;
  category: string;
}

const ProductCard = ({ 
  name, 
  sequence, 
  purity, 
  cas, 
  molecularWeight,
  category 
}: ProductCardProps) => {
  return (
    <div className="glass-card glass-card-hover rounded-lg p-6 flex flex-col h-full group">
      {/* Category tag */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {category}
        </span>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs text-primary font-medium">{purity}</span>
        </div>
      </div>

      {/* Product name */}
      <h3 className="text-lg font-medium text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
        {name}
      </h3>

      {/* Sequence (if applicable) */}
      {sequence && (
        <p className="text-xs font-mono text-muted-foreground mb-4 break-all">
          {sequence}
        </p>
      )}

      {/* Details */}
      <div className="space-y-2 mt-auto pt-4 border-t border-border/50">
        {cas && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">CAS</span>
            <span className="text-foreground font-mono text-xs">{cas}</span>
          </div>
        )}
        {molecularWeight && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">MW</span>
            <span className="text-foreground font-mono text-xs">{molecularWeight}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
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
  );
};

export default ProductCard;
