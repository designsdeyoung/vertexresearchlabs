import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  FileText,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Mail,
} from "lucide-react";

const TestingCOAs = () => {
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
              Our reference materials are independently tested at ≥99% purity (HPLC).
              Certificates of Analysis are available on request where applicable —
              contact us to request available documentation.
            </p>
          </div>

          {/* Request CTA */}
          <div className="glass-card rounded-xl p-8 mb-12">
            <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <FileText size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">
                    Requesting a Certificate of Analysis
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-xl">
                    Where a Certificate of Analysis is available for a product, we are
                    happy to share it. Email us with the product you're interested in
                    and we'll send any available documentation.
                  </p>
                </div>
              </div>
              <Button variant="hero" size="lg" asChild className="shrink-0">
                <a href="mailto:info@vertexresearchlabs.com?subject=COA Request">
                  <Mail size={18} />
                  Request a COA
                </a>
              </Button>
            </div>
          </div>

          {/* Understanding COAs */}
          <div className="glass-card rounded-xl p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Understanding a COA</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-foreground mb-2">What a COA Can Include</h3>
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
                    <span>A chromatogram showing the separation profile</span>
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
