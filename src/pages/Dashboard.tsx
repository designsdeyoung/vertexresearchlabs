import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useInquiryCart } from "@/contexts/InquiryCartContext";
import { products } from "@/data/products";
import PointsBalance from "@/components/dashboard/PointsBalance";
import RewardsLadder from "@/components/dashboard/RewardsLadder";
import ReferralSection from "@/components/dashboard/ReferralSection";
import OrderHistory from "@/components/dashboard/OrderHistory";
import SubscriptionsList from "@/components/dashboard/SubscriptionsList";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut } from "lucide-react";

interface PointsTransaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  created_at: string;
}

interface Order {
  id: string;
  order_number: string | null;
  items: any;
  subtotal: number;
  total: number;
  points_earned: number;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem, openCart } = useInquiryCart();
  const prefilledCart = useRef(false);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Pre-fill cart from a shared/emailed link, e.g. /dashboard?add=tirzepatide&qty=2
  useEffect(() => {
    if (prefilledCart.current) return;
    const addId = searchParams.get("add");
    if (!addId) return;
    const product = products.find((p) => p.id === addId);
    if (!product) return;
    const qty = Math.min(Math.max(parseInt(searchParams.get("qty") || "1", 10) || 1, 1), 10);

    prefilledCart.current = true;
    for (let i = 0; i < qty; i++) addItem(product);
    openCart();

    const next = new URLSearchParams(searchParams);
    next.delete("add");
    next.delete("qty");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams, addItem, openCart]);

  useEffect(() => {
    if (profile) {
      // Fetch transactions
      supabase
        .from("points_transactions")
        .select("*")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(20)
        .then(({ data }) => {
          if (data) setTransactions(data as PointsTransaction[]);
        });

      // Fetch orders
      supabase
        .from("orders")
        .select("*")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(10)
        .then(({ data }) => {
          if (data) setOrders(data as Order[]);
        });
    }
  }, [profile]);

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading your dashboard...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={20} className="text-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Vertex Rewards</span>
              </div>
              <h1 className="text-3xl font-semibold text-foreground">
                Welcome back{profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">{profile.email || user.email}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => signOut().then(() => navigate("/"))}>
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>

          {/* Points & Progress */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <PointsBalance
              balance={profile.points_balance}
              lifetime={profile.lifetime_points}
            />
            <RewardsLadder balance={profile.points_balance} profileId={profile.id} onRedeemed={refreshProfile} />
          </div>

          {/* Referral & Orders */}
          <div className="grid md:grid-cols-2 gap-6">
            <ReferralSection
              referralCode={profile.referral_code || ""}
              profileId={profile.id}
            />
            <OrderHistory orders={orders} />
          </div>

          {/* Subscriptions */}
          <div className="mt-8">
            <SubscriptionsList profileId={profile.id} />
          </div>

          {/* Recent Activity */}
          {transactions.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-foreground mb-4">Recent Activity</h2>
              <div className="glass-card rounded-lg divide-y divide-border/50">
                {transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm text-foreground">{tx.description || tx.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        tx.amount > 0 ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 text-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/#products">
                <Sparkles size={16} />
                Browse Products & Earn Points
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
