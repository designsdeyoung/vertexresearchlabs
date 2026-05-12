import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Gift, X, Zap, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REWARD_TIERS } from "@/hooks/useRewards";
import { toast } from "sonner";

interface Credit {
  id: string;
  amount: number;
  points_cost: number;
  min_cart: number;
  max_percent: number;
  status: string;
  expires_at: string;
}

interface CreditRedemptionProps {
  profileId?: string | null;
  email?: string;
  cartTotal: number;
  pointsBalance?: number;
  isAuthenticated?: boolean;
  selectedCredit: { id: string; amount: number; points_cost: number; min_cart: number; max_percent: number } | null;
  onSelectCredit: (credit: { id: string; amount: number; points_cost: number; min_cart: number; max_percent: number } | null) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

const rewardTiersAscending = [...REWARD_TIERS].sort((a, b) => a.points - b.points);

const getFunctionErrorMessage = async (error: unknown, fallback: string) => {
  const context = (error as { context?: { json?: () => Promise<{ error?: string }> } })?.context;
  if (context && typeof context.json === "function") {
    try {
      const body = await context.json();
      if (body?.error) return body.error;
    } catch {
      // Fall through to the generic error message.
    }
  }

  return error instanceof Error ? error.message : fallback;
};

const CreditRedemption = ({
  profileId,
  email,
  cartTotal,
  pointsBalance: pointsBalanceProp = 0,
  isAuthenticated = false,
  selectedCredit,
  onSelectCredit,
}: CreditRedemptionProps) => {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [redeemingPoints, setRedeemingPoints] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [guestPointsBalance, setGuestPointsBalance] = useState<number | null>(null);
  const [guestProfileFound, setGuestProfileFound] = useState(false);

  // Logged-in: live balance from profile prop. Guest: from email lookup.
  const livePointsBalance = isAuthenticated
    ? pointsBalanceProp
    : guestPointsBalance ?? 0;

  // Load credits when logged in via profileId
  useEffect(() => {
    if (!profileId) return;
    supabase
      .from("credits")
      .select("*")
      .eq("profile_id", profileId)
      .eq("status", "active")
      .then(({ data }) => {
        if (data) setCredits(data as Credit[]);
        else setCredits([]);
      });
  }, [profileId, refreshKey]);

  // Load credits + points balance via email lookup (guest checkout) — debounced
  useEffect(() => {
    if (profileId) return;
    const trimmed = (email || "").trim();
    if (!trimmed || !trimmed.includes("@") || trimmed.length < 5) {
      setCredits([]);
      setGuestPointsBalance(null);
      setGuestProfileFound(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const { data } = await supabase.functions.invoke("lookup-credits", {
          body: { email: trimmed },
        });
        setCredits((data?.credits as Credit[]) || []);
        setGuestPointsBalance(typeof data?.pointsBalance === "number" ? data.pointsBalance : 0);
        setGuestProfileFound(Boolean(data?.profileId));
      } catch {
        setCredits([]);
        setGuestPointsBalance(null);
        setGuestProfileFound(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [email, profileId]);

  const hasActiveCredit = credits.length > 0;

  const handleRedeem = async (points: number) => {
    if (!isAuthenticated) {
      toast.info("Sign in to redeem your points", {
        description: "Use the email magic link from your dashboard to redeem.",
      });
      return;
    }
    setRedeemingPoints(points);
    try {
      const { data, error } = await supabase.functions.invoke("redeem-credit", {
        body: { points },
      });
      if (error || data?.error) {
        toast.error(data?.error || (await getFunctionErrorMessage(error, "Could not redeem points")));
        return;
      }
      toast.success("Credit unlocked & applied!");
      if (data?.credit) {
        onSelectCredit({
          id: data.credit.id,
          amount: data.credit.amount,
          points_cost: data.credit.points_cost,
          min_cart: data.credit.min_cart,
          max_percent: data.credit.max_percent,
        });
      }
      setRefreshKey((k) => k + 1);
    } catch (e: any) {
      toast.error(e?.message || "Could not redeem points");
    } finally {
      setRedeemingPoints(null);
    }
  };

  // Helper text under the balance
  const balanceSubtitle = useMemo(() => {
    if (isAuthenticated) return "Live balance — pick a tier to apply instantly";
    const trimmed = (email || "").trim();
    if (!trimmed || !trimmed.includes("@")) {
      return "Enter your email above to load your rewards balance";
    }
    if (guestProfileFound) return "Sign in to redeem your points at checkout";
    return "No rewards account yet — you'll start earning on this order";
  }, [isAuthenticated, email, guestProfileFound]);

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
          <Gift size={20} className="text-primary" />
          Vertex Rewards
        </h2>
      </div>

      {/* Live points balance — always visible, real-time */}
      <div className="mb-4 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Your points</span>
          <span className="text-[10px] text-primary/70 font-medium">REAL-TIME</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-bold text-primary tabular-nums">
            {livePointsBalance.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">pts</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{balanceSubtitle}</p>
      </div>

      {selectedCredit ? (
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-primary" />
            <span className="text-sm text-foreground font-medium">
              {formatPrice(selectedCredit.amount)} credit applied
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectCredit(null)}
            className="h-7 w-7 p-0"
          >
            <X size={14} />
          </Button>
        </div>
      ) : hasActiveCredit ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground mb-2">You have a credit ready to use:</p>
          {credits.map((credit) => {
            const meetsMinCart = cartTotal >= credit.min_cart;
            const maxDiscount = Math.min(credit.amount, cartTotal * (credit.max_percent / 100));
            return (
              <button
                key={credit.id}
                disabled={!meetsMinCart}
                onClick={() =>
                  onSelectCredit({
                    id: credit.id,
                    amount: credit.amount,
                    points_cost: credit.points_cost,
                    min_cart: credit.min_cart,
                    max_percent: credit.max_percent,
                  })
                }
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  meetsMinCart
                    ? "border-primary/20 bg-primary/5 hover:border-primary/40 cursor-pointer"
                    : "border-border/50 bg-secondary/20 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {formatPrice(credit.amount)} Credit
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {meetsMinCart
                        ? `Saves up to ${formatPrice(maxDiscount)}`
                        : `Add ${formatPrice(credit.min_cart - cartTotal)} more to unlock`}
                    </p>
                  </div>
                  {meetsMinCart && (
                    <span className="text-xs text-primary font-medium">Apply</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground mb-3">
            Pick a credit to apply to this order:
          </p>
          <div className="space-y-2">
            {rewardTiersAscending.map((tier) => {
              const canAfford = livePointsBalance >= tier.points;
              const meetsMinCart = cartTotal >= tier.minCart;
              const isReady = canAfford && meetsMinCart && isAuthenticated;
              const isRedeeming = redeemingPoints === tier.points;
              const pointsShort = Math.max(0, tier.points - livePointsBalance);
              const cartShort = Math.max(0, tier.minCart - cartTotal);

              // Progress to this tier (capped at 100)
              const progress = Math.min(100, Math.round((livePointsBalance / tier.points) * 100));

              let statusEl: React.ReactNode;
              if (isRedeeming) {
                statusEl = <Loader2 size={14} className="animate-spin text-primary" />;
              } else if (isReady) {
                statusEl = <span className="text-primary font-medium">Redeem & apply →</span>;
              } else if (canAfford && !meetsMinCart) {
                statusEl = (
                  <span className="text-muted-foreground">
                    Add {formatPrice(cartShort)} to cart
                  </span>
                );
              } else if (canAfford && !isAuthenticated) {
                statusEl = <span className="text-muted-foreground">Sign in to redeem</span>;
              } else {
                statusEl = (
                  <span className="text-muted-foreground">
                    {pointsShort.toLocaleString()} pts to unlock
                  </span>
                );
              }

              return (
                <button
                  key={tier.points}
                  disabled={!isReady || isRedeeming}
                  onClick={() => handleRedeem(tier.points)}
                  className={`w-full text-left p-3 rounded-lg border transition-all relative overflow-hidden ${
                    isReady
                      ? "border-primary/40 bg-primary/5 hover:border-primary hover:bg-primary/10 cursor-pointer"
                      : "border-border/50 bg-secondary/20 cursor-not-allowed"
                  }`}
                >
                  {/* Progress bar fill (only when locked by points) */}
                  {!canAfford && progress > 0 && (
                    <div
                      className="absolute inset-y-0 left-0 bg-primary/5 pointer-events-none"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                  <div className="relative flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                          isReady
                            ? "bg-primary/20 text-primary"
                            : canAfford
                            ? "bg-primary/10 text-primary/70"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isReady ? (
                          <Zap size={16} />
                        ) : canAfford ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <Lock size={14} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            canAfford ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {formatPrice(tier.credit)} off
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tier.points.toLocaleString()} pts • Min cart {formatPrice(tier.minCart)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs shrink-0 text-right">{statusEl}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      <p className="text-[10px] text-muted-foreground/60 mt-3">
        One credit per order. Points are deducted at the moment you redeem.
      </p>
    </div>
  );
};

export default CreditRedemption;
