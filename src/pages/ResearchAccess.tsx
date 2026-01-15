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
  Shield, 
  FileCheck, 
  AlertTriangle,
  Building2,
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Shield size={32} className="text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Research Access & Compliance Acknowledgment
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Vertex Research Labs provides research-grade materials intended exclusively for laboratory research applications.
            </p>
          </div>

          {/* Important Notice */}
          <div className="glass-card rounded-lg p-6 mb-8 border-l-4 border-l-primary">
            <div className="flex items-start gap-4">
              <AlertTriangle size={24} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-medium text-foreground mb-2">Important Notice</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All products sold by Vertex Research Labs are intended strictly for laboratory research purposes only. 
                  Products are not for human consumption, veterinary use, or for use in any diagnostic, therapeutic, or 
                  medical applications. By proceeding, you confirm your understanding of and agreement to these terms.
                </p>
              </div>
            </div>
          </div>

          {/* Eligibility Selection */}
          <div className="glass-card rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <Building2 size={20} className="text-primary" />
              Eligibility Type
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Please select the category that best describes your research capacity.
            </p>
            
            <RadioGroup
              value={eligibility || ""}
              onValueChange={(value) => setEligibility(value as EligibilityType)}
              className="space-y-3"
            >
              <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                eligibility === "individual" 
                  ? "border-primary bg-primary/5" 
                  : "border-border/50 bg-secondary/30 hover:border-border"
              }`}>
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual" className="flex items-center gap-3 cursor-pointer flex-1">
                  <User size={18} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Individual Researcher</p>
                    <p className="text-xs text-muted-foreground">Independent research professional</p>
                  </div>
                </Label>
              </div>
              
              <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                eligibility === "laboratory" 
                  ? "border-primary bg-primary/5" 
                  : "border-border/50 bg-secondary/30 hover:border-border"
              }`}>
                <RadioGroupItem value="laboratory" id="laboratory" />
                <Label htmlFor="laboratory" className="flex items-center gap-3 cursor-pointer flex-1">
                  <FlaskConical size={18} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Laboratory or Institution</p>
                    <p className="text-xs text-muted-foreground">Academic, research, or commercial laboratory</p>
                  </div>
                </Label>
              </div>
              
              <div className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                eligibility === "organization" 
                  ? "border-primary bg-primary/5" 
                  : "border-border/50 bg-secondary/30 hover:border-border"
              }`}>
                <RadioGroupItem value="organization" id="organization" />
                <Label htmlFor="organization" className="flex items-center gap-3 cursor-pointer flex-1">
                  <Building size={18} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Other Research Organization</p>
                    <p className="text-xs text-muted-foreground">Pharmaceutical, biotech, or other research entity</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Required Acknowledgments */}
          <div className="glass-card rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <FileCheck size={20} className="text-primary" />
              Required Acknowledgments
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Please review and confirm each acknowledgment to proceed.
            </p>
            
            <div className="space-y-4">
              <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors ${
                acknowledgments.researchUseOnly 
                  ? "border-primary bg-primary/5" 
                  : "border-border/50 bg-secondary/30"
              }`}>
                <Checkbox
                  id="researchUseOnly"
                  checked={acknowledgments.researchUseOnly}
                  onCheckedChange={() => handleCheckboxChange("researchUseOnly")}
                  className="mt-0.5"
                />
                <Label htmlFor="researchUseOnly" className="cursor-pointer leading-relaxed">
                  <span className="font-medium text-foreground">Laboratory Research Use Only</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    I confirm that I am acquiring products from Vertex Research Labs for laboratory research use only 
                    and not for human or veterinary use.
                  </p>
                </Label>
              </div>

              <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors ${
                acknowledgments.notForMedicalUse 
                  ? "border-primary bg-primary/5" 
                  : "border-border/50 bg-secondary/30"
              }`}>
                <Checkbox
                  id="notForMedicalUse"
                  checked={acknowledgments.notForMedicalUse}
                  onCheckedChange={() => handleCheckboxChange("notForMedicalUse")}
                  className="mt-0.5"
                />
                <Label htmlFor="notForMedicalUse" className="cursor-pointer leading-relaxed">
                  <span className="font-medium text-foreground">Not for Medical Use</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    I acknowledge that products are not intended to diagnose, treat, cure, mitigate, or prevent 
                    any disease or medical condition.
                  </p>
                </Label>
              </div>

              <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors ${
                acknowledgments.termsAccepted 
                  ? "border-primary bg-primary/5" 
                  : "border-border/50 bg-secondary/30"
              }`}>
                <Checkbox
                  id="termsAccepted"
                  checked={acknowledgments.termsAccepted}
                  onCheckedChange={() => handleCheckboxChange("termsAccepted")}
                  className="mt-0.5"
                />
                <Label htmlFor="termsAccepted" className="cursor-pointer leading-relaxed">
                  <span className="font-medium text-foreground">Terms & Conditions Agreement</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    I have read and agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link>
                    {" "}and{" "}
                    <Link to="/disclaimer" className="text-primary hover:underline">Disclaimer</Link>.
                  </p>
                </Label>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          {items.length > 0 && (
            <div className="glass-card rounded-lg p-6 mb-8">
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <FlaskConical size={20} className="text-primary" />
                Items in Your Request
              </h2>
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                    <span className="text-sm text-foreground">{item.product.name}</span>
                    <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proceed Button */}
          <div className="flex flex-col items-center gap-4">
            <Button
              variant="hero"
              size="xl"
              className="w-full max-w-md"
              disabled={!allAcknowledged}
              onClick={handleProceed}
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </Button>
            
            {!allAcknowledged && (
              <p className="text-sm text-muted-foreground text-center">
                Please complete all acknowledgments and select your eligibility type to proceed.
              </p>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchAccess;
