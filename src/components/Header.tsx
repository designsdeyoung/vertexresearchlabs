import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Truck } from "lucide-react";
import logo from "@/assets/logo.png";
import CartButton from "./CartButton";
import ThemeToggle from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const qualitySubLinks = [
    { label: "Quality Hub", href: "/quality" },
    { label: "Testing & COAs", href: "/quality/testing" },
    { label: "Testing Methods", href: "/quality/methods" },
    { label: "Chain of Custody", href: "/quality/chain-of-custody" },
  ];

  const navLinks = [
    { label: "Products", href: "/#products" },
    { label: "Quality", href: "/quality", hasDropdown: true },
    { label: "Shipping", href: "/shipping" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      {/* Free Shipping Banner */}
      <div className="bg-primary text-primary-foreground py-1.5 px-4 text-center text-xs font-medium">
        <div className="container flex items-center justify-center gap-2">
          <Truck className="h-3.5 w-3.5" />
          <span>Free US Shipping on Orders Over $99</span>
        </div>
      </div>
      
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Vertex Research Labs" className="h-12 md:h-16 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <DropdownMenu key={link.label}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 outline-none">
                    {link.label}
                    <ChevronDown size={14} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {qualitySubLinks.map((subLink) => (
                      <DropdownMenuItem key={subLink.href} asChild>
                        <Link to={subLink.href} className="cursor-pointer">
                          {subLink.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : link.href.startsWith("/") && !link.href.includes("#") ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </a>
              )
            ))}
            <ThemeToggle />
            <CartButton />
            <Button variant="catalog" size="sm" asChild>
              <a href="/#products">Browse Catalog</a>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                link.hasDropdown ? (
                  <div key={link.label} className="py-2">
                    <span className="text-muted-foreground font-medium">{link.label}</span>
                    <div className="ml-4 mt-2 flex flex-col gap-2">
                      {qualitySubLinks.map((subLink) => (
                        <Link
                          key={subLink.href}
                          to={subLink.href}
                          className="text-muted-foreground hover:text-foreground transition-colors py-1 text-sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : link.href.startsWith("/") && !link.href.includes("#") ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              ))}
              <div className="flex items-center gap-3 mt-2">
                <ThemeToggle />
                <CartButton />
                <Button variant="catalog" size="sm" className="w-fit" asChild>
                  <a href="/#products" onClick={() => setIsMobileMenuOpen(false)}>Browse Catalog</a>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;