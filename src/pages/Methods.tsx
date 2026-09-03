import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const methods = [
  ["Chromatography", "May report separation data or relative purity under the stated conditions. It does not alone prove identity, amount, sterility, or safety."],
  ["Mass spectrometry", "May provide mass-to-charge information relevant to identity. Interpretation depends on the method, reference, sample, and acceptance criteria."],
  ["Other analyses", "Water content, residual solvent, microbial, or endotoxin testing are distinct analyses and should never be inferred unless the lot record expressly reports them."],
];

export default function Methods() {
  return <div className="min-h-screen bg-background flex flex-col"><SEOHead title="Understanding Analytical Methods | Vertex Research Labs" description="A neutral guide to reading methods and limitations in lot-specific analytical records." canonical="/quality/methods"/><Header />
    <main className="flex-1 pt-24 pb-16"><div className="container mx-auto px-6 max-w-4xl"><div className="flex items-center gap-2 text-sm text-muted-foreground mb-8"><Link to="/quality">Quality</Link><ChevronRight size={14}/><span className="text-foreground">Analytical Methods</span></div>
      <h1 className="text-3xl md:text-4xl font-semibold mb-4">Understanding analytical methods</h1><p className="text-lg text-muted-foreground mb-10">This page explains terms that may appear in a lot record. It is not a representation that every listed analysis was performed on every material.</p>
      <div className="space-y-5">{methods.map(([title, body]) => <section key={title} className="glass-card rounded-xl p-6"><h2 className="text-xl font-semibold mb-2">{title}</h2><p className="text-muted-foreground">{body}</p></section>)}</div>
      <section className="glass-card rounded-xl p-6 mt-8"><h2 className="text-xl font-semibold mb-2">Use the report—not assumptions</h2><p className="text-muted-foreground">Check the named analyte, sample and lot identifiers, method, calibration or reference information, result, units, date, and any qualifiers. Contact the issuing laboratory when verification is necessary. Vertex does not provide preparation, reconstitution, administration, dosing, or clinical instructions.</p></section>
    </div></main><Footer /></div>;
}
