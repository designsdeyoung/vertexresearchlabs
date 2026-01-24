import { CheckCircle, FileCheck, Microscope, Shield } from "lucide-react";
import FloatingParticles from "./FloatingParticles";

const qualityPoints = [
  {
    icon: Microscope,
    title: "HPLC Analysis",
    description: "All products verified via high-performance liquid chromatography"
  },
  {
    icon: FileCheck,
    title: "Certificate of Analysis",
    description: "Comprehensive COA provided with every reference material"
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Strict quality control protocols throughout production"
  },
  {
    icon: CheckCircle,
    title: "Purity Verified",
    description: "Mass spectrometry confirmation of molecular identity"
  }
];

const QualitySection = () => {
  return (
    <section id="quality" className="py-24 relative overflow-hidden">
      {/* Floating particles */}
      <FloatingParticles count={25} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <span className="text-xs text-primary uppercase tracking-widest mb-4 block">
              Standards & Documentation
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Analytical Quality
              <span className="block text-muted-foreground">You Can Verify</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Every reference material ships with complete analytical documentation 
              including Certificate of Analysis, HPLC chromatograms, and mass 
              spectrometry data. Our quality protocols ensure consistency and 
              traceability for your research applications.
            </p>

            {/* Quality points */}
            <div className="grid sm:grid-cols-2 gap-6">
              {qualityPoints.map((point, index) => (
                <div 
                  key={point.title}
                  className="flex items-start gap-4 animate-fade-up opacity-0"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <point.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-1">
                      {point.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div className="relative">
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              
              {/* Sample COA representation */}
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <span className="text-sm text-muted-foreground">Document</span>
                  <span className="text-sm font-medium text-foreground">Certificate of Analysis</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Accession Number</span>
                    <span className="text-sm font-mono text-foreground">2509180004</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Product</span>
                    <span className="text-sm font-mono text-foreground">GHK-Cu/TB-500/BPC-157</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Lot</span>
                    <span className="text-sm font-mono text-foreground">CGM-003</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">HPLC Purity</span>
                    <span className="text-sm font-mono text-primary">99.62%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">MS Confirmed</span>
                    <span className="text-sm font-mono text-primary">✓ Pass</span>
                  </div>
                </div>

                {/* Visual bar representation */}
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Purity Analysis (HPLC-MS)</span>
                    <span className="text-xs text-primary">99.62%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                      style={{ width: '99.62%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
