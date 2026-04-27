import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Gift, X, Zap, Lock, Loader2 } from "lucide-react";
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

const CreditRedemption = ({
  profileId,
  email,
  cartTotal,
  pointsBalance = 0,
  isAuthenticated = false,
  selectedCredit,
  onSelectCredit,
}: CreditRedemptionProps) => {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [redeemingPoints, setRedeemingPoints] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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

  // Load credits via email lookup (guest checkout) — debounced
  useEffect(() => {
    if (profileId) return;
    const trimmed = (email || "").trim();
    if (!trimmed || !trimmed.includes("@") || trimmed.length < 5) {
      setCredits([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const { data } = await supabase.functions.invoke("lookup-credits", {
          body: { email: trimmed },
        });
        if (data?.credits) setCredits(data.credits as Credit[]);
        else setCredits([]);
      } catch {
        setCredits([]);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [email, profileId]);

  const hasActiveCredit = credits.length > 0;

  // Show redeemable tiers only when logged in AND no active credit exists
  const availableTiers = useMemo(() => {
    if (!isAuthenticated || hasActiveCredit) return [];
    return REWARD_TIERS;
  }, [isAuthenticated, hasActiveCredit]);

  const handleRedeem = async (points: number) => {
    setRedeemingPoints(points);
    try {
      const { data, error } = await supabase.functions.invoke("redeem-credit", {
        body: { points },
      });
      if (error || data?.error) {
        toast.error(data?.error || error?.message || "Could not redeem points");
        return;
      }
      toast.success("Credit unlocked & ready to apply!");
      // Auto-apply the new credit
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

  // Hide entirely if guest with no credits found
  if (!isAuthenticated && credits.length === 0) return null;
  // Hide if logged in but has no points and no credits
  if (isAuthenticated && credits.length === 0 && pointsBalance < REWARD_TIERS[0].points) return null;

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
          <Gift size={20} className="text-primary" />
          Vertex Rewards
        </h2>
        {isAuthenticated && (
          <span className="text-xs text-muted-foreground">
            <span className="text-primary font-semibold">{pointsBalance.toLocaleString()}</span> pts available
          </span>
        )}
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
                        : `Min cart ${formatPrice(credit.min_cart)} required`}
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
            Redeem your points instantly — applies to this order.
          </p>
          <div className="space-y-2">
            {availableTiers.map((tier) => {
              const canAfford = pointsBalance >= tier.points;
              const meetsMinCart = cartTotal >= tier.minCart;
              const isRedeeming = redeemingPoints === tier.points;
              const disabled = !canAfford || !meetsMinCart || isRedeeming;

              return (
                <button
                  key={tier.points}
                  disabled={disabled}
                  onClick={() => handleRedeem(tier.points)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    !disabled
                      ? "border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/10 cursor-pointer"
                      : "border-border/50 bg-secondary/20 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                          canAfford ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {canAfford ? <Zap size={16} /> : <Lock size={14} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {formatPrice(tier.credit)} off
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tier.points.toLocaleString()} pts • Min cart {formatPrice(tier.minCart)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium shrink-0">
                      {isRedeeming ? (
                        <Loader2 size={14} className="animate-spin text-primary" />
                      ) : !canAfford ? (
                        <span className="text-muted-foreground">
                          {(tier.points - pointsBalance).toLocaleString()} pts to unlock
                        </span>
                      ) : !meetsMinCart ? (
                        <span className="text-muted-foreground">Add more to cart</span>
                      ) : (
                        <span className="text-primary">Redeem & apply →</span>
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      <p className="text-[10px] text-muted-foreground/60 mt-3">
        One credit per order. {selectedCredit ? `Max ${selectedCredit.max_percent}% of cart value.` : "Points are deducted at redemption."}
      </p>
    </div>
  );
};

export default CreditRedemption;
