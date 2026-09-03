import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FlaskConical, ShieldAlert } from "lucide-react";

const Disclaimer = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <SEOHead
      title="Information and Research Disclaimer"
      description="Research-use and information limitations for Vertex Research Labs materials and website content."
      canonical="/disclaimer"
    />
    <Header />
    <main className="flex-1 pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-lg bg-destructive/10"><ShieldAlert size={28} className="text-destructive" /></div>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground">Information and Research Disclaimer</h1>
        </div>
        <div className="space-y-6 text-muted-foreground">
          <section className="glass-card rounded-xl p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-3"><FlaskConical size={20} className="text-primary" />Laboratory scope only</h2>
            <p>Vertex Research Labs offers materials exclusively for legitimate laboratory research and analytical purposes. Products are not for use in or on humans or animals. They are not intended to diagnose, treat, cure, mitigate, or prevent disease and are not offered as medicines, dietary supplements, foods, cosmetics, medical devices, or consumer products.</p>
          </section>
          <section className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-3">No medical or administration advice</h2>
            <p>Site content is laboratory and procurement information only. Nothing is medical, clinical, pharmaceutical, or veterinary advice; no physician-patient, veterinarian-client-patient, or other professional relationship is created. Content must not be interpreted as instructions for personal dosing, administration, injection, reconstitution, treatment, supplementation, or self-experimentation.</p>
          </section>
          <section className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-3">Scientific information and references</h2>
            <p>A citation or discussion of published research does not endorse human or veterinary use and does not establish that a Vertex product is safe, effective, approved, equivalent to a studied material, or suitable for a particular method. Findings about another sample, formulation, species, model, or study cannot be attributed to a Vertex lot without appropriate evidence.</p>
          </section>
          <section className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-3">Documentation limitations</h2>
            <p>Analytical documentation applies only to the product, lot, sample, and method it identifies. Request and independently review current lot-specific records before procurement. A purity result does not establish sterility, endotoxin level, safety, efficacy, or suitability for administration.</p>
          </section>
          <section className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-3">Purchaser responsibility</h2>
            <p>Purchasers are responsible for lawful acquisition, trained handling, storage, institutional approvals, validated protocols, hazard controls, disposal, and compliance with applicable laws and policies. These notices do not themselves determine the legal status of a product or transaction.</p>
          </section>
          <p className="text-sm">See the <Link to="/terms" className="text-primary hover:underline">Terms and Conditions</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Disclaimer;
