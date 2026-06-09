import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/data/products";
import { products } from "@/data/products";
import type { ProductSEOData } from "@/data/productSEO";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComplianceBanner from "@/components/ComplianceBanner";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  useInquiryCart,
  AUTOSHIP_DISCOUNT,
  THREE_PACK_DISCOUNT,
  THREE_PACK_AUTOSHIP_INTERVAL_DAYS,
} from "@/contexts/InquiryCartContext";
import { SITEWIDE_SALE } from "@/config/sale";
import { toast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  ArrowLeft,
  Activity,
  Check,
  Droplets,
  ExternalLink,
  FileText,
  Mail,
  Minus,
  Plus,
  ShieldCheck,
  Target,
  Zap,
} from "lucide-react";

const formatPrice = (p: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p);

interface BespokeProps {
  product: Product;
  seo?: ProductSEOData;
}

/** The two peptides that make up the 10mg Wolverine Blend vial. */
const COMPOSITION = [
  {
    code: "BPC-157",
    dose: "5 mg",
    pct: 50,
    focus: "Localized tissue & gut research",
    blurb:
      "A synthetic pentadecapeptide derived from a gastric protein, studied in preclinical models for connective-tissue, tendon, and gastrointestinal repair pathways.",
  },
  {
    code: "TB-500",
    dose: "5 mg",
    pct: 50,
    focus: "Systemic cell-migration research",
    blurb:
      "A synthetic fragment of Thymosin β4, investigated for its role in actin regulation, cell migration, and angiogenesis across systemic tissue models.",
  },
];

const MECHANISM = [
  {
    icon: Target,
    title: "Localized + Systemic",
    body: "BPC-157 is studied at the site of injury while TB-500 is investigated for broader, circulating activity — the reason researchers pair them in a single protocol.",
  },
  {
    icon: Activity,
    title: "Actin & Angiogenesis",
    body: "TB-500's actin-binding fragment is a frequent subject of cell-migration and new-vessel-formation studies in regenerative research models.",
  },
  {
    icon: Zap,
    title: "Connective Tissue",
    body: "BPC-157 appears across the tendon, ligament, and gastrointestinal literature as a reference compound for tissue-integrity assays.",
  },
];

const SPECS = [
  { label: "Total Mass", value: "10 mg" },
  { label: "Composition", value: "BPC-157 5mg · TB-500 5mg" },
  { label: "Purity", value: "≥99% (HPLC)" },
  { label: "Form", value: "Lyophilized powder" },
  { label: "Testing", value: "Independent analytical verification" },
  { label: "Documentation", value: "Batch-specific CoA" },
];

