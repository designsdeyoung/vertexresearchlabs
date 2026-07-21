import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { CATEGORY_GROUPS, groupByKey } from "@/data/categoryGroups";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { products } from "@/data/products";
import { Search } from "lucide-react";

type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc";

const ProductCatalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [searchParams] = useSearchParams();

  // Seed search/category from URL params so the header search bar, category
  // cards, and footer shop links can deep-link into a filtered catalog
  // (`/?q=term#products`, `/?cat=peptides#products`).
  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("cat");
    // Reset absent params so stale filters from a previous deep-link don't
    // combine with the new one (e.g. ?q=nad followed by ?cat=blends).
    setSearchQuery(q ?? "");
    setSelectedGroup(cat && groupByKey(cat) ? cat : "all");
    if (q || (cat && groupByKey(cat))) {
      requestAnimationFrame(() => {
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [searchParams]);

  // Catalog display order. Lower index = higher placement.
  // Products not listed fall to the bottom in their original order.
  const salesRank: string[] = [
    // Featured merchandising order (top of catalog)
    "retatrutide",
    "tirzepatide",
    "wolverine-blend",
    "klow",
    "ghk-cu",
    "cjc-ipa-blend",
    "tesamorelin",
    "mots-c",
    "nad-plus-1000",
    "semax",
    "selank",
    "glutathione",
    // Remaining products
    "mt2",
    "ghk-cu-100",
    "mots-c-40",
    "dsip",
    // Diluents — always last; surfaced as upsell in cart instead.
    "bac-water-3ml",
    "bac-water-10ml",
  ];
  const rankOf = (id: string) => {
    const i = salesRank.indexOf(id);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const group = groupByKey(selectedGroup);
    let list = products.filter((p) => {
      const matchesSearch =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.size.toLowerCase().includes(q) ||
        (p.subtitle ?? "").toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      const matchesCategory = !group || group.categories.includes(p.category);
      return matchesSearch && matchesCategory;
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list = [...list].sort((a, b) => rankOf(a.id) - rankOf(b.id));
        break;
    }
    return list;
  }, [searchQuery, selectedGroup, sort]);

  // Group size-variants into single cards (preserving order). Also drives the
  // visible results count.
  const cards = useMemo(() => {
    const seen = new Set<string>();
    const out: { key: string; variants: typeof filteredProducts }[] = [];
    for (const p of filteredProducts) {
      const key = p.groupId ?? p.id;
      if (seen.has(key)) continue;
      seen.add(key);
      const variants = p.groupId
        ? filteredProducts.filter((x) => x.groupId === p.groupId)
        : [p];
      out.push({ key, variants });
    }
    return out;
  }, [filteredProducts]);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedGroup !== "all";
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGroup("all");
    setSort("featured");
  };

  return (
    <section id="products" className="bg-cream py-16 md:py-20">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="mb-8 text-center">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-navy/50">
            Catalog
          </p>
          <h2 className="font-display text-3xl font-black tracking-tight text-navy md:text-4xl">
            Research Materials
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-navy/60">
            Analytical-grade reference compounds with documented purity.
            Certificates of Analysis are available on request where applicable.
          </p>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-[72px] z-30 -mx-6 mb-8 border-y border-navy/10 bg-cream/95 px-6 py-3 backdrop-blur-md">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Category pills */}
            <div
              role="group"
              aria-label="Filter by category"
              className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 md:pb-0"
            >
              {[{ key: "all", label: "All" }, ...CATEGORY_GROUPS].map((g) => {
                const active = selectedGroup === g.key;
                return (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => setSelectedGroup(g.key)}
                    aria-pressed={active}
                    className={`whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 ${
                      active
                        ? "border-navy bg-navy text-white"
                        : "border-navy/15 bg-transparent text-navy/60 hover:border-navy/40 hover:text-navy"
                    }`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>

            {/* Search + sort */}
            <div className="flex items-center gap-2" role="search">
              <div className="relative flex-1 md:w-[220px] md:flex-none">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  placeholder="Search products..."
                  aria-label="Search products by name, category, or size"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 rounded-full border-navy/15 bg-white pl-9 text-sm text-navy placeholder:text-navy/40 focus-visible:ring-navy/30"
                />
              </div>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="h-9 w-[160px] rounded-full border-navy/15 bg-white text-xs text-navy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-navy/10 bg-white text-navy">
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low–High</SelectItem>
                  <SelectItem value="price-desc">Price: High–Low</SelectItem>
                  <SelectItem value="name-asc">Name A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results count + clear */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <p aria-live="polite" className="font-mono text-[11px] uppercase tracking-wider text-navy/50">
            {cards.length} {cards.length === 1 ? "product" : "products"}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-mono text-[11px] uppercase tracking-wider text-navy/60 underline-offset-2 hover:text-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {cards.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map(({ key, variants }) => (
              <ProductCard key={key} product={variants[0]} variants={variants} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-sm text-navy/55">No products match your filters.</p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 font-mono text-[11px] uppercase tracking-wider text-navy underline underline-offset-2"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;
