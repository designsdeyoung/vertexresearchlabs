import { Button } from "@/components/ui/button";
import { Mail, MessageSquare } from "lucide-react";

const ContactSection = () => {
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
          <p className="text-muted-foreground mb-8">
            For product inquiries, bulk orders, or documentation requests, 
            reach out to our research support team.
          </p>

          <div className="glass-card rounded-xl p-8 text-left">
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full h-11 px-4 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full h-11 px-4 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="you@institution.edu"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full h-11 px-4 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Inquiry type"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  placeholder="Describe your research inquiry..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="flex-1">
                  <Mail size={18} />
                  Send Inquiry
                </Button>
                <Button variant="heroOutline" size="lg" className="flex-1">
                  <MessageSquare size={18} />
                  Request Quote
                </Button>
              </div>
            </form>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            All inquiries are subject to verification. Products are supplied for research use only.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
