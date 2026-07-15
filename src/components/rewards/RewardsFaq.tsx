import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { POINTS_PER_DOLLAR } from "@/hooks/useRewards";

const FAQS = [
  {
    q: "How do points work?",
    a: `Every $1 you spend on research materials earns ${POINTS_PER_DOLLAR} points, added to your account automatically after each order. Autoship orders earn at double the base rate.`,
  },
  {
    q: "Do my points expire?",
    a: "No — your points never expire. They stay in your account and are ready to redeem for store credit whenever you're set to order.",
  },
  {
    q: "How do I redeem points for store credit?",
    a: "Pick a tier from your dashboard or right at checkout — from $10 off (250 points) up to $250 off (5,000 points). The credit comes straight off your order total. One credit per order, and each tier has a minimum order size.",
  },
  {
    q: "How do the tiers work?",
    a: "Everyone earns 3X points per $1 from day one. Membership tiers unlock access, not different math: Scientist (5,000 lifetime points) adds double-point events and early restock access; Partner (15,000 lifetime points) adds exclusive perks and priority fulfillment.",
  },
  {
    q: "Can I combine store credit with a discount code?",
    a: "Yes — a store credit and a discount code stack on the same order: the code's percentage comes off first, then your credit. Credit can't be exchanged for cash or transferred between accounts.",
  },
  {
    q: "Is there anything I should know about the products?",
    a: "All Vertex materials — including redeemed rewards — are supplied strictly for laboratory research use only and are not for human consumption. Rewards never change a product's intended use, documentation, or handling requirements.",
  },
];

/** Rewards FAQ — restyled shadcn accordion on the light canvas. */
const RewardsFaq = () => {
  return (
    <section aria-label="Rewards FAQ" className="container mx-auto px-6">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-8 text-center font-display text-3xl font-black tracking-tight text-navy md:text-4xl">
          Questions, Answered
        </h2>
        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-card border border-navy/5 bg-white px-5 shadow-boutique data-[state=open]:shadow-boutique-lift"
            >
              <AccordionTrigger className="py-4 text-left text-sm font-semibold text-navy hover:no-underline [&>svg]:text-navy/50">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-navy/65">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default RewardsFaq;
