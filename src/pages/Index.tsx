import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import ComplianceBanner from "@/components/ComplianceBanner";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import FeaturedPeptides from "@/components/FeaturedPeptides";
import CategoryCards from "@/components/CategoryCards";
import ProductCatalog from "@/components/ProductCatalog";
import RewardsShowcase from "@/components/rewards/RewardsShowcase";
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
      logo: "https://vertexresearchlabs.com/logo-black.png",
      image: "https://vertexresearchlabs.com/og-image.png",
      description:
        "Research-grade peptides and analytical reference materials with verified Certificates of Analysis.",
      email: "info@vertexresearchlabs.com",
      telephone: "+1-727-295-1338",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1444 S Belcher Rd STE C-103",
        addressLocality: "Clearwater",
        addressRegion: "FL",
        postalCode: "33764",
        addressCountry: "US",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "info@vertexresearchlabs.com",
        telephone: "+1-727-295-1338",
        areaServed: "US",
      },
      sameAs: ["https://twitter.com/VertexResearchLabs"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Vertex Research Labs",
      url: "https://vertexresearchlabs.com",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://vertexresearchlabs.com/?q={search_term_string}#products",
        },
        "query-input": "required name=search_term_string",
      },
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
        {/* Light commerce canvas — featured rail, rewards banner, catalog */}
        <FeaturedPeptides />
        <RewardsShowcase />
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
