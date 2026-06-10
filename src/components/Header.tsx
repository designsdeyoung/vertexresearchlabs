import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Sparkles, Search, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";
import CartButton from "./CartButton";
import { useAuth } from "@/contexts/AuthContext";
import { products } from "@/data/products";
import { SITEWIDE_SALE } from "@/config/sale";

const navLinks = [
  { label: "Shop", href: "/#products", isHash: true },
  { label: "Quality", href: "/quality", isHash: false },
  { label: "COAs", href: "/quality/testing", isHash: false },
  { label: "Learn", href: "/learn", isHash: false },
  { label: "Contact", href: "/#contact", isHash: true },
];

const formatPrice = (p: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p);

/** Live search box with a product-result dropdown. Submitting deep-links to
 *  the homepage catalog via `/?q=<term>#products`. */
const SearchBox = ({ onNavigate }: { onNavigate?: () => void }) => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const seen = new Set<string>();
    const out: typeof products = [];
    for (const p of products) {
      const key = p.groupId ?? p.id;
      if (seen.has(key)) continue;
      const haystack = `${p.name} ${p.category} ${p.subtitle ?? ""}`.toLowerCase();
      if (haystack.includes(q)) {
        seen.add(key);
        out.push(p);
        if (out.length >= 5) break;
      }
    }
    return out;
  }, [query]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const close = () => {
    setFocused(false);
    setQuery("");
    onNavigate?.();
  };

  const submit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/?q=${encodeURIComponent(q)}#products`);
    close();
  };

  const open = focused && results.length > 0;

  return (
    <div ref={wrapRef} className="relative w-full md:w-[260px] lg:w-[300px]">
      <form onSubmit={submit} role="search">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => e.key === "Escape" && setFocused(false)}
          placeholder="Search peptides, blends, ancillaries..."
          aria-label="Search products"
          className="h-9 w-full rounded-full border border-border bg-background/60 pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary/50 focus:bg-background [&::-webkit-search-cancel-button]:hidden"
        />
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl shadow-black/50">
          <ul>
            {results.map((p) => {
              const price = SITEWIDE_SALE.active
                ? p.price * (1 - SITEWIDE_SALE.discount)
                : p.price;
              return (
                <li key={p.id}>
                  <Link
                    to={`/product/${p.id}`}
                    onClick={close}
                    className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background/60">
                      {p.image && (
                        <img
                          src={p.image}
                          alt=""
                          className="h-full w-full scale-[1.5] object-contain"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-foreground">
                        {p.name.split(" / ")[0]}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {p.size} · {p.category}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-primary">
                      {formatPrice(price)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={submit}
            className="flex w-full items-center justify-between border-t border-border px-3 py-2.5 text-[12px] text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            See all results for “{query.trim()}”
            <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
};

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
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "border-b border-border bg-popover/90 backdrop-blur-xl shadow-lg shadow-black/20"
          : "border-b border-transparent bg-popover/70 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-[72px] items-center gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="relative -my-4 flex shrink-0 items-center"
            aria-label="Vertex Research Labs home"
          >
            <img
              src={logo}
              alt="Vertex Research Labs"
              className="h-20 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav — centered */}
          <nav className="hidden flex-1 items-center justify-center gap-6 lg:gap-8 md:flex">
            {navLinks.map((l) =>
              l.isHash ? (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.label}
                  to={l.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              )
            )}
          </nav>

          {/* Right cluster */}
          <div className="hidden items-center gap-2 md:flex">
            <SearchBox />
            {user ? (
              <Link
                to="/dashboard"
                aria-label="Account dashboard"
                className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 transition-colors hover:bg-primary/20"
              >
                <Sparkles size={12} className="text-primary" />
                <span className="font-mono text-[11px] font-medium text-primary">
                  {profile?.points_balance?.toLocaleString() ?? 0}
                </span>
              </Link>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="rounded-full text-muted-foreground hover:text-foreground"
              >
                <Link to="/auth" aria-label="Sign in">
                  <User size={16} />
                </Link>
              </Button>
            )}
            <CartButton />
          </div>

          {/* Mobile toggle */}
          <div className="ml-auto flex items-center gap-1 md:hidden">
            <CartButton />
            <button
              type="button"
              className="p-2 text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="mb-3">
              <SearchBox onNavigate={() => setOpen(false)} />
            </div>
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
