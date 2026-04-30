import { Truck, ShieldCheck, FlaskConical, Award, FileCheck, Zap, Microscope, Lock } from "lucide-react";

const items = [
  { icon: Truck, label: "Fast US 2–3 Day Shipping" },
  { icon: ShieldCheck, label: "≥99% Purity Reports" },
  { icon: FlaskConical, label: "For Research Use Only" },
  { icon: FileCheck, label: "Certificate of Analysis" },
  { icon: Microscope, label: "Independent Third-Party Tested" },
  { icon: Award, label: "Pharmaceutical Grade Materials" },
  { icon: Zap, label: "Same-Day Order Processing" },
  { icon: Lock, label: "Discreet Packaging" },
];

const TickerBar = () => {
  // Duplicate the list so the marquee loops seamlessly
  const loop = [...items, ...items];

  return (
    <section
      aria-label="Service highlights"
      className="relative w-full overflow-hidden border-y border-border/60 bg-background/80 py-3 backdrop-blur-sm"
    >
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

      <div className="group flex">
        <div className="flex shrink-0 animate-ticker items-center gap-12 pr-12 group-hover:[animation-play-state:paused]">
          {loop.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.label}-${idx}`}
                className="flex shrink-0 items-center gap-2.5"
              >
                <Icon size={14} className="text-primary" strokeWidth={2} />
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/80">
                  {item.label}
                </span>
                <span className="ml-12 inline-block h-1 w-1 rounded-full bg-primary/40" aria-hidden />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TickerBar;
