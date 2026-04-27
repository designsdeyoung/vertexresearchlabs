import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Mail, ArrowRight, Sparkles, Shield, Zap, Lock } from "lucide-react";
import logoFull from "@/assets/logo-full.png";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { user, signInWithMagicLink, signInWithPassword, signUpWithPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    const { error } = await signInWithMagicLink(email.trim());
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setEmailSent(true);
      toast({ title: "Check your email", description: "We sent you a magic link to sign in." });
    }
    setIsSubmitting(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setIsSubmitting(true);
    const { error } = await signInWithPassword(email.trim(), password);
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!", description: "Redirecting to your dashboard..." });
    }
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const { error } = await signUpWithPassword(email.trim(), password, fullName.trim() || undefined);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Account created",
        description: "Check your email to verify your account, then sign in.",
      });
    }
    setIsSubmitting(false);
  };

  const handleReset = async () => {
    if (!email.trim()) {
      toast({ title: "Enter your email first", description: "Type your email above, then click reset.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const { error } = await resetPassword(email.trim());
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setResetSent(true);
      toast({ title: "Reset link sent", description: "Check your email for a password reset link." });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-6">
          {emailSent || resetSent ? (
            <div className="text-center animate-fade-up">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Mail size={36} className="text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground mb-3">Check Your Email</h1>
              <p className="text-muted-foreground mb-6">
                We sent a {resetSent ? "password reset" : "sign-in"} link to{" "}
                <span className="text-foreground font-medium">{email}</span>.
              </p>
              <Button variant="ghost" onClick={() => { setEmailSent(false); setResetSent(false); }}>
                Back to sign in
              </Button>
            </div>
          ) : (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <img src={logoFull} alt="Vertex Research Labs" className="h-16 w-auto mx-auto mb-6" />
                <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome to Vertex</h1>
                <p className="text-muted-foreground">Access your rewards dashboard</p>
              </div>

              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  <TabsTrigger value="magic">Magic Link</TabsTrigger>
                </TabsList>

                {/* SIGN IN */}
                <TabsContent value="signin" className="mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email Address</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@research.edu"
                        className="bg-secondary/50 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-secondary/50 h-12"
                      />
                    </div>
                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Signing in..." : "Sign In"}
                      <ArrowRight size={16} />
                    </Button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-muted-foreground hover:text-foreground underline w-full text-center"
                    >
                      Forgot your password?
                    </button>
                  </form>
                </TabsContent>

                {/* SIGN UP */}
                <TabsContent value="signup" className="mt-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name (optional)</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Jane Doe"
                        className="bg-secondary/50 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email Address</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@research.edu"
                        className="bg-secondary/50 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className="bg-secondary/50 h-12"
                      />
                    </div>
                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Creating account..." : "Create Account"}
                      <ArrowRight size={16} />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Already have points from a past order? Use the same email to keep them.
                    </p>
                  </form>
                </TabsContent>

                {/* MAGIC LINK */}
                <TabsContent value="magic" className="mt-6">
                  <form onSubmit={handleMagicLink} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="magic-email">Email Address</Label>
                      <Input
                        id="magic-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@research.edu"
                        className="bg-secondary/50 h-12"
                      />
                    </div>
                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Email me a link"}
                      <Mail size={16} />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      We'll send you a one-time sign-in link — no password needed.
                    </p>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Benefits */}
              <div className="mt-10 space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center mb-4">
                  Vertex Rewards Benefits
                </p>
                {[
                  { icon: Sparkles, text: "Earn 3x points on every dollar spent" },
                  { icon: Zap, text: "Unlock credits up to $40 off your order" },
                  { icon: Shield, text: "Refer friends & earn bonus rewards" },
                  { icon: Lock, text: "Set a password so your points are always one click away" },
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
