import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  FileText, 
  Download, 
  FlaskConical,
  CheckCircle2,
  Calendar,
  Building2,
  Hash,
  QrCode,
  ChevronRight,
  BarChart3
} from "lucide-react";
import { products } from "@/data/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Sample COA data with summaries
const coaData = [
  {
    productId: "ghk-cu",
    lotNumber: "CGM-003",
    purity: "99.62%",
    method: "HPLC with UV Detection / Mass Spectrometry",
    date: "September 19, 2025",
    lab: "Freedom Diagnostics",
    sampleId: "2509180004",
    hasHPLC: true,
    hasLCMS: true,
  },
  {
    productId: "retatrutide",
    lotNumber: "258042",
    purity: "99.899%",
    method: "HPLC with UV Detection / Mass Spectrometry",
    date: "January 9, 2026",
    lab: "Freedom Diagnostics",
    sampleId: "2601080069",
    hasHPLC: true,
    hasLCMS: true,
  },
  {
    productId: "tb-500",
    lotNumber: "CGM-002",
    purity: "99.24%",
    method: "HPLC with UV Detection / Mass Spectrometry",
    date: "September 19, 2025",
    lab: "Freedom Diagnostics",
    sampleId: "2509180003",
    hasHPLC: true,
    hasLCMS: true,
  },
  {
    productId: "bpc-157",
    lotNumber: "CGM-002",
    purity: "99.24%",
    method: "HPLC with UV Detection / Mass Spectrometry",
    date: "September 19, 2025",
    lab: "Freedom Diagnostics",
    sampleId: "2509180003",
    hasHPLC: true,
    hasLCMS: true,
  },
];

const TestingCOAs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCOAs = coaData.filter(coa => {
    const product = products.find(p => p.id === coa.productId);
    const searchLower = searchQuery.toLowerCase();
    return (
      product?.name.toLowerCase().includes(searchLower) ||
      coa.lotNumber.toLowerCase().includes(searchLower) ||
      coa.sampleId.includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/quality" className="hover:text-foreground transition-colors">Quality</Link>
            <ChevronRight size={14} />
            <span className="text-foreground">Testing & COAs</span>
          </div>

          {/* Hero */}
          <div className="max-w-3xl mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Testing & Certificates of Analysis
            </h1>
            <p className="text-lg text-muted-foreground">
              Every batch is independently tested. Search by product name, lot number, or sample ID to access full analytical documentation including chromatograms and mass spectra.
            </p>
          </div>

          {/* Search Section */}
          <div className="glass-card rounded-xl p-6 mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by product, lot number, or sample ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <QrCode size={18} />
                Scan QR Code
              </Button>
            </div>
          </div>

          {/* COA Results */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">
              {searchQuery ? `Results for "${searchQuery}"` : "Recent Certificates"}
            </h2>
            
            {filteredCOAs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>No certificates found matching your search.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredCOAs.map((coa, index) => {
                  const product = products.find(p => p.id === coa.productId);
                  if (!product) return null;
                  
                  return (
                    <div key={index} className="glass-card rounded-xl p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <FlaskConical size={20} className="text-primary" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">Lot: {coa.lotNumber}</p>
                            </div>
                          </div>
                          
                          {/* Summary Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-primary" />
                              <div>
                                <p className="text-xs text-muted-foreground">Purity</p>
                                <p className="text-sm font-mono font-medium text-foreground">{coa.purity}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Test Date</p>
                                <p className="text-sm text-foreground">{coa.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building2 size={16} className="text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Laboratory</p>
                                <p className="text-sm text-foreground">{coa.lab}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Hash size={16} className="text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Sample ID</p>
                                <p className="text-sm font-mono text-foreground">{coa.sampleId}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 col-span-2">
                              <BarChart3 size={16} className="text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Method</p>
                                <p className="text-sm text-foreground">{coa.method}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col gap-3 lg:w-48">
                          {product.coa && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="hero" size="sm" className="w-full">
                                  <FileText size={16} />
                                  View COA
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <FileText size={20} className="text-primary" />
                                    Certificate of Analysis - {product.name}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="mt-4">
                                  <img 
                                    src={product.coa} 
                                    alt={`Certificate of Analysis for ${product.name}`}
                                    className="w-full h-auto rounded-lg border border-border"
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          
                          <div className="flex gap-2">
                            {coa.hasHPLC && (
                              <Button variant="outline" size="sm" className="flex-1 text-xs">
                                HPLC
                              </Button>
                            )}
                            {coa.hasLCMS && (
                              <Button variant="outline" size="sm" className="flex-1 text-xs">
                                LC-MS
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Understanding COAs */}
          <div className="mt-16 glass-card rounded-xl p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Understanding Your COA</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-foreground mb-2">What's Included</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary mt-1 flex-shrink-0" />
                    <span>Purity percentage determined by HPLC analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary mt-1 flex-shrink-0" />
                    <span>Mass spectrometry confirmation of molecular identity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary mt-1 flex-shrink-0" />
                    <span>Full chromatogram showing separation profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary mt-1 flex-shrink-0" />
                    <span>Lot-specific tracking and traceability</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">Testing Methods</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <BarChart3 size={14} className="text-muted-foreground mt-1 flex-shrink-0" />
                    <span><strong>HPLC:</strong> High-Performance Liquid Chromatography for purity analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BarChart3 size={14} className="text-muted-foreground mt-1 flex-shrink-0" />
                    <span><strong>LC-MS:</strong> Liquid Chromatography-Mass Spectrometry for identity confirmation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BarChart3 size={14} className="text-muted-foreground mt-1 flex-shrink-0" />
                    <span><strong>UV Detection:</strong> Ultraviolet detection for compound quantification</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TestingCOAs;