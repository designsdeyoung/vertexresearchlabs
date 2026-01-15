import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        {/* Main footer content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <img src={logo} alt="Vertex Research Labs" className="h-12 w-auto" />
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
                <a href="#products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#quality" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Quality
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Research Use Policy
                </a>
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
