import { motion } from "framer-motion";
import { Search, ShieldCheck, Zap, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  {
    icon: Search,
    title: "Smarter Product Discovery",
    body: "Intuitive categories, detailed product pages, and powerful search to find what you need fast.",
  },
  {
    icon: ShieldCheck,
    title: "Trust You Can Verify",
    body: "Full transparency with COAs, third-party testing, and strict quality controls.",
  },
  {
    icon: Zap,
    title: "Faster, Secure Checkout",
    body: "Streamlined checkout, multiple payment options, and encrypted protection.",
  },
  {
    icon: BookOpen,
    title: "Education for Researchers",
    body: "Clear guides, resources, and product information to support informed research decisions.",
    href: "/learn",
  },
];

const WhyVertex = () => {
  return (
    <section aria-label="Why researchers choose Vertex" className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
            Built for the Bench
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Why Researchers Choose Vertex
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, title, body, href }, i) => {
            const inner = (
              <>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10">
                  <Icon size={20} className="text-accent" aria-hidden="true" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </>
            );
            const className =
              "flex h-full flex-col rounded-2xl border border-border/70 bg-card/50 p-6 transition-all duration-200 hover:border-accent/40 hover:bg-card/80";
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                {href ? (
                  <Link to={href} className={className}>
                    {inner}
                  </Link>
                ) : (
                  <div className={className}>{inner}</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyVertex;
