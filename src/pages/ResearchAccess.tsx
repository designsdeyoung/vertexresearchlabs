import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCompliance } from "@/contexts/ComplianceContext";
import { useInquiryCart } from "@/contexts/InquiryCartContext";
import { 
  ArrowRight,
  FlaskConical
} from "lucide-react";
import { Link } from "react-router-dom";

const ResearchAccess = () => {
  const navigate = useNavigate();
  const { setAcknowledgments, setEligibilityType, completeAcknowledgment } = useCompliance();
  const { items } = useInquiryCart();
  
  const [isOver21, setIsOver21] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const canProceed = isOver21 && agreedToTerms;

  const handleProceed = () => {
    setAcknowledgments({
      researchUseOnly: true,
      notForMedicalUse: true,
      termsAccepted: true,
    });
    setEligibilityType("individual");
    completeAcknowledgment();
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <FlaskConical size={24} className="text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Quick Verification
            </h1>
            <p className="text-muted-foreground text-sm">
              Confirm the following to proceed
            </p>
          </div>

          {/* Main Card */}
          <div className="glass-card rounded-xl p-5 mb-5 space-y-3">
            {/* Age Verification */}
            <label
              className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                isOver21
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/50"
              }`}
            >
              <Checkbox
                checked={isOver21}
                onCheckedChange={(checked) => setIsOver21(checked === true)}
              />
              <span className="text-sm text-foreground">
                I am <span className="font-medium">21 years of age or older</span>
              </span>
            </label>

            {/* Terms Checkbox */}
            <label
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                agreedToTerms
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/50"
              }`}
            >
              <Checkbox
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                className="mt-0.5"
              />
              <div className="text-sm leading-relaxed">
                <span className="text-foreground">
                  These materials are for <span className="font-medium">laboratory research only</span>, 
                  not for human or veterinary use.
                </span>
                <span className="text-muted-foreground">
                  {" "}I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                    Terms
                  </Link>
                  {" "}&{" "}
                  <Link to="/disclaimer" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                    Disclaimer
                  </Link>.
                </span>
              </div>
            </label>
          </div>

          {/* Items count */}
          {items.length > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-5 px-1">
              <span>{items.reduce((sum, item) => sum + item.quantity, 0)} item{items.length !== 1 ? "s" : ""} ready</span>
              <button onClick={() => navigate("/")} className="text-primary hover:underline text-xs">
                + Add more
              </button>
            </div>
          )}

          {/* Proceed Button */}
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            disabled={!canProceed}
            onClick={handleProceed}
          >
            Continue to Checkout
            <ArrowRight size={18} />
          </Button>

          {/* Trust note */}
          <p className="text-xs text-muted-foreground/50 text-center mt-4">
            Secure verification for research materials
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchAccess;
