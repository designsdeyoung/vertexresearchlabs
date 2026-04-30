import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { articles } from "@/data/articles";
import { BookOpen, Clock, ArrowRight, FlaskConical, FileText } from "lucide-react";

const categoryColors: Record<string, string> = {
  "Research Overview": "bg-primary/10 text-primary border-primary/20",
  "Research Guide": "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const Learn = () => {
  const featuredArticles = articles.slice(0, 3);
  const remainingArticles = articles.slice(3);

  const learnSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Research Learning Center — Vertex Research Labs",
    description:
      "Peer-reviewed research overviews and laboratory guides for research peptides including BPC-157, GHK-Cu, Retatrutide, MOTS-c, and more.",
    url: "https://vertexresearchlabs.com/learn",
    publisher: {
      "@type": "Organization",
      name: "Vertex Research Labs",
      url: "https://vertexresearchlabs.com",
    },
    hasPart: articles.map((a) => ({
      "@type": "Article",
      headline: a.title,
      url: `https://vertexresearchlabs.com/learn/${a.slug}`,
      datePublished: a.publishedDate,
      dateModified: a.modifiedDate,
    })),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Research Learning Center | Peptide Science Guides & Overviews"
        description="In-depth research overviews and laboratory guides for BPC-157, GHK-Cu, Retatrutide, MOTS-c, Epithalon, and more. Peer-referenced, compliant, research-use context only."
        canonical="/learn"
        ogType="website"
        keywords={[
          "research peptide guides",
          "BPC-157 research overview",
          "GHK-Cu guide",
          "Retatrutide research",
          "MOTS-c peptide science",
          "how to read peptide COA",
          "research grade peptides explained",
          "peptide science articles",
          "peptide research library",
        ]}
        jsonLd={learnSchema}
      />
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6">

          {/* Page Header */}
          <div className="mb-14 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={20} className="text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Research Learning Center
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Peptide Science Library
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Peer-referenced research overviews, laboratory guides, and quality documentation for researchers. All content is for scientific reference only — no medical claims are made.
            </p>
          </div>

          {/* Featured Articles */}
          <div className="mb-16">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
              Featured Research Overviews
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/learn/${article.slug}`}
                  className="glass-card rounded-xl border-border/50 p-6 flex flex-col hover:border-primary/30 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${categoryColors[article.category] ?? "bg-secondary text-muted-foreground border-border"}`}>
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} />
                      {article.readTime} min
                    </span>
                  </div>
                  <h3 className="text-foreground font-semibold text-lg leading-snug mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-1 mt-5 text-primary text-sm font-medium">
                    Read overview <ArrowRight size={14} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* All Articles */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
              All Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {remainingArticles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/learn/${article.slug}`}
                  className="glass-card rounded-xl border-border/50 p-5 flex gap-4 items-start hover:border-primary/30 transition-colors group"
                >
                  <div className="mt-0.5 shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {article.category === "Research Guide" ? (
                      <FileText size={18} className="text-primary" />
                    ) : (
                      <FlaskConical size={18} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${categoryColors[article.category] ?? "bg-secondary text-muted-foreground border-border"}`}>
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={11} />
                        {article.readTime} min
                      </span>
                    </div>
                    <h3 className="text-foreground font-medium leading-snug group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-14 p-5 rounded-xl bg-secondary/30 border border-border/50">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Research Disclaimer:</strong> All articles in the Vertex Research Labs Learning Center are provided for scientific reference purposes only. Content is based on peer-reviewed published research and does not constitute medical advice, health claims, or endorsement of any therapeutic use. All reference materials supplied by Vertex Research Labs are intended strictly for laboratory research use only and are not for human or veterinary consumption.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Learn;
