import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
            <p>
              Vertex Research Labs respects your privacy and is committed to protecting your personal information.
            </p>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Information We Collect</h2>
              <p>
                We may collect personal information such as your name, email address, organization, and inquiry details when you contact us or submit a research inquiry.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">How Information Is Used</h2>
              <p>
                Information collected is used solely to respond to inquiries, provide documentation, process orders, and communicate regarding research materials.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Data Protection</h2>
              <p>
                We implement reasonable security measures to protect your information from unauthorized access or disclosure.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Third Parties</h2>
              <p>
                Vertex Research Labs does not sell or share personal information with third parties except as required to fulfill legitimate business operations or comply with legal obligations.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Cookies</h2>
              <p>
                This website may use cookies or similar technologies to improve functionality and user experience.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
              <p>
                For questions regarding this Privacy Policy, please contact Vertex Research Labs directly.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
