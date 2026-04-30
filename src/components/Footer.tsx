import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block">
              <img src={logo} alt="Vertex Research Labs" className="h-36 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Research-grade materials for analytical applications.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-foreground">Products</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/#products" className="text-muted-foreground hover:text-foreground">
                  Peptides
                </a>
              </li>
              <li>
                <a href="/#products" className="text-muted-foreground hover:text-foreground">
                  Heptapeptides
                </a>
              </li>
              <li>
                <a href="/#products" className="text-muted-foreground hover:text-foreground">
                  Coenzymes
                </a>
              </li>
              <li>
                <a href="/#products" className="text-muted-foreground hover:text-foreground">
                  Blends
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/quality" className="text-muted-foreground hover:text-foreground">
                  Quality
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-muted-foreground hover:text-foreground">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-muted-foreground hover:text-foreground">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/rewards" className="text-muted-foreground hover:text-foreground">
                  Rewards
                </Link>
              </li>
              <li>
                <a href="/#contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-muted-foreground hover:text-foreground">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-muted-foreground hover:text-foreground">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance disclaimer */}
        <div className="mt-12 border-t border-border pt-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            All products sold by Vertex Research Labs are intended for laboratory research and
            analytical applications only. Not for human consumption. Not for veterinary use.
            Must be handled by qualified research personnel in appropriate laboratory settings.
            These statements have not been evaluated by the FDA.
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
