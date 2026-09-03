import { Link } from "react-router-dom";
import { ChevronRight, Mail } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function TestingCOAs() {
  return <div className="min-h-screen bg-background flex flex-col">
    <SEOHead title="Lot Documentation | Vertex Research Labs" description="Request current lot-specific analytical records and review their scope before procurement." canonical="/quality/testing" />
    <Header /><main className="flex-1 pt-24 pb-16"><div className="container mx-auto px-6 max-w-4xl">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8"><Link to="/quality">Quality</Link><ChevronRight size={14}/><span className="text-foreground">Lot Documentation</span></div>
      <h1 className="text-3xl md:text-4xl font-semibold mb-4">Request lot-specific documentation</h1>
      <p className="text-lg text-muted-foreground mb-10">Records are not represented as universally available, identical across lots, or sufficient for every protocol. Ask for the exact product and lot currently available before placing an order.</p>
      <div className="glass-card rounded-xl p-8 mb-8"><h2 className="text-xl font-semibold mb-3">What to verify</h2><ul className="list-disc pl-5 space-y-2 text-muted-foreground"><li>Material name, lot identifier, sample identifier, and report date match the offered lot.</li><li>The method, laboratory, reported result, units, and acceptance criteria are stated.</li><li>The report is complete and any limitations, qualifiers, or attachments are included.</li><li>Your organization independently determines whether the record and method are suitable for its protocol.</li></ul></div>
      <div className="glass-card rounded-xl p-8"><h2 className="text-xl font-semibold mb-3">What a record does not establish</h2><p className="text-muted-foreground mb-6">A purity or identity result does not by itself establish sterility, endotoxin level, safety, efficacy, regulatory approval, or fitness for human or veterinary administration. Do not infer one product’s or lot’s result from another.</p><Button asChild><a href="mailto:info@vertexresearchlabs.com?subject=Current lot documentation request"><Mail size={18}/>Request current lot records</a></Button></div>
    </div></main><Footer />
  </div>;
}
