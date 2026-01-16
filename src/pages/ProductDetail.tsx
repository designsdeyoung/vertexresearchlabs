import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useInquiryCart } from "@/contexts/InquiryCartContext";
import { toast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  FileText, 
  FlaskConical, 
  Shield, 
  Plus, 
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ExternalLink
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem, openCart } = useInquiryCart();
  
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
            <Button variant="hero" onClick={() => navigate("/")}>
              Return to Catalog
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { name, subtitle, description, purity, testing, documentation, intendedUse, disclaimer, image, category, coa, references } = product;

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Added to inquiry",
      description: `${name} has been added to your list.`,
    });
    openCart();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Back button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-8 -ml-2"
            onClick={() => navigate("/#products")}
          >
            <ArrowLeft size={16} />
            Back to Catalog
          </Button>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square rounded-xl overflow-hidden bg-secondary/30 border border-border/50">
                {image ? (
                  <img 
                    src={image} 
                    alt={name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FlaskConical size={80} className="text-muted-foreground/30" />
                  </div>
                )}
              </div>
              
              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-xs text-muted-foreground uppercase tracking-wider">
                  {category}
                </span>
              </div>

              {/* Purity badge */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm text-primary font-medium">{purity}</span>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Title */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <FlaskConical size={24} className="text-primary" />
                  <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                    {name}
                  </h1>
                </div>
                {subtitle && (
                  <span className="text-sm text-muted-foreground">({subtitle})</span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-8">
                {description}
              </p>

              {/* Specifications Card */}
              <div className="glass-card rounded-lg p-6 mb-6">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Shield size={16} className="text-primary" />
                  Specifications
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Purity</span>
                    <span className="text-foreground font-mono">{purity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Testing</span>
                    <span className="text-foreground text-right max-w-[60%]">{testing}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Documentation</span>
                    <span className="text-foreground text-right max-w-[60%]">{documentation}</span>
                  </div>
                </div>
              </div>

              {/* Intended Use */}
              <div className="glass-card rounded-lg p-6 mb-6">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-primary" />
                  Intended Use
                </h2>
                <p className="text-muted-foreground">{intendedUse}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <Plus size={18} />
                  Add to Inquiry
                </Button>
                
                {coa && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="heroOutline" size="lg" className="flex-1">
                        <FileText size={18} />
                        View COA
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <FileText size={20} className="text-primary" />
                          Certificate of Analysis - {name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <img 
                          src={coa} 
                          alt={`Certificate of Analysis for ${name}`}
                          className="w-full h-auto rounded-lg border border-border"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <AlertTriangle size={16} className="text-destructive/70 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">{disclaimer}</p>
              </div>
            </div>
          </div>

          {/* Peer-reviewed Publications Section */}
          {references && references.length > 0 && (
            <div className="mt-16">
              <div className="glass-card rounded-xl p-8">
                <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <BookOpen size={20} className="text-primary" />
                  Peer-reviewed Publications
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  The following peer-reviewed publications are provided for general scientific context. 
                  Vertex Research Labs does not claim or imply any specific use, outcome, or application of these compounds. 
                  All materials are supplied for laboratory research use only.
                </p>
                <div className="space-y-4">
                  {references.map((ref, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      <h3 className="text-sm font-medium text-foreground mb-1">
                        {ref.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {ref.authors} • <span className="text-primary">{ref.journal}</span> ({ref.year})
                      </p>
                      <a 
                        href={`https://doi.org/${ref.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline cursor-pointer"
                      >
                        <span>DOI: {ref.doi}</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
