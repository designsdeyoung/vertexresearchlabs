import { Link } from "react-router-dom";
import { FlaskConical } from "lucide-react";
import logo from "@/assets/logo.png";
import { CATEGORY_GROUPS } from "@/data/categoryGroups";

const companyLinks = [
  { label: "Quality", to: "/quality" },
  { label: "COAs", to: "/quality/testing" },
  { label: "Testing Methods", to: "/quality/methods" },
  { label: "Learn", to: "/learn" },
  { label: "Contact", href: "/#contact" },
];

const supportLinks = [
  { label: "Shipping & Returns", to: "/shipping" },
  { label: "Track Order", to: "/track" },
  { label: "Rewards", to: "/rewards" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Disclaimer", to: "/disclaimer" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-popover/40">
      <div className="container mx-auto px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <img src={logo} alt="Vertex Research Labs" className="h-24 w-auto" />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Analytical-grade biochemical reference standards and laboratory
              research materials for qualified research customers, with
              verified Certificates of Analysis.
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
              In-vitro research use only. Not for human or animal consumption.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-foreground">Shop</h4>
            <ul className="space-y-2 text-sm">
              {CATEGORY_GROUPS.map((g) => (
                <li key={g.key}>
                  <Link
                    to={`/?cat=${g.key}#products`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {g.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/#products"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  All Products
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  {l.to ? (
                    <Link
                      to={l.to}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      href={l.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-foreground">Support</h4>
            <ul className="space-y-2 text-sm">
              {supportLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Research Use Only */}
          <div>
            <h4 className="mb-3 flex items-center gap-1.5 font-display text-sm font-semibold text-foreground">
              <FlaskConical size={13} className="text-primary" aria-hidden="true" />
              Research Use Only
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              All materials are intended exclusively for in-vitro research, analytical
              method development, identity verification, and laboratory evaluation by
              qualified research customers. Not for human or animal consumption or
              administration.
            </p>
          </div>
        </div>

        {/* Compliance disclaimer */}
        <div className="mt-12 border-t border-border pt-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Vertex Research Labs supplies analytical-grade biochemical reference standards and
            laboratory research materials to qualified research customers. Materials are intended
            exclusively for in-vitro research, analytical method development, identity verification,
            and laboratory evaluation. Products are not intended for human or animal consumption,
            therapeutic use, clinical use, diagnostic use, dietary supplementation, dosing, injection,
            ingestion, or administration of any kind, and must be handled by qualified research
            personnel in appropriate laboratory settings. No product is a drug, supplement, or medical
            device. Nothing on this site is medical advice or a health claim, and no product
            description or research summary is an endorsement of any use in humans or animals. These
            statements have not been evaluated by the FDA, and these products are not intended to
            diagnose, treat, cure, or prevent any disease.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            © {year} Vertex Research Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
