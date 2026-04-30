import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Repeat, Calendar, X, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Subscription {
  id: string;
  stripe_subscription_id: string;
  status: string;
  product_name: string;
  quantity: number;
  is_3pack: boolean;
  unit_amount: number;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
}

interface Props {
  profileId: string;
}

const formatPrice = (p: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p);

const SubscriptionsList = ({ profileId }: Props) => {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });
    setSubs((data as Subscription[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (profileId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  const handleCancel = async (sub: Subscription) => {
    if (!confirm(`Cancel autoship for ${sub.product_name}? It will stay active until the end of the current period.`)) {
      return;
    }
    setBusyId(sub.stripe_subscription_id);
    try {
      const { error } = await supabase.functions.invoke("manage-subscription", {
        body: { action: "cancel", subscriptionId: sub.stripe_subscription_id },
      });
      if (error) throw error;
      toast({ title: "Autoship canceled", description: "It will not renew at the end of this period." });
      await load();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not cancel.",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleResume = async (sub: Subscription) => {
    setBusyId(sub.stripe_subscription_id);
    try {
      const { error } = await supabase.functions.invoke("manage-subscription", {
        body: { action: "resume", subscriptionId: sub.stripe_subscription_id },
      });
      if (error) throw error;
      toast({ title: "Autoship resumed" });
      await load();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not resume.",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-lg p-6">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 size={14} className="animate-spin" /> Loading subscriptions…
        </div>
      </div>
    );
  }

  const active = subs.filter((s) => s.status !== "canceled");

  if (active.length === 0) {
    return (
      <div className="glass-card rounded-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <Repeat size={16} className="text-primary" />
          <h2 className="text-lg font-medium text-foreground">Subscribe & Save</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          You don't have any active autoships. Save 10% and earn 2× points on any product by switching to Subscribe & Save.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Repeat size={16} className="text-primary" />
        <h2 className="text-lg font-medium text-foreground">Active Autoships</h2>
      </div>
      <div className="space-y-3">
        {active.map((sub) => {
          const next = sub.current_period_end ? new Date(sub.current_period_end) : null;
          return (
            <div
              key={sub.id}
              className="p-4 rounded-lg bg-secondary/30 border border-border/50"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {sub.product_name}
                    {sub.is_3pack && <span className="ml-1.5 text-[10px] text-primary font-medium">· 3-Pack</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sub.quantity} × {formatPrice(sub.unit_amount)} · every 30 days
                  </p>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {formatPrice(sub.unit_amount * sub.quantity)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar size={12} />
                  {sub.cancel_at_period_end ? (
                    <span className="text-destructive">
                      Ends {next ? next.toLocaleDateString() : "soon"}
                    </span>
                  ) : (
                    <span>
                      Next: {next ? next.toLocaleDateString() : "—"}
                    </span>
                  )}
                </span>
                {sub.cancel_at_period_end ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    disabled={busyId === sub.stripe_subscription_id}
                    onClick={() => handleResume(sub)}
                  >
                    Resume
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-muted-foreground hover:text-destructive"
                    disabled={busyId === sub.stripe_subscription_id}
                    onClick={() => handleCancel(sub)}
                  >
                    <X size={12} />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionsList;
