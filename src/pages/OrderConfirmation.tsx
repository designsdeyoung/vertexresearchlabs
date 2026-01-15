import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  FlaskConical,
  Mail,
  FileText,
  AlertTriangle,
  Home
} from "lucide-react";
import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-scale-in">
              <CheckCircle2 size={40} className="text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 animate-fade-up">
              Order Request Submitted
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto animate-fade-up stagger-1">
              Thank you for your research materials inquiry. Your request has been received.
            </p>
          </div>

          {/* Confirmation Details */}
          <div className="space-y-6 animate-fade-up stagger-2">
            {/* What's Next */}
            <div className="glass-card rounded-lg p-6">
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Mail size={20} className="text-primary" />
                What Happens Next
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">1</span>
                  <span>Our team will review your order request and verify product availability.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">2</span>
                  <span>You will receive a confirmation email with pricing and shipping details.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">3</span>
                  <span>Upon confirmation, your order will be processed and shipped with appropriate documentation.</span>
                </li>
              </ul>
            </div>

            {/* Documentation */}
            <div className="glass-card rounded-lg p-6">
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                Documentation
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                All orders include relevant documentation:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Certificate of Analysis (COA)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Product specifications and handling guidelines
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Shipping and storage requirements
                </li>
              </ul>
            </div>

            {/* Research Use Reminder */}
            <div className="glass-card rounded-lg p-6 border-l-4 border-l-primary">
              <div className="flex items-start gap-4">
                <FlaskConical size={24} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-lg font-medium text-foreground mb-2">Laboratory Research Use Only</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    All products supplied by Vertex Research Labs are intended for laboratory research use only. 
                    Products are not for human consumption, veterinary use, or for diagnostic, therapeutic, or 
                    medical applications.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="glass-card rounded-lg p-6 bg-secondary/30">
              <h2 className="text-lg font-medium text-foreground mb-4">Questions?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions about your order, please contact us:
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Email: </span>
                <a href="mailto:orders@vertexresearchlabs.com" className="text-primary hover:underline">
                  orders@vertexresearchlabs.com
                </a>
              </p>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
              <AlertTriangle size={16} className="text-destructive/70 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                By completing this order, you have confirmed that all materials will be used exclusively for 
                laboratory research purposes in accordance with our{" "}
                <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link>
                {" "}and{" "}
                <Link to="/disclaimer" className="text-primary hover:underline">Disclaimer</Link>.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" onClick={() => navigate("/")}>
              <Home size={18} />
              Return to Home
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to="/quality">
                View Quality Standards
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
