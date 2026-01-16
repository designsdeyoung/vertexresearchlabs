import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Loader2, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent, type: "inquiry" | "quote") => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const subjectLine =
      type === "quote"
        ? `Quote Request: ${formData.subject || "Research Materials"}`
        : `Research Inquiry: ${formData.subject || "General Inquiry"}`;

    const body = `Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject || "N/A"}

Message:
${formData.message}`;

    const mailtoLink = `mailto:info@vertexresearchlabs.com?subject=${encodeURIComponent(
      subjectLine
    )}&body=${encodeURIComponent(body)}`;

    // Small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 300));

    window.location.href = mailtoLink;

    toast({
      title: "Email client opened",
      description: "Please send the email from your email client to complete your inquiry.",
    });

    // Reset form after submission
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-xs text-primary uppercase tracking-widest mb-4 block">
            Research Inquiries
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Contact Our Team
          </h2>
          <p className="text-muted-foreground mb-6">
            For product inquiries, bulk orders, or documentation requests,
            reach out to our research support team.
          </p>

          {/* Direct Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8">
            <a 
              href="mailto:info@vertexresearchlabs.com" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail size={16} className="text-primary" />
              info@vertexresearchlabs.com
            </a>
            <a 
              href="tel:727-295-1338" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone size={16} className="text-primary" />
              (727) 295-1338
            </a>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} className="text-primary" />
              1444 S Belcher RD STE C-103, Clearwater, FL 33764
            </div>
          </div>

          <div className="glass-card rounded-xl p-8 text-left">
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full h-11 px-4 rounded-lg bg-secondary/50 border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors ${
                      errors.name ? "border-destructive" : "border-border/50"
                    }`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full h-11 px-4 rounded-lg bg-secondary/50 border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors ${
                      errors.email ? "border-destructive" : "border-border/50"
                    }`}
                    placeholder="you@institution.edu"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Inquiry type"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg bg-secondary/50 border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none ${
                    errors.message ? "border-destructive" : "border-border/50"
                  }`}
                  placeholder="Describe your research inquiry..."
                />
                {errors.message && (
                  <p className="text-xs text-destructive mt-1">{errors.message}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  disabled={isSubmitting}
                  onClick={(e) => handleSubmit(e, "inquiry")}
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Mail size={18} />
                  )}
                  Send Inquiry
                </Button>
                <Button
                  type="button"
                  variant="heroOutline"
                  size="lg"
                  className="flex-1"
                  disabled={isSubmitting}
                  onClick={(e) => handleSubmit(e, "quote")}
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <MessageSquare size={18} />
                  )}
                  Request Quote
                </Button>
              </div>
            </form>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            All inquiries are subject to verification. Products are supplied for
            research use only.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
