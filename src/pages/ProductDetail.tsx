import { useState } from "react";
import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { products, DISCONTINUED_PRODUCT_IDS, SLUG_REDIRECTS, type Product } from "@/data/products";
import { productSEO } from "@/data/productSEO";
import { storageGuidance } from "@/lib/storageGuidance";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import ComplianceBanner from "@/components/ComplianceBanner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInquiryCart } from "@/contexts/InquiryCartContext";
import { SITEWIDE_SALE } from "@/config/sale";
import { toast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  FileText,
  FlaskConical,
  Mail,
  Minus,
  Plus,
  Snowflake,
  ClipboardList,
  ShieldAlert,
  type LucideIcon,
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

const formatPrice = (p: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p);

/** Neutral section wrapper — consistent heading + card for technical blocks. */
const TechSection = ({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-xl border border-border bg-card/60 p-6">
    <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
      <Icon size={16} className="text-muted-foreground" />
      {title}
    </h2>
    {children}
  </section>
);

/** Definition row for spec/storage tables. */
const SpecRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between gap-6 border-b border-border/50 py-2.5 last:border-0">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="text-right text-sm font-medium text-foreground">{value}</dd>
  </div>
);

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem, openCart } = useInquiryCart();
  const [qty, setQty] = useState(1);

  // Renamed products: permanently redirect old slugs to the new one.
  if (productId && SLUG_REDIRECTS[productId]) {
    return <Navigate to={`/product/${SLUG_REDIRECTS[productId]}`} replace />;
  }

  // Discontinued products: redirect old URLs to the catalog (no dead pages).
  if (productId && DISCONTINUED_PRODUCT_IDS.has(productId)) {
    return <Navigate to="/#products" replace />;
  }

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
            <Button className="mt-6" onClick={() => navigate("/#products")}>
              Return to Catalog
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { name, subtitle, size, purity, image, category, coa, references, price, description } =
    product;

  const salePrice = SITEWIDE_SALE.active ? price * (1 - SITEWIDE_SALE.discount) : price;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    toast({ title: "Added to cart", description: `${name} ${size} × ${qty}` });
    openCart();
  };

  const relatedIds = (seo?.relatedProducts ?? []).filter((id) => id !== product.id);
  const related = relatedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p) && !p!.outOfStock)
    .slice(0, 4);

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
      availability: product.outOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
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
        <div className="container mx-auto max-w-6xl px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => navigate("/#products")}
            >
              <ArrowLeft size={14} />
              Back to Catalog
            </Button>
          </nav>

          {/* Top: image + purchase panel */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            {/* Image */}
            <div>
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="aspect-square">
                  {image ? (
                    <img
                      src={image}
                      alt={`${name} ${size} research reference material vial`}
                      className="h-full w-full scale-[1.4] object-contain object-center"
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
                  {purity} Purity
                </span>
                <span className="rounded-md border border-border px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {category}
                </span>
              </div>
            </div>

            {/* Purchase panel */}
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{name}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>

              {/* Quick specs */}
              <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-border py-4 text-sm">
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Size
                  </dt>
                  <dd className="mt-1 text-foreground">{size}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Purity
                  </dt>
                  <dd className="mt-1 text-foreground">{purity}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Grade
                  </dt>
                  <dd className="mt-1 text-foreground">Research</dd>
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
                    <Minus size={16} />
                  </button>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={qty}
                    onChange={(e) =>
                      setQty(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))
                    }
                    aria-label="Quantity"
                    className="h-10 w-14 border-0 bg-transparent text-center font-mono text-sm focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    className="px-3 py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
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
                product.stock !== undefined &&
                product.stock > 0 &&
                product.stock <= 5 && (
                  <p className="mt-4 flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wider text-amber-500">
                    <AlertTriangle size={13} className="shrink-0" />
                    Low stock — order soon
                  </p>
                )
              )}

              <p className="mt-4 text-xs text-amber-400/90">
                For laboratory research use only. Not for human or veterinary use.
              </p>
            </div>
          </div>

          {/* Technical sections */}
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {/* Specifications */}
            <TechSection icon={ClipboardList} title="Specifications">
              <dl>
                <SpecRow label="Compound" value={name} />
                <SpecRow label="Presentation" value={`${size} vial`} />
                <SpecRow label="Purity" value={purity} />
                <SpecRow label="Category" value={category} />
                <SpecRow label="Testing" value="Independent analytical verification" />
                <SpecRow label="Grade" value="Research reference material" />
              </dl>
            </TechSection>

            {/* Documentation */}
            <TechSection icon={FileText} title="Documentation">
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Certificate of Analysis (CoA) available on request
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Identity and purity by analytical verification
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Lot-specific documentation on file
                </li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {coa && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="border-border">
                        <FileText size={14} />
                        View sample CoA
                      </Button>
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
                <Button asChild variant="outline" size="sm" className="border-border">
                  <a href={`mailto:info@vertexresearchlabs.com?subject=CoA Request — ${name} ${size}`}>
                    <Mail size={14} />
                    Request CoA
                  </a>
                </Button>
              </div>
            </TechSection>

            {/* Storage & handling */}
            <TechSection icon={Snowflake} title="Storage & Handling">
              <dl>
                {storageGuidance(product).map((row) => (
                  <SpecRow key={row.label} label={row.label} value={row.value} />
                ))}
              </dl>
            </TechSection>

            {/* Research notices */}
            <TechSection icon={ShieldAlert} title="Research Notices">
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ShieldAlert size={14} className="mt-0.5 shrink-0 text-amber-400" />
                  Supplied exclusively for laboratory and analytical research use.
                </li>
                <li className="flex items-start gap-2">
                  <ShieldAlert size={14} className="mt-0.5 shrink-0 text-amber-400" />
                  Not for human or veterinary use, ingestion, diagnosis, or treatment.
                </li>
                <li className="flex items-start gap-2">
                  <ShieldAlert size={14} className="mt-0.5 shrink-0 text-amber-400" />
                  Handling by qualified research personnel only.
                </li>
              </ul>
              <p className="mt-4 border-t border-border/50 pt-3 text-xs leading-relaxed text-muted-foreground/80">
                See our{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/disclaimer" className="text-primary hover:underline">
                  Disclaimer
                </Link>{" "}
                for full research-use conditions.
              </p>
            </TechSection>
          </div>

          {/* Research overview (SEO) */}
          {seo?.researchSummary && (
            <div className="mt-6 rounded-xl border border-border bg-card/60 p-6">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                Research Overview
              </h2>
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
                {seo.researchSummary}
              </p>
            </div>
          )}

          {/* FAQs */}
          {seo?.faqs && seo.faqs.length > 0 && (
            <div className="mt-10">
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
                      <span className="text-sm font-medium text-foreground">{faq.question}</span>
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
            <div className="mt-10">
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
                      The following peer-reviewed publications are provided for general scientific
                      reference only. They are not endorsements or claims. All materials are for
                      laboratory research use only.
                    </p>
                    <ul className="space-y-2">
                      {references.map((ref, idx) => (
                        <li
                          key={idx}
                          className="rounded-md border border-border/60 bg-background/30 p-3"
                        >
                          <p className="text-sm text-foreground">
                            {ref.authors},{" "}
                            <span className="text-muted-foreground">{ref.journal}</span> ({ref.year})
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

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
                Related Reference Materials
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to={`/product/${r.id}`}
                    className="group rounded-xl border border-border bg-card/60 p-4 transition-colors hover:border-primary/40"
                  >
                    <div className="aspect-square overflow-hidden rounded-lg bg-card">
                      {r.image ? (
                        <img
                          src={r.image}
                          alt={`${r.name} ${r.size}`}
                          loading="lazy"
                          className="h-full w-full scale-[1.4] object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <FlaskConical size={28} className="text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-sm font-medium text-foreground group-hover:text-primary">
                      {r.name}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {r.size} · {formatPrice(r.price)}
                    </p>
                  </Link>
                ))}
              </div>
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
