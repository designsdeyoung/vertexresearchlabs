import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const steps = [
  ["Before procurement", "Request the documentation for the specific lot being offered and compare it with your written protocol and acceptance criteria."],
  ["On receipt", "Record the date, carrier condition, package condition, label, product and lot identifiers, quantity, and any discrepancy before opening or use."],
  ["Storage and access", "Follow lot-specific records where available and your institution’s validated procedures. Limit access to trained personnel and log transfers."],
  ["Deviations", "Quarantine damaged, mislabeled, temperature-affected, or otherwise questionable material and contact Vertex before proceeding."],
];

export default function ChainOfCustody() {
  return <div className="min-h-screen bg-background flex flex-col"><SEOHead title="Receiving & Traceability | Vertex Research Labs" description="Purchaser guidance for receiving records, traceability, storage controls, and deviations." canonical="/quality/chain-of-custody"/><Header />
    <main className="flex-1 pt-24 pb-16"><div className="container mx-auto px-6 max-w-4xl"><div className="flex items-center gap-2 text-sm text-muted-foreground mb-8"><Link to="/quality">Quality</Link><ChevronRight size={14}/><span className="text-foreground">Receiving & Records</span></div>
      <h1 className="text-3xl md:text-4xl font-semibold mb-4">Receiving, traceability, and records</h1><p className="text-lg text-muted-foreground mb-10">Qualified purchasers are responsible for establishing controls appropriate to their facility, protocol, and applicable law. The practices below are general recordkeeping guidance, not claims about a particular lot or facility certification.</p>
      <div className="space-y-5">{steps.map(([title, body], i) => <section key={title} className="glass-card rounded-xl p-6 flex gap-4"><span className="font-mono text-primary">0{i + 1}</span><div><h2 className="text-xl font-semibold mb-2">{title}</h2><p className="text-muted-foreground">{body}</p></div></section>)}</div>
      <p className="mt-8 text-sm text-muted-foreground">Materials are for laboratory research or analytical use only and not for use in or on humans or animals.</p>
    </div></main><Footer /></div>;
}
