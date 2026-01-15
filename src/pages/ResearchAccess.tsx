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
  User,
  Building,
  ArrowRight,
  FlaskConical
} from "lucide-react";
import { Link } from "react-router-dom";

const ResearchAccess = () => {
  const navigate = useNavigate();
  const { setAcknowledgments, setEligibilityType, completeAcknowledgment } = useCompliance();
  const { items } = useInquiryCart();
  
  const [agreedToAll, setAgreedToAll] = useState(false);
  const [eligibility, setEligibility] = useState<EligibilityType>(null);

  const canProceed = agreedToAll && eligibility !== null;

  const handleProceed = () => {
    setAcknowledgments({
      researchUseOnly: true,
      notForMedicalUse: true,
      termsAccepted: true,
    });
    setEligibilityType(eligibility);
    completeAcknowledgment();
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <FlaskConical size={24} className="text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Quick Verification
            </h1>
            <p className="text-muted-foreground text-sm">
              Confirm research use to complete your order
            </p>
          </div>

          {/* Main Card */}
          <div className="glass-card rounded-xl p-6 mb-5">
            {/* Eligibility - Inline */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">I am ordering as:</p>
              
              <RadioGroup
                value={eligibility || ""}
                onValueChange={(value) => setEligibility(value as EligibilityType)}
                className="flex flex-wrap gap-2"
              >
                {[
                  { value: "individual", icon: User, label: "Researcher" },
                  { value: "laboratory", icon: FlaskConical, label: "Laboratory" },
                  { value: "organization", icon: Building, label: "Organization" },
                ].map(({ value, icon: Icon, label }) => (
                  <div
                    key={value}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border cursor-pointer transition-all ${
                      eligibility === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-muted-foreground/50"
                    }`}
                    onClick={() => setEligibility(value as EligibilityType)}
                  >
                    <RadioGroupItem value={value} id={value} className="sr-only" />
                    <Icon size={14} />
                    <span className="text-sm font-medium">{label}</span>
                    {eligibility === value && <CheckCircle2 size={14} />}
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Single Comprehensive Checkbox */}
            <label
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                agreedToAll
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/50"
              }`}
            >
              <Checkbox
                checked={agreedToAll}
                onCheckedChange={(checked) => setAgreedToAll(checked === true)}
                className="mt-0.5"
              />
              <div className="text-sm leading-relaxed">
                <span className="text-foreground">
                  I confirm these materials are for <span className="font-medium">laboratory research only</span>, 
                  not for human or veterinary use, and not intended to diagnose, treat, or prevent any condition.
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
            Secure verification for research material compliance
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchAccess;
