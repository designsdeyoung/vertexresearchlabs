import FreeShippingBanner from "@/components/FreeShippingBanner";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCatalog from "@/components/ProductCatalog";
import QualitySection from "@/components/QualitySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <FreeShippingBanner />
      <Header />
      <main>
        <Hero />
        <ProductCatalog />
        <QualitySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