const WolverineProduct = ({ product, seo }: BespokeProps) => {
  const navigate = useNavigate();
  const { addItem, add3Pack, openCart } = useInquiryCart();
  const [qty, setQty] = useState(1);

  const { name, size, price, originalPrice, image, coa, references } = product;

  const salePrice = SITEWIDE_SALE.active ? price * (1 - SITEWIDE_SALE.discount) : price;
  const strikePrice = SITEWIDE_SALE.active ? price : originalPrice;
  const subPrice = salePrice * (1 - AUTOSHIP_DISCOUNT);
  const threePackUnit = salePrice * (1 - THREE_PACK_DISCOUNT);
  const threePackTotal = threePackUnit * 3;

  const lowStock =
    !product.outOfStock &&
    product.stock !== undefined &&
    product.stock > 0 &&
    product.stock <= 5;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product, { isAutoship: false });
    toast({ title: "Added to cart", description: `${name} ${size} × ${qty}` });
    openCart();
  };
  const handle3Pack = () => {
    add3Pack(product, { isAutoship: false });
    toast({ title: "3-Pack added", description: `${name} × 3` });
    openCart();
  };
  const handleSubscribe = () => {
    addItem(product, { isAutoship: true });
    toast({ title: "Subscription added", description: `${name} ships every 30 days.` });
    openCart();
  };

  const crossSell = products.filter((p) => p.id === "bpc-157" || p.id === "tb-500");

  const BASE_URL = "https://vertexresearchlabs.com";
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${name} ${size} – Research Grade`,
    description: seo?.metaDescription ?? product.description,
    brand: { "@type": "Brand", name: "Vertex Research Labs" },
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: salePrice.toFixed(2),
      availability: product.outOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      url: `${BASE_URL}/product/${product.id}`,
      seller: { "@type": "Organization", name: "Vertex Research Labs" },
    },
  };
  const faqSchema = seo?.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: seo.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEOHead
        title={seo?.metaTitle ?? `${name} ${size} | BPC-157 + TB-500 Research Blend`}
        description={
          seo?.metaDescription ??
          `Wolverine Blend — BPC-157 (5mg) + TB-500 (5mg) dual-peptide research material. ≥99% purity, batch-specific CoA. For laboratory research use only.`
        }
        canonical={`/product/${product.id}`}
        ogType="product"
        keywords={seo?.keywords ?? []}
        jsonLd={[productSchema, ...(faqSchema ? [faqSchema] : [])]}
      />
      <ComplianceBanner />
      <Header />

      <main className="flex-1 pb-32 md:pb-16">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden border-b border-border">
          {/* Atmospheric background */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 78% 18%, hsl(172 66% 50% / 0.16), transparent 45%), radial-gradient(circle at 12% 90%, hsl(217 91% 60% / 0.12), transparent 50%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(211 35% 18% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(211 35% 18% / 0.5) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage: "radial-gradient(circle at 70% 30%, black, transparent 75%)",
            }}
          />

          <div className="container relative mx-auto px-6 pt-24">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 mb-6 text-muted-foreground hover:text-foreground"
              onClick={() => navigate("/#products")}
            >
              <ArrowLeft size={14} />
              Back to Catalog
            </Button>

            <div className="grid items-center gap-10 pb-16 lg:grid-cols-[5fr_6fr]">
              {/* Product image with glow */}
              <div className="relative mx-auto w-full max-w-md">
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full blur-3xl"
                  style={{ background: "radial-gradient(circle, hsl(172 66% 50% / 0.22), transparent 60%)" }}
                />
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm">
                  {image && (
                    <img
                      src={image}
                      alt={`${name} — BPC-157 and TB-500 research blend vial`}
                      className="h-full w-full scale-[1.45] object-contain object-center"
                    />
                  )}
                  {product.isNew && (
                    <span className="absolute left-4 top-4 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                      New
                    </span>
                  )}
                </div>
              </div>

              {/* Headline + buy */}
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                  Dual-Peptide Recovery Blend
                </p>
                <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] text-foreground md:text-6xl">
                  Wolverine
                  <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Blend
                  </span>
                </h1>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                  Two of the most-studied regenerative research peptides — BPC-157 and
                  TB-500 — combined in a single 10&nbsp;mg vial. The pairing researchers
                  reach for when one protocol needs both localized and systemic coverage.
                </p>

                {/* Composition chips */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {COMPOSITION.map((c) => (
                    <span
                      key={c.code}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground"
                    >
                      <Droplets size={13} className="text-primary" />
                      {c.code}
                      <span className="text-muted-foreground">{c.dose}</span>
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="mt-7 flex items-end gap-3">
                  <span className="font-display text-4xl font-bold text-primary">
                    {formatPrice(salePrice)}
                  </span>
                  {strikePrice && strikePrice > salePrice && (
                    <span className="mb-1 text-lg text-muted-foreground line-through">
                      {formatPrice(strikePrice)}
                    </span>
                  )}
                  {strikePrice && strikePrice > salePrice && (
                    <span className="mb-1.5 rounded-md bg-accent/15 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-accent">
                      Save {Math.round(((strikePrice - salePrice) / strikePrice) * 100)}%
                    </span>
                  )}
                </div>

                {lowStock && (
                  <p className="mt-3 flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wider text-amber-500">
                    <AlertTriangle size={13} className="shrink-0" />
                    Low stock — order soon
                  </p>
                )}

                {/* Buy controls */}
                {product.outOfStock ? (
                  <p className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 font-mono text-xs uppercase tracking-wider text-amber-400">
                    Currently out of stock — restock pending
                  </p>
                ) : (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-stretch gap-3">
                      <div className="inline-flex items-center rounded-lg border border-border bg-card">
                        <button
                          type="button"
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          className="px-3 text-muted-foreground hover:text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={15} />
                        </button>
                        <span className="w-9 text-center font-mono text-sm text-foreground">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty((q) => Math.min(10, q + 1))}
                          className="px-3 text-muted-foreground hover:text-foreground"
                          aria-label="Increase quantity"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                      <Button
                        size="lg"
                        onClick={handleAdd}
                        className="h-12 flex-1 bg-primary text-base text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus size={18} />
                        Add to Cart
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={handle3Pack}
                        className="h-11 justify-between border-primary/30 bg-primary/5 px-3 text-xs hover:bg-primary/10"
                      >
                        <span>3-Pack · Save 10%</span>
                        <span className="font-mono text-primary">{formatPrice(threePackTotal)}</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleSubscribe}
                        className="h-11 justify-between border-border px-3 text-xs hover:border-primary/30"
                      >
                        <span>Subscribe · Save 10%</span>
                        <span className="font-mono text-primary">{formatPrice(subPrice)}/mo</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Trust row */}
                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5">
                  {["≥99% Purity", "Batch-Specific CoA", "Lyophilized", "Research Use Only"].map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check size={13} className="text-primary" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHAT'S IN THE VIAL ===== */}
        <section className="container mx-auto px-6 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              What's in the vial
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              A 1:1 split of two complementary research peptides — 10&nbsp;mg total.
            </p>
          </div>

          {/* Split bar */}
          <div className="mx-auto mt-8 flex max-w-3xl overflow-hidden rounded-lg border border-border font-mono text-xs">
            {COMPOSITION.map((c, i) => (
              <div
                key={c.code}
                className={`flex items-center justify-between px-4 py-3 ${
                  i === 0 ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
                }`}
                style={{ width: `${c.pct}%` }}
              >
                <span className="font-semibold uppercase tracking-wider">{c.code}</span>
                <span>{c.dose}</span>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-6 grid max-w-3xl gap-5 sm:grid-cols-2">
            {COMPOSITION.map((c) => (
              <div key={c.code} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">{c.code}</h3>
                  <span className="font-mono text-sm text-primary">{c.dose}</span>
                </div>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {c.focus}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== WHY PAIR THEM ===== */}
        <section className="border-y border-border bg-card/40">
          <div className="container mx-auto px-6 py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Why researchers pair them
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                The two peptides are studied for overlapping but distinct pathways — together
                they cover more of the regenerative-research surface than either alone.
              </p>
            </div>
            <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-3">
              {MECHANISM.map((m) => (
                <div key={m.title} className="rounded-xl border border-border bg-background/60 p-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <m.icon size={20} />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-foreground">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SPECS + COA ===== */}
        <section className="container mx-auto px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Specifications</h2>
              <dl className="mt-6 divide-y divide-border/60 rounded-xl border border-border bg-card">
                {SPECS.map((s) => (
                  <div key={s.label} className="flex items-center justify-between px-5 py-3.5 text-sm">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="text-right font-mono text-foreground">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex flex-wrap gap-3">
                {coa && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                        <FileText size={14} />
                        View Certificate of Analysis
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] max-w-3xl overflow-auto">
                      <DialogHeader>
                        <DialogTitle>Certificate of Analysis — {name}</DialogTitle>
                      </DialogHeader>
                      <img src={coa} alt={`Certificate of Analysis for ${name}`} className="mt-2 w-full rounded-md border border-border" />
                    </DialogContent>
                  </Dialog>
                )}
                <Button asChild variant="outline" size="sm" className="border-border">
                  <a href={`mailto:info@vertexresearchlabs.com?subject=CoA Request — ${name} ${size}`}>
                    <Mail size={14} />
                    Request CoA
                  </a>
                </Button>
              </div>
            </div>

            {seo?.researchSummary && (
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-primary" />
                  <h2 className="font-display text-lg font-semibold text-foreground">Research Overview</h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{seo.researchSummary}</p>
                <p className="mt-4 rounded-md border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-amber-400/90">
                  For laboratory research use only. Not for human or veterinary consumption.
                  References are provided for scientific context and are not claims.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ===== FAQ ===== */}
        {seo?.faqs && seo.faqs.length > 0 && (
          <section className="container mx-auto px-6 pb-16">
            <h2 className="mb-5 font-display text-2xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <Accordion type="multiple" className="mx-auto max-w-3xl space-y-2">
              {seo.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="rounded-lg border border-border bg-card px-5">
                  <AccordionTrigger className="py-4 text-left text-sm font-medium text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* ===== REFERENCES ===== */}
        {references && references.length > 0 && (
          <section className="container mx-auto px-6 pb-16">
            <Accordion type="single" collapsible className="mx-auto max-w-3xl">
              <AccordionItem value="references" className="rounded-lg border border-border bg-card px-5">
                <AccordionTrigger className="py-4 text-sm font-semibold text-foreground hover:no-underline">
                  Selected Research & References
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <ul className="space-y-2">
                    {references.map((ref, idx) => (
                      <li key={idx} className="rounded-md border border-border/60 bg-background/30 p-3">
                        <p className="text-sm text-foreground">
                          {ref.authors}, <span className="text-muted-foreground">{ref.journal}</span> ({ref.year})
                        </p>
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          {ref.title}
                          <ExternalLink size={12} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        )}

        {/* ===== CROSS-SELL ===== */}
        {crossSell.length > 0 && (
          <section className="border-t border-border">
            <div className="container mx-auto px-6 py-16">
              <h2 className="mb-2 font-display text-2xl font-bold text-foreground">
                Prefer them separately?
              </h2>
              <p className="mb-8 text-sm text-muted-foreground">
                The Wolverine Blend's two components are also available as standalone vials.
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
                {crossSell.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Mobile sticky add to cart */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-popover/95 px-4 py-3 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{size}</p>
            <p className="font-display text-base font-bold text-primary">{formatPrice(salePrice)}</p>
          </div>
          <Button
            disabled={product.outOfStock}
            className="ml-auto h-11 flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleAdd}
          >
            <Plus size={16} />
            {product.outOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WolverineProduct;
