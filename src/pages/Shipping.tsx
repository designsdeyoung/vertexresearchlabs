import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Truck, 
  Package, 
  FileText, 
  RotateCcw, 
  AlertTriangle,
  ShieldCheck,
  Mail,
  Phone
} from "lucide-react";

const Shipping = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-8">
            Shipping and Returns
          </h1>
          
          <div className="space-y-8">
            {/* Shipping */}
            <section className="glass-card rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Truck size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Shipping</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Vertex Research Labs ships laboratory research materials to eligible customers in compliance with applicable laws and regulations. Available shipping methods, transit times, and service options may vary based on destination, product type, and order volume.
                    </p>
                    <p>
                      Orders are processed during normal business hours. Once an order has shipped, tracking information will be provided when available. Delivery timelines are estimates only and are not guaranteed.
                    </p>
                    <p>
                      Vertex Research Labs is not responsible for delays caused by carriers, weather conditions, customs processing, or other circumstances outside our control.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Packaging and Handling */}
            <section className="glass-card rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Package size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Packaging and Handling</h2>
                  <p className="text-muted-foreground">
                    All products are packaged using industry-standard materials intended to preserve integrity during transit. Temperature-sensitive items may be shipped with appropriate protective materials when required, depending on product specifications and destination.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Documentation */}
            <section className="glass-card rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <FileText size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Documentation</h2>
                  <p className="text-muted-foreground">
                    Certificates of Analysis and related quality documentation are provided electronically or made available upon request. Documentation is issued for research reference purposes only and corresponds to the specific lot shipped.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Returns and Refunds */}
            <section className="glass-card rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <RotateCcw size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Returns and Refunds</h2>
                  <p className="text-muted-foreground">
                    Due to the specialized nature of laboratory research materials, all sales are final. Returns, refunds, or exchanges are not accepted unless explicitly approved in writing by Vertex Research Labs prior to shipment.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Damaged or Incorrect Orders */}
            <section className="glass-card rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <ShieldCheck size={24} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Damaged or Incorrect Orders</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      If an order arrives damaged, incomplete, or incorrect, you must notify Vertex Research Labs within 48 hours of delivery. To assist with review, customers may be required to provide photographs of the packaging, shipping label, and affected items.
                    </p>
                    <p>
                      Approved issues may result in replacement, credit, or other resolution at our discretion. Claims submitted outside the stated timeframe may not be eligible for review.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Research Use Disclaimer */}
            <section className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
              <AlertTriangle size={18} className="text-destructive/70 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-1">Research Use Disclaimer</h2>
                <p className="text-sm text-muted-foreground">
                  All products sold by Vertex Research Labs are intended for laboratory research use only and are not for human or veterinary consumption. By placing an order, the purchaser acknowledges and agrees to these terms.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Shipping Questions?</h2>
              <p className="text-muted-foreground mb-4">
                For questions about shipping, tracking, or delivery, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <a 
                  href="mailto:info@vertexresearchlabs.com" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail size={18} className="text-primary" />
                  info@vertexresearchlabs.com
                </a>
                <a 
                  href="tel:727-295-1338" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone size={18} className="text-primary" />
                  (727) 295-1338
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shipping;