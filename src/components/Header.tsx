import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";
import CartButton from "./CartButton";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Products", href: "/#products", isHash: true },
  { label: "Quality", href: "/quality", isHash: false },
  { label: "Shipping", href: "/shipping", isHash: false },
  { label: "Contact", href: "/#contact", isHash: true },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, profile } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-colors duration-200 ${
        scrolled
          ? "border-b border-border bg-popover/95 backdrop-blur-md"
          : "bg-popover/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex h-[60px] items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center" aria-label="Vertex Research Labs home">
            <img src={logo} alt="Vertex Research Labs" className="h-9 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((l) =>
              l.isHash ? (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.label}
                  to={l.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              )
            )}
          </nav>

          {/* Right cluster */}
          <div className="hidden items-center gap-2 md:flex">
            <CartButton />
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 transition-colors hover:bg-primary/20"
              >
                <Sparkles size={12} className="text-primary" />
                <span className="font-mono text-[11px] font-medium text-primary">
                  {profile?.points_balance?.toLocaleString() ?? 0}
                </span>
              </Link>
            ) : (
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link to="/auth">
                  <User size={14} />
                  Sign In
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-border py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((l) =>
                l.isHash ? (
                  <a
                    key={l.label}
                    href={l.href}
                    className="px-1 py-2 text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    key={l.label}
                    to={l.href}
                    className="px-1 py-2 text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                )
              )}
              <div className="mt-3 flex items-center gap-2">
                <CartButton />
                {user ? (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5"
                    onClick={() => setOpen(false)}
                  >
                    <Sparkles size={12} className="text-primary" />
                    <span className="font-mono text-[11px] text-primary">
                      {profile?.points_balance?.toLocaleString() ?? 0}
                    </span>
                  </Link>
                ) : (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/auth" onClick={() => setOpen(false)}>
                      <User size={14} />
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
