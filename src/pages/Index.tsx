import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VialShowcase from "@/components/VialShowcase";

import PeptidePeriodicTable from "@/components/PeptidePeriodicTable";
import ProductCatalog from "@/components/ProductCatalog";
import QualitySection from "@/components/QualitySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  const homepageSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Vertex Research Labs",
      url: "https://vertexresearchlabs.com",
      logo: "https://vertexresearchlabs.com/og-image.png",
      description: "Ultra-high purity research peptides and analytical reference materials with verified COAs and strict quality standards.",
      sameAs: [],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Vertex Research Labs",
      url: "https://vertexresearchlabs.com",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://vertexresearchlabs.com/#products?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Research-Grade Peptides | High-Purity Reference Materials – Vertex Research Labs"
        description="Ultra-high purity research peptides with verified COAs. BPC-157, GHK-Cu, Retatrutide, TB-500, MOTS-c, Epithalon and more. ≥99% purity, HPLC tested, batch documented. Lab use only."
        canonical="/"
        keywords={[
          "research peptides",
          "buy research peptides",
          "high purity peptides",
          "research grade peptides",
          "BPC-157 research",
          "GHK-Cu copper peptide",
          "Retatrutide research",
          "best research peptides",
          "peptides with COA",
          "HPLC verified peptides",
          "99% purity peptides",
          "research peptide supplier",
          "peptide reference materials",
          "lab grade peptides",
          "trending research peptides 2025",
        ]}
        jsonLd={homepageSchema}
      />
      <Header />
      <main>
        <Hero />
        <section id="showcase">
          <VialShowcase />
        </section>
        
        <ProductCatalog />
        <PeptidePeriodicTable />
        <QualitySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
