import { useState } from "react";
import { useInquiryCart } from "@/contexts/InquiryCartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Trash2, Send, FlaskConical } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const InquiryCart = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart } = useInquiryCart();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build email body
    const productList = items
      .map(item => `• ${item.product.name} (Qty: ${item.quantity})`)
      .join("\n");
    
    const emailBody = `
Quote Request from ${formData.name}

Organization: ${formData.organization || "Not specified"}
Email: ${formData.email}

Products Requested:
${productList}

Additional Notes:
${formData.message || "None"}
    `.trim();

    // Create mailto link
    const mailtoLink = `mailto:inquiries@vertexresearchlabs.com?subject=${encodeURIComponent(
      "Quote Request - Vertex Research Labs"
    )}&body=${encodeURIComponent(emailBody)}`;

    window.open(mailtoLink, "_blank");

    toast({
      title: "Opening email client",
      description: "Your inquiry is ready to send. Please complete in your email client.",
    });

    // Reset form
    setFormData({ name: "", email: "", organization: "", message: "" });
    setShowForm(false);
    clearCart();
    closeCart();
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md bg-background border-border flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FlaskConical size={20} className="text-primary" />
            Inquiry List
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <FlaskConical size={48} className="mx-auto mb-4 opacity-30" />
              <p>Your inquiry list is empty</p>
              <p className="text-sm mt-1">Add products to request a quote</p>
            </div>
          </div>
        ) : showForm ? (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 mt-4">
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  required
                  maxLength={100}
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  maxLength={255}
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  maxLength={200}
                  value={formData.organization}
                  onChange={e => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                  placeholder="Research institution or company"
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Additional Notes</Label>
                <Textarea
                  id="message"
                  maxLength={1000}
                  value={formData.message}
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Any specific requirements or questions..."
                  className="bg-secondary/50 min-h-[100px]"
                />
              </div>

              {/* Product summary */}
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Products in inquiry:</p>
                <ul className="text-sm space-y-1">
                  {items.map(item => (
                    <li key={item.product.id} className="text-foreground">
                      {item.product.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowForm(false)}>
                Back
              </Button>
              <Button type="submit" variant="hero" className="flex-1">
                <Send size={16} />
                Send Inquiry
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto mt-4 space-y-3">
              {items.map(item => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50"
                >
                  {item.product.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.product.category}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border/50 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total items</span>
                <span className="text-foreground font-medium">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <Button variant="hero" className="w-full" onClick={() => setShowForm(true)}>
                Request Quote
              </Button>
              <Button variant="ghost" size="sm" className="w-full text-xs" onClick={clearCart}>
                Clear All
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default InquiryCart;
