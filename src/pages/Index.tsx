import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import ComplianceBanner from "@/components/ComplianceBanner";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import FeaturedPeptides from "@/components/FeaturedPeptides";
import CategoryCards from "@/components/CategoryCards";
import ProductCatalog from "@/components/ProductCatalog";
import QualityTransparency from "@/components/QualityTransparency";
import WhyVertex from "@/components/WhyVertex";
import NewsletterSection from "@/components/NewsletterSection";
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
      description:
        "Research-grade peptides and analytical reference materials with verified Certificates of Analysis.",
      sameAs: [],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Vertex Research Labs",
      url: "https://vertexresearchlabs.com",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEOHead
        title="Research-Grade Peptides | High-Purity Reference Materials – Vertex Research Labs"
        description="Analytical-grade research peptides with ≥99% purity (HPLC). Certificates of Analysis are available on request where applicable. For laboratory research use only."
        canonical="/"
        keywords={[
          "research peptides",
          "research grade peptides",
          "analytical reference materials",
          "peptides with COA",
          "high purity peptides",
        ]}
        jsonLd={homepageSchema}
      />
      <ComplianceBanner />
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <CategoryCards />
        {/* Featured rail + full catalog */}
        <FeaturedPeptides />
        <ProductCatalog />
        <QualityTransparency />
        <WhyVertex />
        <NewsletterSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
