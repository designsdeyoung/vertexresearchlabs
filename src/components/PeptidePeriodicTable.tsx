import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowRight, 
  FlaskConical, 
  Search, 
  X, 
  ShoppingCart,
  CheckCircle2,
  Sparkles 
} from "lucide-react";
import { useInquiryCart } from "@/contexts/InquiryCartContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";

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
  { id: "kisspeptin", symbol: "KSP", category: "hormonal", researchFocus: "GPR54 ligand research" },
  { id: "tesamorelin", symbol: "TSM", category: "hormonal", researchFocus: "GHRH analog peptide analysis" },
  { id: "pt-141", symbol: "PT1", category: "melanocortin", researchFocus: "Melanocortin receptor studies" },
  { id: "mt2", symbol: "MT2", category: "melanocortin", researchFocus: "Alpha-MSH analog research" },
  { id: "dsip", symbol: "DSP", category: "neuroactive", researchFocus: "Delta sleep-inducing peptide studies", isNew: true },
  { id: "epithalon", symbol: "EPT", category: "longevity", researchFocus: "Telomerase-related peptide research", isNew: true },
];

const categoryColors: Record<string, { bg: string; border: string; text: string; badge: string; glow: string }> = {
  structural: {
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    border: "border-amber-500/30 hover:border-amber-500/60",
    text: "text-amber-700 dark:text-amber-400",
    badge: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
    glow: "hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)]",
  },
  neuroactive: {
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    border: "border-blue-500/30 hover:border-blue-500/60",
    text: "text-blue-700 dark:text-blue-400",
    badge: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
    glow: "hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]",
  },
  metabolic: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    border: "border-emerald-500/30 hover:border-emerald-500/60",
    text: "text-emerald-700 dark:text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
    glow: "hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]",
  },
  hormonal: {
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    border: "border-purple-500/30 hover:border-purple-500/60",
    text: "text-purple-700 dark:text-purple-400",
    badge: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
    glow: "hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]",
  },
  melanocortin: {
    bg: "bg-orange-500/10 dark:bg-orange-500/20",
    border: "border-orange-500/30 hover:border-orange-500/60",
    text: "text-orange-700 dark:text-orange-400",
    badge: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
    glow: "hover:shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)]",
  },
  longevity: {
    bg: "bg-yellow-500/10 dark:bg-yellow-500/20",
    border: "border-yellow-500/30 hover:border-yellow-500/60",
    text: "text-yellow-700 dark:text-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
    glow: "hover:shadow-[0_0_20px_-5px_rgba(234,179,8,0.4)]",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { addItem } = useInquiryCart();
  const isMobile = useIsMobile();

  // Intersection Observer for staggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Filter peptides based on search and category
  const filteredElements = useMemo(() => {
    return peptideElements.filter((element) => {
      const product = products.find((p) => p.id === element.id);
      if (!product) return false;

      const matchesSearch =
        searchQuery === "" ||
        element.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.researchFocus.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === null || element.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleAddToInquiry = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const product = products.find((p) => p.id === productId);
    if (product) {
      addItem(product);
      toast({
        title: "Added to inquiry",
        description: `${product.name} added to your research inquiry.`,
      });
      setOpenPopoverId(null);
    }
  };

  const categories = Object.keys(categoryLabels);

  const renderCardContent = (element: typeof peptideElements[0], product: typeof products[0]) => {
    const colors = categoryColors[element.category];
    return (
      <div className="space-y-3">
        {/* Header with Image */}
        <div className="flex items-start gap-3">
          {product.image && (
            <div className="w-16 h-16 rounded-lg bg-muted/50 overflow-hidden flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-foreground truncate">{product.name}</h4>
              {"isNew" in element && element.isNew && (
                <Badge className="bg-primary/20 text-primary border-primary/30 flex-shrink-0">
                  <Sparkles size={10} className="mr-1" />
                  NEW
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{product.size}</p>
          </div>
        </div>

        {/* Category Badge */}
        <Badge variant="secondary" className={`text-xs ${colors.badge}`}>
          {categoryLabels[element.category]}
        </Badge>

        {/* Research Focus */}
        <p className="text-sm text-muted-foreground">
          {element.researchFocus}
        </p>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <CheckCircle2 size={10} className="mr-1 text-emerald-500" />
            {product.purity} Purity
          </Badge>
          <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
            In Stock
          </Badge>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-lg font-bold text-primary">
            ${product.price}
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3"
              onClick={(e) => handleAddToInquiry(e, product.id)}
            >
              <ShoppingCart size={14} className="mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* View Details Link */}
        <Link 
          to={`/product/${element.id}`}
          className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
        >
          <span>View Details</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <FlaskConical size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">Research Compound Library</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Peptide Periodic Table
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our complete catalog of research-grade peptides. {isMobile ? "Tap" : "Hover"} for details or click to view full specifications.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-6">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search peptides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(null)}
            className="rounded-full"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(activeCategory === category ? null : category)}
              className={`rounded-full transition-all ${
                activeCategory === category ? "" : categoryColors[category].badge
              }`}
            >
              {categoryLabels[category]}
            </Button>
          ))}
        </div>

        {/* Periodic Table Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3 md:gap-4">
          {filteredElements.map((element, index) => {
            const product = products.find((p) => p.id === element.id);
            if (!product) return null;

            const colors = categoryColors[element.category];
            const elementIndex = peptideElements.findIndex((e) => e.id === element.id);

            const tileContent = (
              <div
                className={`
                  group relative flex flex-col items-center justify-center
                  aspect-square rounded-xl border-2 transition-all duration-300
                  ${colors.bg} ${colors.border} ${colors.glow}
                  hover:scale-105 cursor-pointer
                  ${isVisible ? "animate-periodic-tile-in" : "opacity-0"}
                `}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* Element Number */}
                <span className="absolute top-1.5 left-2 text-[10px] font-mono text-muted-foreground">
                  {(elementIndex + 1).toString().padStart(2, "0")}
                </span>

                {/* NEW Badge on tile */}
                {"isNew" in element && element.isNew && (
                  <span className="absolute top-1 right-1">
                    <Sparkles size={12} className="text-primary" />
                  </span>
                )}

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
              </div>
            );

            // Mobile: Use Popover (click to open)
            if (isMobile) {
              return (
                <Popover
                  key={element.id}
                  open={openPopoverId === element.id}
                  onOpenChange={(open) => setOpenPopoverId(open ? element.id : null)}
                >
                  <PopoverTrigger asChild>
                    {tileContent}
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-4" side="top" sideOffset={8}>
                    <button
                      onClick={() => setOpenPopoverId(null)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={16} />
                    </button>
                    {renderCardContent(element, product)}
                  </PopoverContent>
                </Popover>
              );
            }

            // Desktop: Use HoverCard
            return (
              <HoverCard key={element.id} openDelay={100} closeDelay={50}>
                <HoverCardTrigger asChild>
                  <Link to={`/product/${element.id}`}>
                    {tileContent}
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4" side="top" sideOffset={8}>
                  {renderCardContent(element, product)}
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>

        {/* No Results Message */}
        {filteredElements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No peptides found matching your search.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory(null);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Category Legend */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
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