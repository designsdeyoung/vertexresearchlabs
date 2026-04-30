import { BadgeCheck, Microscope, FileCheck, ShieldCheck, Lock } from "lucide-react";

const stats = [
  { icon: BadgeCheck, label: "≥99% Purity" },
  { icon: Microscope, label: "3rd-Party Tested" },
  { icon: FileCheck, label: "CoA Every Lot" },
  { icon: ShieldCheck, label: "ISO 17025 Labs" },
  { icon: Lock, label: "Secure Checkout" },
];

const TrustBar = () => {
  return (
    <section
      aria-label="Trust and verification"
      className="border-y border-border bg-card/40"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 divide-x divide-border sm:grid-cols-3 md:grid-cols-5">
          {stats.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center justify-center gap-2 py-4 text-foreground"
            >
              <Icon size={15} className="text-primary" aria-hidden="true" />
              <span className="font-display text-xs font-semibold tracking-wide sm:text-sm">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
