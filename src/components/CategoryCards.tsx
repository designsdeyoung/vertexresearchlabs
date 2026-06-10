import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Dna, Layers, Atom, Droplets } from "lucide-react";
import { CATEGORY_GROUPS, productCountForGroup } from "@/data/categoryGroups";

const icons: Record<string, typeof Dna> = {
  peptides: Dna,
  blends: Layers,
  coenzymes: Atom,
  ancillaries: Droplets,
};

const CategoryCards = () => {
  return (
    <section aria-label="Shop by category" className="relative bg-background py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-lab-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden />
      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
            Catalog
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Shop by Category
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_GROUPS.map((group, i) => {
            const Icon = icons[group.key] ?? Dna;
            const count = productCountForGroup(group);
            return (
              <motion.div
                key={group.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <Link
                  to={`/?cat=${group.key}#products`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-6 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
                >
                  <div
                    className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                  <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 transition-colors group-hover:border-primary/40">
                    <Icon size={22} className="text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {group.label}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{group.blurb}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {count} {count === 1 ? "product" : "products"}
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-primary transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
