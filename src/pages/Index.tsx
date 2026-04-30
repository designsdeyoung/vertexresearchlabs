import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import ComplianceBanner from "@/components/ComplianceBanner";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import BundleSection from "@/components/BundleSection";
import ProductCatalog from "@/components/ProductCatalog";
import TickerBar from "@/components/TickerBar";
import PuritySection from "@/components/PuritySection";
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
        description="Analytical-grade research peptides with ≥99% purity and Certificate of Analysis available for every product. For laboratory research use only."
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
        <BundleSection />
        <TickerBar />
        <ProductCatalog />
        <PuritySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
