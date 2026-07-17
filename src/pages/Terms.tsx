import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-8">
            Terms and Conditions
          </h1>
          
          <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
            <p>
              These Terms and Conditions govern your use of the Vertex Research Labs website and any products or services offered.
            </p>
            
            <p>
              By accessing this website or submitting a research inquiry, you agree to be bound by these Terms and Conditions.
            </p>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Research Use Only</h2>
              <p>
                Vertex Research Labs supplies analytical-grade biochemical reference standards and laboratory research materials to qualified research customers. Materials are intended exclusively for in-vitro research, analytical method development, identity verification, and laboratory evaluation. Products are not intended for human or animal consumption, therapeutic use, clinical use, diagnostic use, dietary supplementation, dosing, injection, ingestion, or administration of any kind.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Eligibility and Buyer Representations</h2>
              <p>
                Products may only be purchased or requested by individuals, laboratories, institutions, or organizations engaged in legitimate research activities. By placing an order, the purchaser represents and warrants that they are a qualified research customer, that the materials will be used exclusively for laboratory research or analytical purposes, and that the materials will not be resold, transferred, or repurposed for human or animal consumption, therapeutic use, clinical use, diagnostic use, dietary supplementation, dosing, injection, ingestion, or administration of any kind.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Product Information</h2>
              <p>
                All descriptions and specifications are provided for identification and reference purposes only and do not constitute claims of performance, safety, or suitability for any particular use.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Order Review and Cancellation</h2>
              <p>
                Vertex Research Labs reserves the right to review, decline, or cancel any order at its sole discretion, including where an order or purchaser representation appears inconsistent with qualified research use or with these Terms and Conditions.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Limitation of Liability</h2>
              <p>
                Vertex Research Labs shall not be held liable for any damages arising from misuse, improper handling, or unauthorized use of its products.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Vertex Research Labs from any claims arising from misuse or unauthorized use of products.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Vertex Research Labs operates.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
