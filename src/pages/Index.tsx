import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import ComplianceBanner from "@/components/ComplianceBanner";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import CategoryCards from "@/components/CategoryCards";
import ProductCatalog from "@/components/ProductCatalog";
import WhyVertex from "@/components/WhyVertex";
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
        "Laboratory reference materials for qualified research organizations.",
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
        title="Laboratory Reference Materials | Vertex Research Labs"
      description="Laboratory reference materials for qualified research organizations. Request and review current lot documentation before ordering. Not for human or veterinary use."
        canonical="/"
        keywords={["laboratory reference materials", "analytical reference materials", "lot documentation"]}
        jsonLd={homepageSchema}
      />
      <ComplianceBanner />
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <CategoryCards />
        <ProductCatalog />
        <WhyVertex />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
