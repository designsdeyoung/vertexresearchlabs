import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  ChevronRight,
  Package,
  Hash,
  Archive,
  CheckSquare,
  Shield,
  Building2,
  Award,
  Camera,
  Thermometer,
  Box,
  Tag
} from "lucide-react";

const ChainOfCustody = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Peptide Chain of Custody | Batch Tracking & Traceability Documentation"
        description="Full batch traceability for every Vertex Research Labs peptide. Lot numbers, storage records, independent testing chain, and complete documentation from synthesis to delivery."
        canonical="/quality/chain-of-custody"
        keywords={[
          "peptide batch tracking",
          "peptide lot number",
          "research peptide traceability",
          "peptide chain of custody",
          "peptide documentation",
          "research peptide batch record",
        ]}
      />
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/quality" className="hover:text-foreground transition-colors">Quality</Link>
            <ChevronRight size={14} />
            <span className="text-foreground">Chain of Custody</span>
          </div>

          {/* Hero */}
          <div className="max-w-3xl mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Chain of Custody & Batch Controls
            </h1>
            <p className="text-lg text-muted-foreground">
              Full traceability from synthesis to delivery. Every lot is documented, tested, and traceable.
            </p>
          </div>

          {/* Lot Numbering System */}
          <div className="glass-card rounded-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Hash size={24} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Lot Numbering System</h2>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Each product lot receives a unique identifier that tracks it through testing, storage, and fulfillment.
            </p>
            
            <div className="bg-secondary/30 rounded-lg p-6 border border-border/50">
              <div className="font-mono text-lg text-foreground mb-4">
                Example: <span className="text-primary">CGM-003</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Prefix:</span>
                  <p className="text-foreground">Supplier/source identifier</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Number:</span>
                  <p className="text-foreground">Sequential batch identifier</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tracking:</span>
                  <p className="text-foreground">Links to COA, retention sample, and order history</p>
                </div>
              </div>
            </div>
          </div>

          {/* Retention Samples */}
          <div className="glass-card rounded-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Archive size={24} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Retention Samples</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-muted-foreground mb-4">
                  A portion of each manufactured lot is retained for future reference, re-testing, or dispute resolution.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Shield size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    Stored under controlled conditions (-20°C)
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    Retained for minimum 2 years post-release
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    Available for re-analysis upon request
                  </li>
                </ul>
              </div>
              <div className="bg-secondary/30 rounded-lg p-6 border border-border/50">
                <h4 className="font-medium text-foreground mb-3">Retention Protocol</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• 10% of lot or minimum 100mg retained</p>
                  <p>• Sealed and labeled with lot number</p>
                  <p>• Storage logged with temperature monitoring</p>
                  <p>• Chain of custody documented</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pass/Fail Criteria */}
          <div className="glass-card rounded-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <CheckSquare size={24} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Pass/Fail Criteria</h2>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Every lot must meet strict specifications before release. Lots that fail any criteria are quarantined and not distributed.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-foreground font-medium">Parameter</th>
                    <th className="text-left py-3 px-4 text-foreground font-medium">Specification</th>
                    <th className="text-left py-3 px-4 text-foreground font-medium">Method</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Purity</td>
                    <td className="py-3 px-4 font-mono">≥98.0%</td>
                    <td className="py-3 px-4">HPLC</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Identity</td>
                    <td className="py-3 px-4">Confirmed</td>
                    <td className="py-3 px-4">LC-MS</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Appearance</td>
                    <td className="py-3 px-4">White to off-white lyophilized powder</td>
                    <td className="py-3 px-4">Visual</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Net Peptide Content</td>
                    <td className="py-3 px-4 font-mono">≥80%</td>
                    <td className="py-3 px-4">Amino Acid Analysis</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Documentation</td>
                    <td className="py-3 px-4">Complete COA on file</td>
                    <td className="py-3 px-4">Review</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Third-Party Verification */}
          <div className="glass-card rounded-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Award size={24} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Third-Party Verification</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-foreground mb-3">Independent Laboratory Partner</h3>
                <div className="bg-secondary/30 rounded-lg p-5 border border-border/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 size={20} className="text-primary" />
                    <span className="font-medium text-foreground">Freedom Diagnostics</span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• ISO-certified analytical laboratory</li>
                    <li>• LCMS/MS and HPLC capabilities</li>
                    <li>• US-based facility</li>
                    <li>• Searchable COA database</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-foreground mb-3">Testing Frequency</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Shield size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <span><strong className="text-foreground">Every lot:</strong> Identity and purity verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <span><strong className="text-foreground">Initial qualification:</strong> Full panel on new suppliers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <span><strong className="text-foreground">Periodic:</strong> Stability checks on retained samples</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Facility Standards */}
          <div className="glass-card rounded-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Package size={24} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Facility Standards</h2>
            </div>
            
            <p className="text-muted-foreground mb-6">
              While we do not claim GMP certification, we maintain strict handling protocols to ensure product integrity.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-secondary/30 rounded-lg border border-border/50">
                <Thermometer size={32} className="mx-auto mb-3 text-primary" />
                <h4 className="font-medium text-foreground mb-2">Cold Chain</h4>
                <p className="text-sm text-muted-foreground">Temperature-controlled storage and shipping with ice packs</p>
              </div>
              <div className="text-center p-6 bg-secondary/30 rounded-lg border border-border/50">
                <Box size={32} className="mx-auto mb-3 text-primary" />
                <h4 className="font-medium text-foreground mb-2">Clean Handling</h4>
                <p className="text-sm text-muted-foreground">Dedicated workspace with contamination controls</p>
              </div>
              <div className="text-center p-6 bg-secondary/30 rounded-lg border border-border/50">
                <Tag size={32} className="mx-auto mb-3 text-primary" />
                <h4 className="font-medium text-foreground mb-2">Labeling</h4>
                <p className="text-sm text-muted-foreground">Clear lot tracking and research-use labels on all products</p>
              </div>
            </div>
          </div>

          {/* Facility Photos Placeholder */}
          <div className="glass-card rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Camera size={24} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Our Facility</h2>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Real photos of our workbench, packaging station, labeling process, and cold pack preparation.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Workbench", "Packaging", "Labeling", "Cold Packs"].map((label, index) => (
                <div key={index} className="aspect-square bg-secondary/50 rounded-lg border border-border/50 flex items-center justify-center">
                  <div className="text-center">
                    <Camera size={24} className="mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Photo gallery coming soon
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ChainOfCustody;