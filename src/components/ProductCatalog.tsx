import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";

const products = [
  {
    name: "BPC-157",
    sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    purity: "≥98%",
    cas: "137525-51-0",
    molecularWeight: "1419.53",
    category: "Peptide"
  },
  {
    name: "TB-500",
    sequence: "Ac-LKKTETQ",
    purity: "≥99%",
    cas: "77591-33-4",
    molecularWeight: "891.04",
    category: "Peptide"
  },
  {
    name: "GHK-Cu",
    sequence: "Gly-His-Lys-Cu",
    purity: "≥98%",
    cas: "49557-75-7",
    molecularWeight: "403.93",
    category: "Copper Peptide"
  },
  {
    name: "Epithalon",
    sequence: "Ala-Glu-Asp-Gly",
    purity: "≥99%",
    cas: "307297-39-8",
    molecularWeight: "390.35",
    category: "Tetrapeptide"
  },
  {
    name: "Selank",
    sequence: "Thr-Lys-Pro-Arg-Pro-Gly-Pro",
    purity: "≥98%",
    cas: "129954-34-3",
    molecularWeight: "751.88",
    category: "Heptapeptide"
  },
  {
    name: "NAD+",
    purity: "≥99%",
    cas: "53-84-9",
    molecularWeight: "663.43",
    category: "Coenzyme"
  },
  {
    name: "LL-37",
    sequence: "LLGDFFRKSKEKIGKEFKRIVQRIKDFLRNLVPRTES",
    purity: "≥95%",
    cas: "154947-66-7",
    molecularWeight: "4493.33",
    category: "Antimicrobial Peptide"
  },
  {
    name: "KPV",
    sequence: "Lys-Pro-Val",
    purity: "≥99%",
    cas: "67727-97-3",
    molecularWeight: "342.44",
    category: "Tripeptide"
  }
];

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
              key={product.name}
              className="animate-fade-up opacity-0"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <ProductCard {...product} />
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
