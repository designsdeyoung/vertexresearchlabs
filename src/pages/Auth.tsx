import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Mail, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import logoFull from "@/assets/logo-full.png";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { user, signInWithMagicLink } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    const { error } = await signInWithMagicLink(email.trim());

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setEmailSent(true);
      toast({
        title: "Check your email",
        description: "We sent you a magic link to sign in.",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-6">
          {emailSent ? (
            <div className="text-center animate-fade-up">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Mail size={36} className="text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground mb-3">Check Your Email</h1>
              <p className="text-muted-foreground mb-6">
                We sent a sign-in link to <span className="text-foreground font-medium">{email}</span>.
                Click the link in the email to access your account.
              </p>
              <Button variant="ghost" onClick={() => setEmailSent(false)}>
                Use a different email
              </Button>
            </div>
          ) : (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <img src={logoFull} alt="Vertex Research Labs" className="h-16 w-auto mx-auto mb-6" />
                <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome to Vertex</h1>
                <p className="text-muted-foreground">
                  Sign in to access your rewards dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@research.edu"
                    className="bg-secondary/50 h-12"
                  />
                </div>
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Continue with Email"}
                  <ArrowRight size={16} />
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                We'll send you a magic link — no password needed.
              </p>

              {/* Benefits */}
              <div className="mt-10 space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center mb-4">
                  Vertex Rewards Benefits
                </p>
                {[
                  { icon: Sparkles, text: "Earn 3x points on every dollar spent" },
                  { icon: Zap, text: "Unlock credits up to $40 off your order" },
                  { icon: Shield, text: "Refer friends & earn bonus rewards" },
                ].map(({ icon: Icon, text }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
