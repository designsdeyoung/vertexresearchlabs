import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        {/* Main footer content */}
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Link to="/">
                <img src={logo} alt="Vertex Research Labs" className="h-12 w-auto" />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              High-purity peptide reference materials for laboratory research applications. 
              All products are intended for research use only.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/#products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Products
                </a>
              </li>
              <li>
                <Link to="/quality" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Quality & COA
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <a href="/#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/disclaimer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@vertexresearchlabs.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Mail size={14} />
                  info@vertexresearchlabs.com
                </a>
              </li>
              <li>
                <a href="tel:727-295-1338" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Phone size={14} />
                  (727) 295-1338
                </a>
              </li>
              <li>
                <div className="text-sm text-muted-foreground flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                  <span>
                    1444 S Belcher RD STE C-103<br />
                    Clearwater, FL 33764
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="glass-card rounded-lg p-4 mb-8">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            <strong className="text-foreground">Research Use Only:</strong> All products supplied by Vertex Research Labs are intended 
            exclusively for laboratory research purposes. These materials are not intended for human or veterinary use, 
            diagnostic applications, therapeutic purposes, or any form of consumption. By purchasing or using our products, 
            you agree to use them solely for legitimate research activities.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Vertex Research Labs. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Reference materials for scientific research
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
