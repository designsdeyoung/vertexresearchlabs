import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { productSEO } from "@/data/productSEO";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import ComplianceBanner from "@/components/ComplianceBanner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useInquiryCart,
  THREE_PACK_DISCOUNT,
  AUTOSHIP_DISCOUNT,
} from "@/contexts/InquiryCartContext";
import { SITEWIDE_SALE } from "@/config/sale";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ChevronDown,
  ExternalLink,
  FileText,
  FlaskConical,
  Mail,
  Package,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const formatPrice = (p: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p);

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem, add3Pack, openCart } = useInquiryCart();
  const [qty, setQty] = useState(1);
  const [subOpen, setSubOpen] = useState(false);

  const product = products.find((p) => p.id === productId);
  const seo = productId ? productSEO[productId] : undefined;

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <ComplianceBanner />
        <Header />
        <main className="flex flex-1 items-center justify-center pt-24">
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Product Not Found
            </h1>
            <Button className="mt-6" onClick={() => navigate("/")}>
              Return to Catalog
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { name, subtitle, size, purity, image, category, coa, references, price } = product;

  const salePrice = SITEWIDE_SALE.active ? price * (1 - SITEWIDE_SALE.discount) : price;
  const subPrice = salePrice * (1 - AUTOSHIP_DISCOUNT);
  const threePackUnit = salePrice * (1 - THREE_PACK_DISCOUNT);
  const threePackTotal = threePackUnit * 3;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product, { isAutoship: false });
    toast({ title: "Added to cart", description: `${name} ${size} × ${qty}` });
    openCart();
  };

  const handleSubscribe = () => {
    addItem(product, { isAutoship: true });
    toast({ title: "Subscription added", description: `${name} ships every 30 days.` });
    openCart();
  };

  const handle3Pack = () => {
    add3Pack(product, { isAutoship: false });
    toast({ title: "3-Pack added", description: `${name} × 3` });
    openCart();
  };

  const BASE_URL = "https://vertexresearchlabs.com";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${name} ${product.size} – Research Grade`,
    description: seo?.metaDescription ?? product.description,
    brand: { "@type": "Brand", name: "Vertex Research Labs" },
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/product/${product.id}`,
      seller: { "@type": "Organization", name: "Vertex Research Labs" },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Catalog", item: `${BASE_URL}/#products` },
      { "@type": "ListItem", position: 3, name, item: `${BASE_URL}/product/${product.id}` },
    ],
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
        title={seo?.metaTitle ?? `${name} ${size} | Research Grade Reference Material`}
        description={
          seo?.metaDescription ??
          `${name} ${size} — research-grade reference material with ≥99% purity. CoA available. For laboratory research use only.`
        }
        canonical={`/product/${product.id}`}
        ogType="product"
        keywords={seo?.keywords ?? []}
        jsonLd={[productSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])]}
      />
      <ComplianceBanner />
      <Header />

      <main className="flex-1 pb-32 pt-24 md:pb-16">
        <div className="container mx-auto px-6">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-6 text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/#products")}
          >
            <ArrowLeft size={14} />
            Back to Catalog
          </Button>

          <div className="grid gap-12 lg:grid-cols-[2fr_3fr]">
            {/* Left: Image */}
            <div>
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="aspect-square">
                  {image ? (
                    <img
                      src={image}
                      alt={`${name} ${size} research material`}
                      className="h-full w-full object-contain object-center scale-[1.5]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FlaskConical size={64} className="text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-primary">
                  ≥99% Purity
                </span>
                <span className="rounded-md border border-border px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {category}
                </span>
                {coa && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="ml-auto inline-flex items-center gap-1 text-xs text-primary hover:underline">
                        <FileText size={12} />
                        CoA Available Upon Request
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] max-w-3xl overflow-auto">
                      <DialogHeader>
                        <DialogTitle>Certificate of Analysis — {name}</DialogTitle>
                      </DialogHeader>
                      <img
                        src={coa}
                        alt={`Certificate of Analysis for ${name}`}
                        className="mt-2 w-full rounded-md border border-border"
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            {/* Right: Info */}
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                {name}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              )}

              {/* Spec key-values */}
              <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-border py-4 text-sm">
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Size
                  </dt>
                  <dd className="mt-1 text-foreground">{size}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Grade
                  </dt>
                  <dd className="mt-1 text-foreground">Research</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Category
                  </dt>
                  <dd className="mt-1 text-foreground">{category}</dd>
                </div>
              </dl>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-primary">
                  {formatPrice(salePrice)}
                </span>
                {SITEWIDE_SALE.active && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(price)}
                  </span>
                )}
              </div>

              {/* Quantity + add */}
              <div className="mt-5 flex items-center gap-3">
                <div className="flex items-center rounded-md border border-border bg-card">
                  <button
                    type="button"
                    className="px-3 py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={qty}
                    onChange={(e) =>
                      setQty(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))
                    }
                    className="h-10 w-14 border-0 bg-transparent text-center font-mono text-sm focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    className="px-3 py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <Button
                  size="lg"
                  disabled={product.outOfStock}
                  className="h-11 flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleAdd}
                >
                  <Plus size={16} />
                  {product.outOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>

              {product.outOfStock ? (
                <p className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/5 px-4 py-3 font-mono text-xs uppercase tracking-wider text-amber-400">
                  Currently out of stock — restock pending
                </p>
              ) : (
              <>
              {/* Subscribe */}
              <Collapsible open={subOpen} onOpenChange={setSubOpen} className="mt-4">
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground hover:border-primary/30">
                  <span>Subscribe & save extra 10% (stacks with 3-Pack & sale)</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${subOpen ? "rotate-180" : ""}`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <div className="mt-2 rounded-md border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-mono font-medium text-foreground">
                        {formatPrice(subPrice)}
                      </span>{" "}
                      / 30 days · Cancel anytime · Extra 10% off even on 3-Packs
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleSubscribe}
                      className="mt-3 w-full border-primary/40 text-primary hover:bg-primary/10 hover:text-primary"
                    >
                      Subscribe — {formatPrice(subPrice)}/mo
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* 3-Pack */}
              <div className="mt-3 flex items-center justify-between rounded-md border border-border bg-card px-4 py-3">
                <div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Package size={14} className="text-primary" />
                    3-Pack — Save 10%
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {formatPrice(threePackTotal)} ({formatPrice(threePackUnit)} each)
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handle3Pack}
                  className="border-border"
                >
                  Add 3-Pack
                </Button>
              </div>
              </>
              )}

              {/* Compliance */}
              <p className="mt-6 text-xs text-amber-400/90">
                For research use only. Not for human consumption.
              </p>

              {/* Spec table */}
              <div className="mt-8 border-t border-border pt-6">
                <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                  Specifications
                </h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-border/60 py-2">
                    <dt className="text-muted-foreground">Purity</dt>
                    <dd className="font-mono text-foreground">{purity}</dd>
                  </div>
                  <div className="flex justify-between border-b border-border/60 py-2">
                    <dt className="text-muted-foreground">Testing</dt>
                    <dd className="text-foreground">Independent analytical verification</dd>
                  </div>
                  <div className="flex justify-between py-2">
                    <dt className="text-muted-foreground">Documentation</dt>
                    <dd className="text-foreground">CoA available upon request</dd>
                  </div>
                </dl>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-4 border-border"
                >
                  <a href={`mailto:info@vertexresearchlabs.com?subject=CoA Request — ${name} ${size}`}>
                    <Mail size={14} />
                    Request CoA
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Research summary (kept for SEO) */}
          {seo?.researchSummary && (
            <div className="mt-16 rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">
                Research Overview
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {seo.researchSummary}
              </p>
            </div>
          )}

          {/* FAQs */}
          {seo?.faqs && seo.faqs.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
                Frequently Asked Questions
              </h2>
              <Accordion type="multiple" className="space-y-2">
                {seo.faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="rounded-lg border border-border bg-card px-5"
                  >
                    <AccordionTrigger className="py-4 text-left hover:no-underline">
                      <span className="text-sm font-medium text-foreground">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {/* References */}
          {references && references.length > 0 && (
            <div className="mt-8">
              <Accordion type="single" collapsible>
                <AccordionItem
                  value="references"
                  className="rounded-lg border border-border bg-card px-5"
                >
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <span className="text-sm font-semibold text-foreground">
                      Selected Research & References
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <p className="mb-4 rounded-md border border-border bg-background/40 p-3 text-xs text-muted-foreground">
                      The following peer-reviewed publications are provided for general
                      scientific reference only. They are not endorsements or claims.
                      All materials are for laboratory research use only.
                    </p>
                    <ul className="space-y-2">
                      {references.map((ref, idx) => (
                        <li
                          key={idx}
                          className="rounded-md border border-border/60 bg-background/30 p-3"
                        >
                          <p className="text-sm text-foreground">
                            {ref.authors},{" "}
                            <span className="text-muted-foreground">
                              {ref.journal}
                            </span>{" "}
                            ({ref.year})
                          </p>
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            {ref.url}
                            <ExternalLink size={12} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>
      </main>

      {/* Mobile sticky add to cart */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-popover/95 px-4 py-3 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {size}
            </p>
            <p className="font-display text-base font-bold text-primary">
              {formatPrice(salePrice)}
            </p>
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

export default ProductDetail;
