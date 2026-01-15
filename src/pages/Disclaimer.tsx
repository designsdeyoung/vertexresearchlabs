import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-8">
            Disclaimer
          </h1>
          
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p>
              Vertex Research Labs provides research-grade materials intended solely for laboratory research and analytical purposes.
            </p>
            
            <p>
              All products sold by Vertex Research Labs are not for human consumption or veterinary use. Products are not intended for diagnosis, treatment, cure, mitigation, or prevention of any disease or medical condition.
            </p>
            
            <p>
              The information provided on this website is for general informational purposes only and should not be interpreted as medical, pharmaceutical, or scientific advice.
            </p>
            
            <p>
              By purchasing or requesting information about products from Vertex Research Labs, the purchaser represents that the products will be used exclusively for legitimate laboratory research purposes by qualified individuals or institutions.
            </p>
            
            <p>
              Vertex Research Labs makes no claims regarding the safety, efficacy, or outcomes of any products for human or animal use.
            </p>
            
            <p>
              Use of this website constitutes acceptance of this disclaimer.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Disclaimer;
