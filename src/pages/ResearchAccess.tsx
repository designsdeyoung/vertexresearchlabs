import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCompliance, EligibilityType } from "@/contexts/ComplianceContext";
import { useInquiryCart } from "@/contexts/InquiryCartContext";
import { 
  CheckCircle2,
  Building2,
  User,
  Building,
  ArrowRight,
  FlaskConical,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

const ResearchAccess = () => {
  const navigate = useNavigate();
  const { setAcknowledgments, setEligibilityType, completeAcknowledgment } = useCompliance();
  const { items } = useInquiryCart();
  
  const [acknowledgments, setLocalAcknowledgments] = useState({
    researchUseOnly: false,
    notForMedicalUse: false,
    termsAccepted: false,
  });
  
  const [eligibility, setEligibility] = useState<EligibilityType>(null);

  const allAcknowledged = 
    acknowledgments.researchUseOnly && 
    acknowledgments.notForMedicalUse && 
    acknowledgments.termsAccepted &&
    eligibility !== null;

  const handleProceed = () => {
    setAcknowledgments(acknowledgments);
    setEligibilityType(eligibility);
    completeAcknowledgment();
    navigate("/checkout");
  };

  const handleCheckboxChange = (key: keyof typeof acknowledgments) => {
    setLocalAcknowledgments(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const acknowledgedCount = [
    acknowledgments.researchUseOnly,
    acknowledgments.notForMedicalUse,
    acknowledgments.termsAccepted,
    eligibility !== null
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <FlaskConical size={28} className="text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
              Quick Verification
            </h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Confirm your research use to proceed with your order. This helps us ensure compliance with research material regulations.
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step <= acknowledgedCount ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-2">
              {acknowledgedCount} of 4 complete
            </span>
          </div>

          {/* Combined Card */}
          <div className="glass-card rounded-xl p-6 md:p-8 mb-6">
            {/* Eligibility Selection */}
            <div className="mb-8">
              <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                I am ordering as...
              </h2>
              
              <RadioGroup
                value={eligibility || ""}
                onValueChange={(value) => setEligibility(value as EligibilityType)}
                className="grid gap-2"
              >
                {[
                  { value: "individual", icon: User, label: "Individual Researcher" },
                  { value: "laboratory", icon: FlaskConical, label: "Laboratory or Institution" },
                  { value: "organization", icon: Building, label: "Research Organization" },
                ].map(({ value, icon: Icon, label }) => (
                  <div
                    key={value}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      eligibility === value
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-border hover:bg-secondary/30"
                    }`}
                    onClick={() => setEligibility(value as EligibilityType)}
                  >
                    <RadioGroupItem value={value} id={value} />
                    <Label htmlFor={value} className="flex items-center gap-2.5 cursor-pointer flex-1">
                      <Icon size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">{label}</span>
                    </Label>
                    {eligibility === value && (
                      <CheckCircle2 size={16} className="text-primary" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Divider */}
            <div className="border-t border-border/50 my-6" />

            {/* Acknowledgments */}
            <div>
              <h2 className="text-sm font-medium text-foreground mb-4">
                Please confirm the following:
              </h2>
              
              <div className="space-y-3">
                <label
                  className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    acknowledgments.researchUseOnly
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/50 hover:border-border"
                  }`}
                >
                  <Checkbox
                    id="researchUseOnly"
                    checked={acknowledgments.researchUseOnly}
                    onCheckedChange={() => handleCheckboxChange("researchUseOnly")}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">
                    These materials are for <span className="font-medium">laboratory research use only</span>, not for human or veterinary use.
                  </span>
                </label>

                <label
                  className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    acknowledgments.notForMedicalUse
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/50 hover:border-border"
                  }`}
                >
                  <Checkbox
                    id="notForMedicalUse"
                    checked={acknowledgments.notForMedicalUse}
                    onCheckedChange={() => handleCheckboxChange("notForMedicalUse")}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">
                    I understand these products are <span className="font-medium">not intended for medical use</span> or to diagnose, treat, or prevent any condition.
                  </span>
                </label>

                <label
                  className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    acknowledgments.termsAccepted
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/50 hover:border-border"
                  }`}
                >
                  <Checkbox
                    id="termsAccepted"
                    checked={acknowledgments.termsAccepted}
                    onCheckedChange={() => handleCheckboxChange("termsAccepted")}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-foreground leading-relaxed">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link>
                    {" "}and{" "}
                    <Link to="/disclaimer" className="text-primary hover:underline">Disclaimer</Link>.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Items Summary - Compact */}
          {items.length > 0 && (
            <div className="glass-card rounded-lg p-4 mb-6 bg-secondary/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FlaskConical size={16} className="text-primary" />
                  <span className="text-sm text-foreground font-medium">
                    {items.reduce((sum, item) => sum + item.quantity, 0)} item{items.length !== 1 ? "s" : ""} in your order
                  </span>
                </div>
                <button 
                  onClick={() => navigate("/")}
                  className="text-xs text-primary hover:underline"
                >
                  Add more
                </button>
              </div>
            </div>
          )}

          {/* Proceed Button */}
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            disabled={!allAcknowledged}
            onClick={handleProceed}
          >
            Continue to Checkout
            <ArrowRight size={18} />
          </Button>
          
          {!allAcknowledged && (
            <p className="text-xs text-muted-foreground text-center mt-3">
              Complete all selections above to proceed
            </p>
          )}

          {/* Trust note */}
          <p className="text-xs text-muted-foreground/60 text-center mt-6">
            Your information is secure. We verify research use to comply with industry regulations.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchAccess;
