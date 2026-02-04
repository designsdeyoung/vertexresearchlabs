import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VialShowcase from "@/components/VialShowcase";
import MoleculeBuilder from "@/components/MoleculeBuilder";
import PeptidePeriodicTable from "@/components/PeptidePeriodicTable";
import ProductCatalog from "@/components/ProductCatalog";
import QualitySection from "@/components/QualitySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <section id="showcase">
          <VialShowcase />
        </section>
        <MoleculeBuilder />
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
