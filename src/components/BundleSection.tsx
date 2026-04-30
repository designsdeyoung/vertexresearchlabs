import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Beaker, FlaskConical, Layers, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useInquiryCart } from "@/contexts/InquiryCartContext";
import { toast } from "@/hooks/use-toast";

type BundleKey = "popular-stack" | "beginner-kit" | "top-protocols";

interface Bundle {
  key: BundleKey;
  eyebrow: string;
  title: string;
  blurb: string;
  icon: typeof Beaker;
  productIds: string[];
  /** Discount applied vs. sum of unit prices, displayed only. */
  bundleDiscountPct: number;
}

const BUNDLES: Bundle[] = [
  {
    key: "popular-stack",
    eyebrow: "Most Popular Stack",
    title: "Lab Essentials Stack",
    blurb:
      "The three compounds researchers add to nearly every order. Pre-bundled at a research-grade discount.",
    icon: Layers,
    productIds: ["retatrutide", "ghk-cu", "bac-water-3ml"],
    bundleDiscountPct: 10,
  },
  {
    key: "beginner-kit",
    eyebrow: "Beginner Research Kit",
    title: "Starter Reference Set",
    blurb:
      "Everything a new lab needs to begin reconstitution and handling work — compound, diluent, and structural reference.",
    icon: Beaker,
    productIds: ["bpc-157", "bac-water-10ml", "ghk-cu"],
    bundleDiscountPct: 10,
  },
  {
    key: "top-protocols",
    eyebrow: "Top Protocols",
    title: "Advanced Reference Series",
    blurb:
      "Curated reference compounds frequently cited together in published peptide methodology literature.",
    icon: FlaskConical,
    productIds: ["mots-c", "cjc-ipa-blend", "wolverine-blend"],
    bundleDiscountPct: 10,
  },
];

const BundleSection = () => {
  const { addItem } = useInquiryCart();

  const enriched = useMemo(
    () =>
      BUNDLES.map((b) => {
        const items = b.productIds
          .map((id) => products.find((p) => p.id === id))
          .filter((p): p is (typeof products)[number] => Boolean(p));
        const subtotal = items.reduce((sum, p) => sum + p.price, 0);
        const bundlePrice = +(subtotal * (1 - b.bundleDiscountPct / 100)).toFixed(2);
        const savings = +(subtotal - bundlePrice).toFixed(2);
        return { ...b, items, subtotal, bundlePrice, savings };
      }),
    [],
  );

  const addBundle = (bundle: (typeof enriched)[number]) => {
    bundle.items.forEach((p) => addItem(p));
    toast({
      title: "Bundle added to inquiry",
      description: `${bundle.items.length} items from "${bundle.title}" added.`,
    });
  };

  return (
    <section id="bundles" className="border-t border-border bg-popover/40 py-16 md:py-24">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
            Curated Bundles
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Research Stacks &amp; Reference Kits
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Pre-built sets of frequently co-purchased reference compounds. Lab tested,
            COA-backed, ready for documented research workflows.
          </p>
        </div>

        {/* Bundle grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {enriched.map((bundle) => {
            const Icon = bundle.icon;
            return (
              <article
                key={bundle.key}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-[0_0_40px_-12px_hsl(var(--primary)/0.35)]"
              >
                {/* Eyebrow chip */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                    <Icon size={11} />
                    {bundle.eyebrow}
                  </span>
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                    Save {bundle.bundleDiscountPct}%
                  </span>
                </div>

                {/* Title + blurb */}
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {bundle.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{bundle.blurb}</p>

                {/* Image strip */}
                <div className="mt-5 flex items-end justify-center gap-2 rounded-xl bg-background/60 p-4">
                  {bundle.items.map((p, i) => (
                    <div
                      key={p.id}
                      className="relative aspect-square w-1/3 overflow-hidden rounded-lg border border-border bg-popover/60"
                      style={{
                        transform: `translateY(${i === 1 ? "-6px" : "0"})`,
                      }}
                    >
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-contain p-1.5"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          {p.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Items list */}
                <ul className="mt-5 space-y-1.5">
                  {bundle.items.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between text-xs text-muted-foreground"
                    >
                      <span className="flex items-center gap-1.5">
                        <Check size={12} className="text-primary" />
                        <span className="text-foreground/90">{p.name}</span>
                        <span className="text-muted-foreground">· {p.size}</span>
                      </span>
                      <span className="font-mono">${p.price}</span>
                    </li>
                  ))}
                </ul>

                {/* Price block */}
                <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Bundle Price
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-2xl font-bold text-foreground">
                        ${bundle.bundlePrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        ${bundle.subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <p className="text-right font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                    Save ${bundle.savings.toFixed(2)}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => addBundle(bundle)}
                    className="flex-1"
                    size="sm"
                  >
                    Add Bundle
                  </Button>
                  <Button asChild variant="outline" size="sm" className="px-3">
                    <Link to={`/product/${bundle.items[0].id}`} aria-label="View details">
                      <ArrowRight size={14} />
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Compliance footnote */}
        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
          For laboratory research use only · Not for human or veterinary use
        </p>
      </div>
    </section>
  );
};

export default BundleSection;
