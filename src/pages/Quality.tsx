import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, FileCheck, FlaskConical, AlertTriangle } from "lucide-react";

const Quality = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-8">
            Quality and Certificates of Analysis
          </h1>
          
          <p className="text-muted-foreground mb-12 text-lg">
            Vertex Research Labs is committed to providing high-quality research-grade materials supported by analytical verification.
          </p>
          
          <div className="space-y-8">
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Shield size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Quality Standards</h2>
                  <p className="text-muted-foreground">
                    Products are sourced and supplied with a focus on purity, consistency, and proper documentation.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <FlaskConical size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Analytical Verification</h2>
                  <p className="text-muted-foreground">
                    Independent analytical testing is used to verify product identity and purity.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <FileCheck size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Certificates of Analysis (COA)</h2>
                  <p className="text-muted-foreground">
                    Certificates of Analysis are available upon request for applicable products and provide detailed analytical information.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <AlertTriangle size={24} className="text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Research Use Only</h2>
                  <p className="text-muted-foreground">
                    All products are supplied strictly for laboratory research applications and are not intended for human or veterinary use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Quality;
