import { useEffect, useState } from "react";
import { REWARD_TIERS } from "@/hooks/useRewards";
import { Gift, Lock, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface RewardsLadderProps {
  balance: number;
  profileId?: string;
  onRedeemed?: () => Promise<void> | void;
}

interface ActiveCredit {
  id: string;
  amount: number;
  expires_at: string;
}

const RewardsLadder = ({ balance, profileId, onRedeemed }: RewardsLadderProps) => {
  const [redeemingPoints, setRedeemingPoints] = useState<number | null>(null);
  const [activeCredit, setActiveCredit] = useState<ActiveCredit | null>(null);

  useEffect(() => {
    if (!profileId) {
      setActiveCredit(null);
      return;
    }

    supabase
      .from("credits")
      .select("id, amount, expires_at")
      .eq("profile_id", profileId)
      .eq("status", "active")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setActiveCredit((data as ActiveCredit | null) ?? null);
      });
  }, [profileId]);

  const handleRedeem = async (points: number) => {
    if (activeCredit) {
      toast({
        title: "Credit already active",
        description: "Use your existing checkout credit before redeeming another one.",
      });
      return;
    }

    setRedeemingPoints(points);

    try {
      const { data, error } = await supabase.functions.invoke("redeem-credit", {
        body: { points },
      });

      let errorMessage: string | null = null;
      if (error) {
        // supabase-js wraps non-2xx in FunctionsHttpError; parse the response body for our error field
        const ctx = (error as any).context;
        if (ctx && typeof ctx.json === "function") {
          try {
            const body = await ctx.json();
            errorMessage = body?.error ?? null;
          } catch {
            // ignore parse errors
          }
        }
        errorMessage = errorMessage || error.message;
      } else if (!data?.success) {
        errorMessage = data?.error || "Please try again.";
      }

      if (errorMessage) {
        toast({
          title: errorMessage.includes("unused credit") ? "Credit already active" : "Unable to redeem",
          description: errorMessage.includes("unused credit")
            ? "Use your existing checkout credit before redeeming another one."
            : errorMessage,
          variant: errorMessage.includes("unused credit") ? "default" : "destructive",
        });
        return;
      }

      toast({
        title: "Credit ready",
        description: `${data.credit.amount ? `$${data.credit.amount}` : "Your"} credit is now available at checkout.`,
      });

      setActiveCredit({
        id: data.credit.id,
        amount: data.credit.amount,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });

      await onRedeemed?.();
    } catch (error) {
      toast({
        title: "Unable to redeem",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setRedeemingPoints(null);
    }
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Gift size={16} className="text-primary" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">Rewards Ladder</span>
      </div>

      {activeCredit ? (
        <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <p className="text-sm font-medium text-foreground">${activeCredit.amount} credit is already active</p>
          <p className="text-xs text-muted-foreground">Use it at checkout before redeeming another reward.</p>
        </div>
      ) : null}

      <div className="space-y-3">
        {REWARD_TIERS.map((tier) => {
          const unlocked = balance >= tier.points;
          const canRedeem = unlocked && !activeCredit;
          return (
            <div
              key={tier.points}
              className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                canRedeem
                  ? "border-primary/30 bg-primary/5"
                  : "border-border/50 bg-secondary/20 opacity-70"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  canRedeem ? "bg-primary/20" : "bg-secondary"
                }`}
              >
                {canRedeem ? (
                  <CheckCircle2 size={18} className="text-primary" />
                ) : (
                  <Lock size={14} className="text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                  {tier.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tier.points.toLocaleString()} pts • Min cart ${tier.minCart}
                </p>
              </div>
              {unlocked ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRedeem(tier.points)}
                  disabled={redeemingPoints !== null || !!activeCredit}
                  className="shrink-0"
                >
                  <Sparkles size={14} />
                  {activeCredit ? "Active" : redeemingPoints === tier.points ? "Redeeming..." : "Redeem"}
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground/60 mt-4">
        Credits cannot stack or be used on the same order earned. Expire after 12 months of inactivity.
      </p>
    </div>
  );
};

export default RewardsLadder;
