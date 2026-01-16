import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertTriangle, FlaskConical, ShieldAlert, CheckCircle2 } from "lucide-react";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-destructive/10">
              <ShieldAlert size={28} className="text-destructive" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
              Disclaimer
            </h1>
          </div>
          
          <div className="space-y-6">
            {/* Main Disclaimer */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <FlaskConical size={24} className="text-primary" />
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Vertex Research Labs provides research-grade materials intended solely for laboratory research and analytical purposes.
                  </p>
                  <p>
                    All products sold by Vertex Research Labs are not for human consumption or veterinary use. Products are not intended for diagnosis, treatment, cure, mitigation, or prevention of any disease or medical condition, and have not been approved for such uses.
                  </p>
                  <p>
                    The information presented on this website is provided for general informational purposes only. Nothing on this site should be interpreted as medical, pharmaceutical, clinical, or scientific advice, nor should it be relied upon to make health-related decisions.
                  </p>
                </div>
              </div>
            </div>

            {/* Purchaser Representations */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Purchaser Representations</h2>
              <p className="text-muted-foreground mb-4">
                By purchasing products from Vertex Research Labs or requesting information through this website, the purchaser represents and warrants that:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    The products will be used exclusively for legitimate laboratory research purposes.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    The purchaser is a qualified individual or institution authorized to handle research materials.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    The products will not be used in or on humans or animals, directly or indirectly.
                  </span>
                </li>
              </ul>
            </div>

            {/* No Warranties */}
            <div className="glass-card rounded-xl p-6">
              <p className="text-muted-foreground">
                Vertex Research Labs makes no representations or warranties, express or implied, regarding the safety, efficacy, performance, or outcomes of any product for human or animal use.
              </p>
            </div>

            {/* Acceptance */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
              <AlertTriangle size={18} className="text-destructive/70 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Use of this website and purchase of any products constitutes acceptance of this disclaimer and all related policies, including the{" "}
                <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Disclaimer;