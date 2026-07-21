import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import logoFull from "@/assets/logo-full.png";

const Welcome = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoSent, setAutoSent] = useState(false);

  // If already logged in, go straight to the account dashboard
  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  // Auto-send magic link if email came from QR code
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam && !autoSent) {
      setAutoSent(true);
      sendMagicLink(emailParam);
    }
  }, []);

  const sendMagicLink = async (emailAddr: string) => {
    if (!emailAddr.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: emailAddr.trim(),
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (!error) setSent(true);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMagicLink(email);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-6 text-center animate-fade-up">
          <img src={logoFull} alt="Vertex Research Labs" className="h-14 w-auto mx-auto mb-8" />

          {sent ? (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <CheckCircle2 size={36} className="text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground mb-3">Check your email</h1>
              <p className="text-muted-foreground mb-2">
                We sent a sign-in link to <span className="text-foreground font-medium">{email || searchParams.get("email")}</span>.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Click the link in your email and you'll land straight on your account — no password needed.
              </p>
              <div className="glass-card rounded-xl p-5 text-left space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Review your order history</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Track shipments and status</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Reorder in one tap</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles size={36} className="text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome back</h1>
              <p className="text-muted-foreground mb-8">
                {loading ? "Sending your sign-in link..." : "Enter your email and we'll send you a one-tap sign-in link to your account."}
              </p>
              {!loading && (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="h-12 text-center"
                  />
                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    <Mail size={16} />
                    Send my sign-in link
                    <ArrowRight size={16} />
                  </Button>
                </form>
              )}
              {loading && (
                <div className="text-muted-foreground text-sm animate-pulse">Sending magic link...</div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Welcome;
