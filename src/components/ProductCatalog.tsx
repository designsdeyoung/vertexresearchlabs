import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

const ProductCatalog = () => {
  return (
    <section id="products" className="py-24 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container relative z-10 mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
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

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="animate-fade-up opacity-0"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-12">
          <Button variant="heroOutline" size="lg">
            View Full Catalog
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
