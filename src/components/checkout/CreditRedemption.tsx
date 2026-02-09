import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Gift, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  profileId: string;
  cartTotal: number;
  selectedCredit: { id: string; amount: number; points_cost: number; min_cart: number; max_percent: number } | null;
  onSelectCredit: (credit: { id: string; amount: number; points_cost: number; min_cart: number; max_percent: number } | null) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

const CreditRedemption = ({ profileId, cartTotal, selectedCredit, onSelectCredit }: CreditRedemptionProps) => {
  const [credits, setCredits] = useState<Credit[]>([]);

  useEffect(() => {
    supabase
      .from("credits")
      .select("*")
      .eq("profile_id", profileId)
      .eq("status", "active")
      .then(({ data }) => {
        if (data) setCredits(data as Credit[]);
      });
  }, [profileId]);

  if (credits.length === 0) return null;

  return (
    <div className="glass-card rounded-lg p-6">
      <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
        <Gift size={20} className="text-primary" />
        Apply Vertex Credit
      </h2>

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
      ) : (
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
      )}

      <p className="text-[10px] text-muted-foreground/60 mt-3">
        Credits cannot stack.{selectedCredit ? ` Max ${selectedCredit.max_percent}% of cart value.` : ""}
      </p>
    </div>
  );
};

export default CreditRedemption;
