import { products } from "./products";

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface ProductSEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  researchSummary: string;
  faqs: ProductFAQ[];
  relatedProducts: string[];
}

const relatedByCategory = (id: string, category: string) =>
  products.filter((product) => product.id !== id && product.category === category).slice(0, 4).map((product) => product.id);

/**
 * Product metadata deliberately describes identity, format, documentation, and
 * procurement scope only. It does not target consumer-intent searches or
 * summarize biological effects beside a purchasing call to action.
 */
export const productSEO: Record<string, ProductSEOData> = Object.fromEntries(
  products.map((product) => [
    product.id,
    {
      metaTitle: `${product.name} ${product.size} Laboratory Reference Material`,
      metaDescription: `${product.name} ${product.size} reference material for qualified laboratory research and analytical use only. Request current lot-specific documentation before ordering. Not for human or veterinary use.`,
      keywords: [
        `${product.name} reference material`,
        `${product.name} laboratory research`,
        "analytical reference material",
        "lot-specific documentation",
      ],
      researchSummary: `${product.name} is offered only as a laboratory reference material. This catalog entry does not describe biological effects, clinical applications, personal use, or administration. Researchers should evaluate current lot documentation and suitability under their institution's protocols before procurement.`,
      faqs: [
        {
          question: `What documentation is available for ${product.name}?`,
          answer: "Available documentation varies by lot. Contact Vertex Research Labs for the current lot-specific records and review them before ordering.",
        },
        {
          question: `What is the permitted use of ${product.name}?`,
          answer: "Laboratory research and analytical use only. It is not for human or veterinary use and is not offered as a medicine, food, dietary supplement, cosmetic, or consumer product.",
        },
      ],
      relatedProducts: relatedByCategory(product.id, product.category),
    },
  ]),
);
