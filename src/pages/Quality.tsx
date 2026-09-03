import { Link } from "react-router-dom";
import { FileSearch, FlaskConical, PackageCheck } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const resources = [
  { title: "Lot Documentation", body: "How to request and evaluate records for the specific lot under consideration.", href: "/quality/testing", icon: FileSearch },
  { title: "Analytical Methods", body: "A neutral guide to common analytical methods and the limits of their results.", href: "/quality/methods", icon: FlaskConical },
  { title: "Receiving & Records", body: "Purchaser-side receiving, traceability, storage, and deviation-record practices.", href: "/quality/chain-of-custody", icon: PackageCheck },
];

export default function Quality() {
  return <div className="min-h-screen bg-background flex flex-col">
    <SEOHead title="Quality Documentation | Vertex Research Labs" description="Request and independently review current lot-specific documentation before procuring laboratory reference materials." canonical="/quality" />
    <Header />
    <main className="flex-1 pt-24 pb-16"><div className="container mx-auto px-6 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">Quality documentation</h1>
      <p className="text-lg text-muted-foreground max-w-3xl mb-10">Documentation availability and test scope vary by material and lot. Contact us before ordering to request the records currently associated with the lot being offered, then determine whether those records satisfy your organization’s protocol.</p>
      <div className="grid md:grid-cols-3 gap-6">{resources.map(({ title, body, href, icon: Icon }) => <Link key={href} to={href} className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors"><Icon className="text-primary mb-4"/><h2 className="text-lg font-semibold mb-2">{title}</h2><p className="text-sm text-muted-foreground">{body}</p></Link>)}</div>
      <div className="glass-card rounded-xl p-6 mt-10 text-sm text-muted-foreground"><strong className="text-foreground">Important limitation:</strong> An analytical result applies only to the sample, lot, and method identified in the record. Purity or identity data do not establish sterility, endotoxin level, safety, efficacy, regulatory approval, or suitability for administration. Materials are not for use in or on humans or animals.</div>
    </div></main><Footer />
  </div>;
}
