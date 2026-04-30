import { Microscope, FileCheck, BadgeCheck, Truck } from "lucide-react";

const stats = [
  { icon: BadgeCheck, label: "≥99% Purity" },
  { icon: Microscope, label: "Third-Party Tested" },
  { icon: FileCheck, label: "CoA Available" },
  { icon: Truck, label: "Same-Day Shipping" },
];

const TrustBar = () => {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
          {stats.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center justify-center gap-2 py-5 text-foreground"
            >
              <Icon size={16} className="text-primary" aria-hidden="true" />
              <span className="font-display text-sm font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
