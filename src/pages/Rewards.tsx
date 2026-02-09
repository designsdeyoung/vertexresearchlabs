import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Gift,
  Users,
  Repeat,
  ShoppingCart,
  ArrowRight,
  Star,
  Zap,
  TrendingUp,
  CheckCircle2,
  Camera,
  Share2,
} from "lucide-react";
import {
  POINTS_PER_DOLLAR,
  AUTOSHIP_POINTS_PER_DOLLAR,
  REWARD_TIERS,
  REFERRAL_DISCOUNT_PERCENT,
  REFERRAL_POINTS_MULTIPLIER,
  SOCIAL_POST_POINTS,
  PHOTO_REVIEW_POINTS,
} from "@/hooks/useRewards";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const Rewards = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-28 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-6 text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary tracking-wider uppercase">
                Vertex Rewards
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Every Order Earns You{" "}
              <span className="text-primary">More</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Our loyalty program rewards you automatically — earn points on every purchase, 
              unlock store credit, and share your code to multiply your rewards.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <a href="/#products">
                  <ShoppingCart size={16} />
                  Start Earning
                </a>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/auth">
                  Sign In to Dashboard
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* How It Works — 3 Steps */}
        <section className="container mx-auto px-6 mb-20">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: ShoppingCart,
                step: "01",
                title: "Place an Order",
                desc: `Earn ${POINTS_PER_DOLLAR} points for every $1 you spend. Points are automatically added to your account after each order.`,
              },
              {
                icon: TrendingUp,
                step: "02",
                title: "Accumulate Points",
                desc: "Your points grow with every purchase. Track your balance and progress toward the next reward tier in your dashboard.",
              },
              {
                icon: Gift,
                step: "03",
                title: "Redeem for Credit",
                desc: "Hit a reward tier and convert your points into Vertex Credit — applied directly to your next order.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="glass-card rounded-xl p-6 relative overflow-hidden group"
              >
                <span className="absolute top-4 right-4 text-5xl font-black text-primary/5 group-hover:text-primary/10 transition-colors">
                  {item.step}
                </span>
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Earning Points */}
        <section className="container mx-auto px-6 mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-4">
              Ways to Earn
            </h2>
            <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
              Multiple ways to accumulate points — the more you engage, the faster you unlock rewards.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: ShoppingCart,
                  label: "Every Purchase",
                  value: `${POINTS_PER_DOLLAR} pts / $1`,
                  detail: "Automatic on every order",
                },
                {
                  icon: Repeat,
                  label: "Autoship Orders",
                  value: `${AUTOSHIP_POINTS_PER_DOLLAR} pts / $1`,
                  detail: "2× earn rate + 10% off + locked pricing",
                },
                {
                  icon: Users,
                  label: "Refer a Friend",
                  value: `${REFERRAL_POINTS_MULTIPLIER}× pts`,
                  detail: `Earn ${REFERRAL_POINTS_MULTIPLIER}× points on their order subtotal`,
                },
                {
                  icon: Camera,
                  label: "Photo Review",
                  value: `${PHOTO_REVIEW_POINTS} pts`,
                  detail: "Submit a photo with your review",
                },
                {
                  icon: Share2,
                  label: "Social Tag",
                  value: `${SOCIAL_POST_POINTS} pts/mo`,
                  detail: "Tag @vertexresearchlabs on social media",
                },
                {
                  icon: Star,
                  label: "Account Activation",
                  value: "Instant",
                  detail: "Your rewards account is created with your first order",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="flex items-center gap-4 glass-card rounded-lg p-4 border border-border/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-foreground">{item.label}</h4>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {item.value}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Reward Tiers Table */}
        <section className="container mx-auto px-6 mb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-4">
              Redemption Tiers
            </h2>
            <p className="text-muted-foreground text-center mb-10 max-w-lg mx-auto">
              Convert your points into Vertex Credit. Higher tiers unlock larger credits with more flexibility.
            </p>

            <div className="grid gap-4">
              {REWARD_TIERS.map((tier, i) => (
                <motion.div
                  key={tier.points}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="glass-card rounded-xl p-5 border border-border/50 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                >
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Zap size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">{tier.points.toLocaleString()} pts</p>
                      <p className="text-xs text-muted-foreground">Required</p>
                    </div>
                  </div>
                  <div className="h-px sm:h-8 w-full sm:w-px bg-border/50" />
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-primary">${tier.credit} Vertex Credit</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-primary/60" />
                        Min. cart ${tier.minCart}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-primary/60" />
                        Up to {tier.maxPercent}% of cart
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6">
              Credits expire after 12 months of account inactivity. One credit per order.
            </p>
          </div>
        </section>

        {/* Referral Section */}
        <section className="container mx-auto px-6 mb-20">
          <div className="max-w-3xl mx-auto glass-card rounded-2xl p-8 md:p-10 border border-primary/20 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Users size={20} className="text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                  Share & Earn
                </h2>
              </div>
              <p className="text-muted-foreground mb-6 max-w-xl">
                Every customer gets a personalized discount code after their first order. 
                Share it with colleagues and friends — everyone wins.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg bg-secondary/50 border border-border/50 p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Your Friend Gets</p>
                  <p className="text-2xl font-bold text-foreground">{REFERRAL_DISCOUNT_PERCENT}% Off</p>
                  <p className="text-xs text-muted-foreground mt-1">Applied automatically with your code</p>
                </div>
                <div className="rounded-lg bg-secondary/50 border border-border/50 p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">You Earn</p>
                  <p className="text-2xl font-bold text-primary">{REFERRAL_POINTS_MULTIPLIER}× Points</p>
                  <p className="text-xs text-muted-foreground mt-1">On their entire order subtotal</p>
                </div>
              </div>

              <div className="rounded-lg bg-secondary/30 border border-border/50 p-4 mb-6">
                <p className="text-sm font-medium text-foreground mb-2">How referral codes work:</p>
                <ul className="space-y-2">
                  {[
                    "After your first order, you receive a personalized code (e.g. JANE10)",
                    "Share your link — it auto-applies your code at checkout",
                    `Your friend saves ${REFERRAL_DISCOUNT_PERCENT}% on their order`,
                    `You earn ${REFERRAL_POINTS_MULTIPLIER}× the points on their order subtotal`,
                    "Points are added to your account instantly",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-muted-foreground">
                Self-referrals are automatically blocked. One referral bonus per unique email address.
              </p>
            </div>
          </div>
        </section>

        {/* Autoship Highlight */}
        <section className="container mx-auto px-6 mb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-4">
              Autoship Accelerator
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-lg mx-auto">
              Subscribe to recurring orders and unlock the fastest path to rewards.
            </p>

            <div className="glass-card rounded-xl p-6 border border-primary/20">
              <div className="grid sm:grid-cols-3 gap-6 text-center">
                {[
                  { value: "2×", label: "Point Earn Rate", sub: `${AUTOSHIP_POINTS_PER_DOLLAR} pts per $1` },
                  { value: "10%", label: "Order Discount", sub: "Applied automatically" },
                  { value: "∞", label: "Locked Pricing", sub: "Price never increases" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-3xl font-black text-primary mb-1">{item.value}</p>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-6 mb-20">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Do I need to create an account to earn points?",
                  a: "No — your account is created automatically when you place your first order. You'll receive a magic link via email to access your rewards dashboard.",
                },
                {
                  q: "How do I redeem my points?",
                  a: "Once you reach a reward tier (starting at 500 points), visit your dashboard to convert points into Vertex Credit. The credit will be available to apply at checkout.",
                },
                {
                  q: "Can I stack credits or combine with a discount code?",
                  a: "One credit can be applied per order. Credits and referral discount codes can be used together on the same order.",
                },
                {
                  q: "Do my points expire?",
                  a: "Points and unused credits expire after 12 months of account inactivity. Placing any order resets the inactivity clock.",
                },
                {
                  q: "How do I get my referral code?",
                  a: "Your personalized code (e.g. JANE10) is generated automatically after your first order. You'll find it on your confirmation page, in your email, and in your dashboard.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="glass-card rounded-lg p-5 border border-border/50"
                >
                  <h4 className="text-sm font-semibold text-foreground mb-2">{item.q}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-muted-foreground mb-6">
              Every order counts. Browse our catalog and start building your rewards today.
            </p>
            <Button variant="hero" size="lg" asChild>
              <a href="/#products">
                <Sparkles size={16} />
                Browse Products
              </a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Rewards;
