import { Link } from "react-router-dom";
import { products } from "@/data/products";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FlaskConical } from "lucide-react";

// Define peptide element data with symbols and categories
const peptideElements = [
  { id: "ghk-cu", symbol: "GHK", category: "structural", researchFocus: "Copper peptide binding studies" },
  { id: "retatrutide", symbol: "RET", category: "metabolic", researchFocus: "Triple receptor agonist research" },
  { id: "bpc-157", symbol: "BPC", category: "structural", researchFocus: "Body protection compound studies" },
  { id: "tb-500", symbol: "TB4", category: "structural", researchFocus: "Thymosin beta-4 fragment analysis" },
  { id: "semax", symbol: "SMX", category: "neuroactive", researchFocus: "ACTH analog peptide research" },
  { id: "selank", symbol: "SLK", category: "neuroactive", researchFocus: "Tuftsin analog studies" },
  { id: "nad-plus", symbol: "NAD", category: "metabolic", researchFocus: "Coenzyme metabolism research" },
  { id: "mots-c", symbol: "MOT", category: "metabolic", researchFocus: "Mitochondrial-derived peptide studies" },
  { id: "slu-pp-332", symbol: "SLU", category: "metabolic", researchFocus: "ERR agonist compound research" },
  { id: "sermorelin", symbol: "SRM", category: "hormonal", researchFocus: "GHRH analog studies" },
  { id: "kisspeptin", symbol: "KSP", category: "hormonal", researchFocus: "GPR54 ligand research" },
  { id: "tesamorelin", symbol: "TSM", category: "hormonal", researchFocus: "GHRH analog peptide analysis" },
  { id: "pt-141", symbol: "PT1", category: "melanocortin", researchFocus: "Melanocortin receptor studies" },
  { id: "mt2", symbol: "MT2", category: "melanocortin", researchFocus: "Alpha-MSH analog research" },
  { id: "dsip", symbol: "DSP", category: "neuroactive", researchFocus: "Delta sleep-inducing peptide studies" },
  { id: "epithalon", symbol: "EPT", category: "longevity", researchFocus: "Telomerase-related peptide research" },
];

const categoryColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  structural: {
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    border: "border-amber-500/30 hover:border-amber-500/60",
    text: "text-amber-700 dark:text-amber-400",
    badge: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  },
  neuroactive: {
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    border: "border-blue-500/30 hover:border-blue-500/60",
    text: "text-blue-700 dark:text-blue-400",
    badge: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  metabolic: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    border: "border-emerald-500/30 hover:border-emerald-500/60",
    text: "text-emerald-700 dark:text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
  },
  hormonal: {
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    border: "border-purple-500/30 hover:border-purple-500/60",
    text: "text-purple-700 dark:text-purple-400",
    badge: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  melanocortin: {
    bg: "bg-orange-500/10 dark:bg-orange-500/20",
    border: "border-orange-500/30 hover:border-orange-500/60",
    text: "text-orange-700 dark:text-orange-400",
    badge: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
  },
  longevity: {
    bg: "bg-yellow-500/10 dark:bg-yellow-500/20",
    border: "border-yellow-500/30 hover:border-yellow-500/60",
    text: "text-yellow-700 dark:text-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
};

const categoryLabels: Record<string, string> = {
  structural: "Structural",
  neuroactive: "Neuroactive",
  metabolic: "Metabolic",
  hormonal: "Hormonal",
  melanocortin: "Melanocortin",
  longevity: "Longevity",
};

const PeptidePeriodicTable = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <FlaskConical size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">Research Compound Library</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Peptide Periodic Table
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our complete catalog of research-grade peptides. Hover for details or click to view full specifications.
          </p>
        </div>

        {/* Category Legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <div
              key={key}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${categoryColors[key].badge}`}
            >
              <span className="w-2 h-2 rounded-full bg-current opacity-60" />
              {label}
            </div>
          ))}
        </div>

        {/* Periodic Table Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
          {peptideElements.map((element, index) => {
            const product = products.find((p) => p.id === element.id);
            if (!product) return null;

            const colors = categoryColors[element.category];

            return (
              <HoverCard key={element.id} openDelay={100} closeDelay={50}>
                <HoverCardTrigger asChild>
                  <Link
                    to={`/product/${element.id}`}
                    className={`
                      group relative flex flex-col items-center justify-center
                      aspect-square rounded-xl border-2 transition-all duration-300
                      ${colors.bg} ${colors.border}
                      hover:scale-105 hover:shadow-lg cursor-pointer
                      animate-fade-up
                    `}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    {/* Element Number */}
                    <span className="absolute top-1.5 left-2 text-[10px] font-mono text-muted-foreground">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>

                    {/* Symbol */}
                    <span className={`text-xl md:text-2xl font-bold ${colors.text}`}>
                      {element.symbol}
                    </span>

                    {/* Name */}
                    <span className="text-[10px] md:text-xs text-muted-foreground mt-0.5 truncate w-full text-center px-1">
                      {product.name.split(" ")[0]}
                    </span>

                    {/* Size */}
                    <span className="text-[9px] text-muted-foreground/70 mt-0.5">
                      {product.size}
                    </span>
                  </Link>
                </HoverCardTrigger>

                <HoverCardContent 
                  className="w-72 p-4"
                  side="top"
                  sideOffset={8}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">{product.size}</p>
                      </div>
                      <Badge variant="secondary" className={`text-xs ${categoryColors[element.category].badge}`}>
                        {categoryLabels[element.category]}
                      </Badge>
                    </div>

                    {/* Research Focus */}
                    <p className="text-sm text-muted-foreground">
                      {element.researchFocus}
                    </p>

                    {/* Purity Badge */}
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Purity: {product.purity}
                      </Badge>
                      <span className="text-sm font-semibold text-primary">
                        ${product.price}
                      </span>
                    </div>

                    {/* View Details Link */}
                    <div className="flex items-center gap-1 text-sm text-primary font-medium pt-1">
                      <span>View Details</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground mt-8 max-w-2xl mx-auto">
          All materials are supplied exclusively for laboratory research purposes. 
          Not for human consumption or veterinary use.
        </p>
      </div>
    </section>
  );
};

export default PeptidePeriodicTable;
