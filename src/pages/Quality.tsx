import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Shield, 
  FileCheck, 
  FlaskConical, 
  AlertTriangle,
  ChevronRight,
  Search,
  Beaker,
  Package,
  Award,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Quality = () => {
  const qualityPages = [
    {
      title: "Testing & COAs",
      description: "Search certificates by product, lot, or sample ID. View full chromatograms and mass spectra.",
      icon: Search,
      href: "/quality/testing",
      highlight: true
    },
    {
      title: "Testing Methods",
      description: "Identity testing, purity analysis, residual solvents, endotoxin, and microbial testing explained.",
      icon: Beaker,
      href: "/quality/methods"
    },
    {
      title: "Chain of Custody",
      description: "Lot numbering, retention samples, pass/fail criteria, and batch control documentation.",
      icon: Package,
      href: "/quality/chain-of-custody"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Peptide Quality Standards | HPLC Testing, COAs & Batch Documentation"
        description="Every Vertex Research Labs peptide is independently HPLC tested with ≥99% purity verification. View our testing methods, Certificates of Analysis, and chain-of-custody documentation."
        canonical="/quality"
        keywords={[
          "peptide COA",
          "peptide certificate of analysis",
          "HPLC tested peptides",
          "research peptide purity testing",
          "peptide quality standards",
          "99% purity peptides",
          "independent peptide testing",
          "peptide batch documentation",
        ]}
      />
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Hero */}
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield size={28} className="text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                Quality Hub
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Transparency is foundational to research integrity. Access our complete quality documentation, testing methods, and third-party verification data.
            </p>
          </div>
          
          {/* Quick Links Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {qualityPages.map((page) => (
              <Link 
                key={page.href}
                to={page.href}
                className={`glass-card rounded-xl p-6 group hover:border-primary/30 transition-all duration-300 ${
                  page.highlight ? 'ring-1 ring-primary/20' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${page.highlight ? 'bg-primary/20' : 'bg-primary/10'}`}>
                    <page.icon size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                      {page.title}
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {page.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Overview Cards */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-foreground">Our Commitment</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FlaskConical size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Independent Testing</h3>
                    <p className="text-muted-foreground mb-4">
                      Every lot is tested by an independent, ISO-certified laboratory. We don't rely on manufacturer-provided COAs alone.
                    </p>
                    <Link to="/quality/testing" className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                      View certificates <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="glass-card rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileCheck size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Full Documentation</h3>
                    <p className="text-muted-foreground mb-4">
                      Not just purity numbers—access complete chromatograms, mass spectra, and analytical methods for every product.
                    </p>
                    <Link to="/quality/methods" className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                      Learn about methods <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="glass-card rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Award size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Third-Party Verification</h3>
                    <p className="text-muted-foreground mb-4">
                      We partner with Freedom Diagnostics, a US-based analytical laboratory with searchable COA verification.
                    </p>
                    <Link to="/quality/chain-of-custody" className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                      See verification details <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="glass-card rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Package size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Traceability</h3>
                    <p className="text-muted-foreground mb-4">
                      Complete chain of custody from synthesis to delivery. Retention samples maintained for every lot.
                    </p>
                    <Link to="/quality/chain-of-custody" className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                      View batch controls <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 glass-card rounded-xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Looking for a specific COA?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Search our database by product name, lot number, or sample ID to find the exact certificate you need.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/quality/testing">
                <Search size={18} />
                Search Certificates
              </Link>
            </Button>
          </div>

          {/* Research Disclaimer */}
          <div className="mt-8 flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <AlertTriangle size={18} className="text-destructive/70 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Research Use Only:</strong> All products and documentation are provided exclusively for laboratory research purposes. Not intended for human or veterinary use.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Quality;