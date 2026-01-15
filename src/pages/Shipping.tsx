import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Shipping = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-8">
            Shipping and Returns
          </h1>
          
          <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Shipping</h2>
              <p>
                Vertex Research Labs ships research materials to eligible customers in accordance with applicable regulations. Shipping methods, timelines, and availability may vary based on location and product type.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Documentation</h2>
              <p>
                Certificates of Analysis and relevant documentation are available upon request.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Returns</h2>
              <p>
                Due to the nature of research materials, all sales are final unless otherwise agreed upon in writing.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Damaged or Incorrect Orders</h2>
              <p>
                If an order arrives damaged or incorrect, please contact us promptly so we can review the issue.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Compliance</h2>
              <p>
                Customers are responsible for ensuring compliance with all applicable local, state, and federal regulations related to receipt and use of research materials.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shipping;
