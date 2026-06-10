import { ShieldCheck, FileCheck, Lock, Truck } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    label: "Third-Party Tested",
    sub: "Independent lab verification",
  },
  {
    icon: FileCheck,
    label: "Batch Documentation",
    sub: "COAs for every batch",
  },
  {
    icon: Lock,
    label: "Secure Checkout",
    sub: "Encrypted checkout",
  },
  {
    icon: Truck,
    label: "Fast U.S. Shipping",
    sub: "Orders ship in 1–2 business days",
  },
];

const TrustBar = () => {
  return (
    <section aria-label="Trust and verification" className="relative z-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="glass-panel grid grid-cols-1 divide-y divide-border/50 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {items.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3.5 px-6 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                <Icon size={18} className="text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-foreground">
                  {label}
                </p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
