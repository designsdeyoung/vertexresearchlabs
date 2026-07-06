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
    "bpc-157",
    "kisspeptin",
    "mt2",
    "pt-141",
    "tb-500",
    "ghk-cu-100",
    "mots-c-40",
    "dsip",
    "epithalon",
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
        (p.subtitle ?? "").toLowerCase().includes(q);
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

  return (
    <section id="products" className="bg-background py-16 md:py-20">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="mb-8 text-center">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
            Catalog
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Research Materials
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Analytical-grade reference compounds with documented purity.
            Certificates of Analysis are available on request where applicable.
          </p>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-[72px] z-30 -mx-6 mb-8 border-y border-border bg-popover/95 px-6 py-3 backdrop-blur-md">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Category pills */}
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 md:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {[{ key: "all", label: "All" }, ...CATEGORY_GROUPS].map((g) => {
                const active = selectedGroup === g.key;
                return (
                  <button
                    key={g.key}
                    onClick={() => setSelectedGroup(g.key)}
                    className={`whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                      active
                        ? "border-primary/60 bg-primary/10 text-primary"
                        : "border-border bg-transparent text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>

            {/* Search + sort */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-[220px] md:flex-none">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 border-border bg-card pl-9 text-sm"
                />
              </div>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="h-9 w-[160px] border-border bg-card text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low–High</SelectItem>
                  <SelectItem value="price-desc">Price: High–Low</SelectItem>
                  <SelectItem value="name-asc">Name A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(() => {
              // Group variants by groupId; preserve original order using the
              // first occurrence of each group.
              const seen = new Set<string>();
              const cards: { key: string; variants: typeof filteredProducts }[] = [];
              for (const p of filteredProducts) {
                const key = p.groupId ?? p.id;
                if (seen.has(key)) continue;
                seen.add(key);
                const variants = p.groupId
                  ? filteredProducts.filter((x) => x.groupId === p.groupId)
                  : [p];
                cards.push({ key, variants });
              }
              return cards.map(({ key, variants }) => (
                <ProductCard key={key} product={variants[0]} variants={variants} />
              ));
            })()}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground">
              No products match your filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;
