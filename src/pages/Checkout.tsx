import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCompliance } from "@/contexts/ComplianceContext";
import { useInquiryCart } from "@/contexts/InquiryCartContext";
import { toast } from "@/hooks/use-toast";
import { 
  Shield, 
  CreditCard,
  Building2,
  Mail,
  User,
  FileText,
  AlertTriangle,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const { hasAcknowledged, eligibilityType, resetCompliance } = useCompliance();
  const { items, clearCart } = useInquiryCart();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organization: "",
    address: "",
    notes: "",
  });
  
  const [finalConfirmation, setFinalConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not acknowledged
  if (!hasAcknowledged) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
              <Shield size={32} className="text-destructive" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-4">
              Research Access Required
            </h1>
            <p className="text-muted-foreground mb-6">
              Please complete the research access acknowledgment before proceeding to checkout.
            </p>
            <Button variant="hero" onClick={() => navigate("/research-access")}>
              Complete Research Access
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Redirect if no items
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <h1 className="text-2xl font-semibold text-foreground mb-4">
              No Items Selected
            </h1>
            <p className="text-muted-foreground mb-6">
              Your inquiry list is empty. Please add products before proceeding.
            </p>
            <Button variant="hero" onClick={() => navigate("/")}>
              Browse Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const eligibilityLabels: Record<string, string> = {
    individual: "Individual Researcher",
    laboratory: "Laboratory or Institution",
    organization: "Other Research Organization",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!finalConfirmation) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm that your order is for laboratory research use only.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Build order data
    const orderData = {
      customer: formData,
      eligibilityType,
      items: items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
      })),
      acknowledgedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
    };

    // Simulate order submission (in production, this would go to a backend)
    // For now, we'll create a mailto link with the order details
    const productList = items
      .map(item => `• ${item.product.name} (Qty: ${item.quantity})`)
      .join("\n");

    const emailBody = `
ORDER REQUEST - Vertex Research Labs

Customer Information:
Name: ${formData.fullName}
Email: ${formData.email}
Organization: ${formData.organization}
Eligibility Type: ${eligibilityLabels[eligibilityType || ""] || eligibilityType}

Shipping Address:
${formData.address}

Products Requested:
${productList}

Additional Notes:
${formData.notes || "None"}

---
Research Use Confirmation: CONFIRMED
Terms & Conditions: ACCEPTED
Submitted: ${new Date().toLocaleString()}
    `.trim();

    const mailtoLink = `mailto:orders@vertexresearchlabs.com?subject=${encodeURIComponent(
      "Order Request - Vertex Research Labs"
    )}&body=${encodeURIComponent(emailBody)}`;

    window.open(mailtoLink, "_blank");

    // Navigate to confirmation
    setTimeout(() => {
      clearCart();
      resetCompliance();
      navigate("/order-confirmation");
      setIsSubmitting(false);
    }, 500);
  };

  const isFormValid = 
    formData.fullName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.organization.trim() !== "" &&
    formData.address.trim() !== "" &&
    finalConfirmation;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Back button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-8 -ml-2"
            onClick={() => navigate("/research-access")}
          >
            <ArrowLeft size={16} />
            Back to Research Access
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-semibold text-foreground mb-2">Checkout</h1>
              <p className="text-muted-foreground mb-8">Complete your research materials order</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="glass-card rounded-lg p-6">
                  <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                    <User size={20} className="text-primary" />
                    Contact Information
                  </h2>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        required
                        maxLength={100}
                        value={formData.fullName}
                        onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Dr. Jane Smith"
                        className="bg-secondary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        maxLength={255}
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="jane.smith@research.edu"
                        className="bg-secondary/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Organization */}
                <div className="glass-card rounded-lg p-6">
                  <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                    <Building2 size={20} className="text-primary" />
                    Organization Details
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization / Institution *</Label>
                      <Input
                        id="organization"
                        required
                        maxLength={200}
                        value={formData.organization}
                        onChange={e => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                        placeholder="University Research Laboratory"
                        className="bg-secondary/50"
                      />
                    </div>
                    
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Eligibility Type:</span>{" "}
                        {eligibilityLabels[eligibilityType || ""] || eligibilityType}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                <div className="glass-card rounded-lg p-6">
                  <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                    <Mail size={20} className="text-primary" />
                    Shipping Address
                  </h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      required
                      maxLength={500}
                      value={formData.address}
                      onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Laboratory address including building, room number, city, state/province, postal code, and country"
                      className="bg-secondary/50 min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="glass-card rounded-lg p-6">
                  <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-primary" />
                    Additional Notes
                  </h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Instructions (Optional)</Label>
                    <Textarea
                      id="notes"
                      maxLength={1000}
                      value={formData.notes}
                      onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any special requirements, preferred shipping methods, or additional information..."
                      className="bg-secondary/50 min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Final Confirmation */}
                <div className="glass-card rounded-lg p-6 border-l-4 border-l-primary">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="finalConfirmation"
                      checked={finalConfirmation}
                      onCheckedChange={(checked) => setFinalConfirmation(checked === true)}
                      className="mt-1"
                    />
                    <Label htmlFor="finalConfirmation" className="cursor-pointer leading-relaxed">
                      <span className="font-medium text-foreground">Final Confirmation Required</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        I confirm that this order is for laboratory research use only and that I agree to the{" "}
                        <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link>.
                        I understand that all products from Vertex Research Labs are not intended for human or 
                        veterinary use.
                      </p>
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={!isFormValid || isSubmitting}
                >
                  <CreditCard size={18} />
                  {isSubmitting ? "Processing..." : "Submit Order Request"}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-lg p-6 sticky top-28">
                <h2 className="text-lg font-medium text-foreground mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between items-start py-2 border-b border-border/30 last:border-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">{item.product.category}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border/50">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Total Items</span>
                    <span className="text-foreground font-medium">
                      {items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Pricing and availability will be confirmed after order review.
                  </p>
                </div>

                {/* Compliance Badge */}
                <div className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={16} className="text-primary" />
                    <span className="text-xs font-medium text-primary">Research Access Verified</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All required acknowledgments have been completed.
                  </p>
                </div>

                {/* Warning */}
                <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className="text-muted-foreground mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      For laboratory research use only. Not for human or veterinary use.
                    </p>
                  </div>
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

export default Checkout;
