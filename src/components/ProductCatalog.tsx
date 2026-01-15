import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products } from "@/data/products";
import { Search, X } from "lucide-react";

const ProductCatalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats.sort();
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== null;

  return (
    <section id="products" className="py-24 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container relative z-10 mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-xs text-primary uppercase tracking-widest mb-4 block">
            Reference Materials
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Product Catalog
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            High-purity peptide reference standards with verified analytical documentation.
            For laboratory research use only.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search peptides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-10 h-12 bg-secondary/50 border-border/50 focus:border-primary/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedCategory === null ? "hero" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="text-xs"
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "hero" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Active filters indicator */}
          {hasActiveFilters && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>
                Showing {filteredProducts.length} of {products.length} products
              </span>
              <button
                onClick={clearFilters}
                className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id}
              className="animate-fade-up opacity-0"
              style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No products found matching your criteria.</p>
            <Button variant="heroOutline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* View all button - only show when no filters active */}
        {!hasActiveFilters && (
          <div className="text-center mt-12">
            <Button variant="heroOutline" size="lg">
              View Full Catalog
            </Button>
          </div>
        )}

        {/* Research Use Disclaimer */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs text-muted-foreground/70 leading-relaxed">
              <span className="font-medium text-muted-foreground">Research Use Only:</span> All products supplied by Vertex Research Labs are intended exclusively for laboratory research purposes. These materials are not intended for human or veterinary use, diagnostic applications, therapeutic purposes, or any form of consumption. By purchasing or using our products, you agree to use them solely for legitimate research activities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
