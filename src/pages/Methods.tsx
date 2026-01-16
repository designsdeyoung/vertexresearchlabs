import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  ChevronRight,
  FlaskConical,
  Shield,
  Thermometer,
  Droplets,
  Bug,
  Snowflake,
  Beaker,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

const Methods = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/quality" className="hover:text-foreground transition-colors">Quality</Link>
            <ChevronRight size={14} />
            <span className="text-foreground">Testing Methods</span>
          </div>

          {/* Hero */}
          <div className="max-w-3xl mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Analytical Testing Methods
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive overview of the analytical methods used to verify identity, purity, and quality of research materials.
            </p>
          </div>

          {/* Testing Methods Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* Identity Testing */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <FlaskConical size={24} className="text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Identity Testing</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Confirms that the material matches its claimed molecular structure and composition.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">Mass Spectrometry (MS)</span>
                    <p className="text-muted-foreground">Determines molecular weight and fragmentation pattern to confirm compound identity</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">LC-MS/MS</span>
                    <p className="text-muted-foreground">Tandem mass spectrometry for enhanced specificity and structural confirmation</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Purity Testing */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Shield size={24} className="text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Purity Testing</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Quantifies the percentage of target compound and identifies any impurities present.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">HPLC (High-Performance Liquid Chromatography)</span>
                    <p className="text-muted-foreground">Primary method for purity determination, typically achieving ≥99% detection accuracy</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">UV Detection</span>
                    <p className="text-muted-foreground">Ultraviolet absorbance for compound quantification at specific wavelengths</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Residual Solvents */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Droplets size={24} className="text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Residual Solvents</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Screens for trace organic solvents that may remain from synthesis processes.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">GC-MS (Gas Chromatography-Mass Spectrometry)</span>
                    <p className="text-muted-foreground">Detects and quantifies volatile organic compounds to ICH Q3C limits</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Endotoxin Testing */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Thermometer size={24} className="text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Endotoxin Testing</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Available for select products requiring sterility verification for research applications.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">LAL (Limulus Amebocyte Lysate)</span>
                    <p className="text-muted-foreground">Standard method for detecting bacterial endotoxin contamination</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Microbial Testing */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Bug size={24} className="text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Microbial Testing</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Bioburden assessment when applicable to product specifications.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">Total Aerobic Microbial Count (TAMC)</span>
                    <p className="text-muted-foreground">Quantifies viable bacteria and fungi per gram of material</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">Total Yeast/Mold Count (TYMC)</span>
                    <p className="text-muted-foreground">Specific enumeration of fungal contamination</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Appearance & Physical */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Beaker size={24} className="text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Physical Characterization</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Visual and physical property verification for each lot.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">Appearance</span>
                    <p className="text-muted-foreground">Color, form, and consistency verification against specifications</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">Net Peptide Content</span>
                    <p className="text-muted-foreground">Actual active peptide weight accounting for moisture and salts</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Storage & Stability */}
          <div className="glass-card rounded-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Snowflake size={24} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Storage & Stability Guidelines</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-foreground mb-3">Lyophilized (Powder) Form</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    Store at -20°C for long-term stability (recommended)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    2-8°C acceptable for short-term storage (weeks)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    Protect from light and moisture
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    Allow vial to reach room temperature before opening
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-foreground mb-3">Reconstitution (Research Use)</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    Use bacteriostatic water or sterile saline
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    Add diluent slowly along vial wall
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    Gently swirl—do not shake vigorously
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    Store reconstituted solutions at 2-8°C
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Research Use Disclaimer */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <AlertTriangle size={18} className="text-destructive/70 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              All testing methods and storage guidance are provided for laboratory research reference only. These materials are not intended for human or veterinary use.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Methods;