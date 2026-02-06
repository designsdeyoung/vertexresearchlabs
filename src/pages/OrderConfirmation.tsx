import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { CountUp } from "@/components/checkout/CountUp";
import {
  CheckCircle2,
  Mail,
  FileText,
  Home,
  Sparkles,
  ArrowRight,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estimate points earned (we don't have the exact order here, so show general messaging)
  const estimatedPoints = 0; // Will be populated from actual order data in future

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <CheckCircle2 size={40} className="text-primary" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-semibold text-foreground mb-4"
            >
              Order Request Submitted
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground max-w-md mx-auto"
            >
              Thank you for your research materials inquiry. Your request has been received.
            </motion.p>
          </div>

          {/* Rewards Earned Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-xl p-6 mb-6 border-primary/20 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={20} className="text-primary" />
                <h2 className="text-lg font-medium text-foreground">Vertex Rewards</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Points will be added to your account once your order is confirmed.
                Earn <span className="text-primary font-medium">3 points per $1</span> on every order.
              </p>

              {!user && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-foreground font-medium mb-2">
                    Create your account to start earning rewards
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Sign in with the email you used at checkout to claim your points.
                  </p>
                  <Button variant="hero" size="sm" asChild>
                    <Link to="/auth">
                      Set Up Your Account
                      <ArrowRight size={14} />
                    </Link>
                  </Button>
                </div>
              )}

              {user && (
                <Button variant="hero" size="sm" asChild>
                  <Link to="/dashboard">
                    <Sparkles size={14} />
                    View Your Dashboard
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-lg p-6">
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Mail size={20} className="text-primary" />
                What Happens Next
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">1</span>
                  <span>Our team will review your order request and verify product availability.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">2</span>
                  <span>You will receive a confirmation email with pricing and shipping details.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">3</span>
                  <span>Upon confirmation, your order will be processed and shipped with appropriate documentation.</span>
                </li>
              </ul>
            </div>

            {/* Documentation */}
            <div className="glass-card rounded-lg p-6">
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                Documentation
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                All orders include relevant documentation:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Certificate of Analysis (COA)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Product specifications and handling guidelines
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Shipping and storage requirements
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="glass-card rounded-lg p-6 bg-secondary/30">
              <h2 className="text-lg font-medium text-foreground mb-4">Questions?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions about your order, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-sm flex items-center gap-2">
                  <Mail size={14} className="text-primary" />
                  <span className="text-muted-foreground">Email: </span>
                  <a href="mailto:orders@vertexresearchlabs.com" className="text-primary hover:underline">
                    orders@vertexresearchlabs.com
                  </a>
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Phone size={14} className="text-primary" />
                  <span className="text-muted-foreground">Phone: </span>
                  <a href="tel:727-295-1338" className="text-primary hover:underline">
                    (727) 295-1338
                  </a>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" onClick={() => navigate("/")}>
              <Home size={18} />
              Return to Home
            </Button>
            {!user && (
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/auth">
                  <Sparkles size={16} />
                  Create Account
                </Link>
              </Button>
            )}
            {user && (
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/dashboard">
                  View Dashboard
                </Link>
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
