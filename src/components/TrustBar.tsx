import { Microscope, FileCheck, BadgeCheck, Truck, ShieldCheck, Lock, Award, FlaskConical, Star, CreditCard } from "lucide-react";

const primary = [
  { icon: BadgeCheck, label: "≥99% Purity", sub: "HPLC Verified" },
  { icon: Microscope, label: "3rd-Party Tested", sub: "Independent Labs" },
  { icon: FileCheck, label: "CoA Available", sub: "Every Lot" },
  { icon: Truck, label: "Same-Day Shipping", sub: "Orders by 2PM EST" },
];

const badges = [
  { icon: ShieldCheck, label: "ISO 17025", sub: "Accredited Testing" },
  { icon: FlaskConical, label: "USP <1225>", sub: "Method Validated" },
  { icon: Award, label: "GMP Sourced", sub: "Pharma Grade" },
  { icon: Lock, label: "SSL Secured", sub: "256-bit Encryption" },
  { icon: CreditCard, label: "Bitcoin Accepted", sub: "Private Checkout" },
  { icon: Star, label: "4.9 / 5 Rated", sub: "Verified Researchers" },
];

const TrustBar = () => {
  return (
    <section
      aria-label="Trust and verification"
      className="border-y border-border bg-card/40"
    >
      <div className="container mx-auto px-6">
        {/* Primary stats */}
        <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
          {primary.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-1 py-5 text-foreground"
            >
              <div className="flex items-center gap-2">
                <Icon size={16} className="text-primary" aria-hidden="true" />
                <span className="font-display text-sm font-semibold">{label}</span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {sub}
              </span>
            </div>
          ))}
        </div>

        {/* Third-party / compliance badges */}
        <div className="border-t border-border/60 py-5">
          <div className="mb-3 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Independent Verification & Compliance
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {badges.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="group flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2.5 transition-all hover:border-primary/40 hover:bg-background/70"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/5">
                  <Icon size={14} className="text-primary" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-xs font-semibold leading-tight text-foreground">
                    {label}
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                    {sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
