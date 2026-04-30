import { useParams, Link, useNavigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { articles } from "@/data/articles";
import { products } from "@/data/products";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock,
  Calendar,
  BookOpen,
  FlaskConical,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-4">Article Not Found</h1>
            <Button variant="hero" onClick={() => navigate("/learn")}>
              Back to Learning Center
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProductObjects = article.relatedProducts
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  const relatedArticleObjects = article.relatedSlugs
    .map((s) => articles.find((a) => a.slug === s))
    .filter(Boolean);

  const BASE_URL = "https://vertexresearchlabs.com";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate,
    author: {
      "@type": "Organization",
      name: "Vertex Research Labs",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Vertex Research Labs",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/og-image.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/learn/${article.slug}` },
    keywords: article.keywords.join(", "),
    articleSection: article.category,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Learn", item: `${BASE_URL}/learn` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${BASE_URL}/learn/${article.slug}` },
    ],
  };

  const faqSchema = article.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={article.metaTitle}
        description={article.metaDescription}
        canonical={`/learn/${article.slug}`}
        ogType="article"
        keywords={article.keywords}
        jsonLd={[articleSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])]}
        article={{
          publishedTime: article.publishedDate,
          modifiedTime: article.modifiedDate,
          author: "Vertex Research Labs",
          section: article.category,
          tags: article.keywords.slice(0, 5),
        }}
      />
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">

          {/* Back nav */}
          <Button
            variant="ghost"
            size="sm"
            className="mb-8 -ml-2"
            onClick={() => navigate("/learn")}
          >
            <ArrowLeft size={16} />
            Research Library
          </Button>

          {/* Article Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={12} /> {article.readTime} min read
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={12} /> Updated {formatDate(article.modifiedDate)}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground leading-tight mb-5">
              {article.title}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed border-l-2 border-primary/40 pl-4">
              {article.excerpt}
            </p>
          </header>

          {/* Article Body */}
          <article className="prose-custom space-y-10 mb-14">
            {article.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-primary shrink-0" />
                  {section.heading}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                {section.list && section.list.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {section.list.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-muted-foreground">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>

          {/* FAQ Section */}
          {article.faqs.length > 0 && (
            <section className="mb-14">
              <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                <BookOpen size={20} className="text-primary" />
                Frequently Asked Questions
              </h2>
              <Accordion type="multiple" className="space-y-2">
                {article.faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="glass-card rounded-xl border-border/50 px-6"
                  >
                    <AccordionTrigger className="hover:no-underline text-left py-4">
                      <span className="font-medium text-foreground">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}

          {/* Related Products */}
          {relatedProductObjects.length > 0 && (
            <section className="mb-14">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">
                Related Research Materials
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relatedProductObjects.map((p) => p && (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="glass-card rounded-xl border-border/50 p-4 flex items-center gap-3 hover:border-primary/30 transition-colors group"
                  >
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <FlaskConical size={20} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-foreground font-medium text-sm truncate group-hover:text-primary transition-colors">
                        {p.name}
                      </div>
                      <div className="text-xs text-muted-foreground">{p.size} · {p.purity}</div>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related Articles */}
          {relatedArticleObjects.length > 0 && (
            <section className="mb-14">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">
                Related Articles
              </h2>
              <div className="space-y-3">
                {relatedArticleObjects.map((a) => a && (
                  <Link
                    key={a.slug}
                    to={`/learn/${a.slug}`}
                    className="glass-card rounded-xl border-border/50 p-4 flex items-center gap-4 hover:border-primary/30 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-foreground font-medium text-sm group-hover:text-primary transition-colors">
                        {a.title}
                      </div>
                      <div className="text-xs text-muted-foreground">{a.readTime} min · {a.category}</div>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Disclaimer */}
          <div className="flex items-start gap-3 p-5 rounded-xl bg-secondary/30 border border-border/50">
            <AlertTriangle size={16} className="text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              This article is provided for scientific reference only and is based on peer-reviewed published research. It does not constitute medical advice, a health claim, or a recommendation for any therapeutic use. All reference materials supplied by Vertex Research Labs are intended strictly for laboratory research use and are not for human or veterinary consumption.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticlePage;
