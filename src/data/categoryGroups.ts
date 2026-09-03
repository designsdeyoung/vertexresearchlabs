import { products } from "./products";

/** Shopper-facing category groups. Each group maps to one or more raw
 *  `product.category` values from the catalog data. Used by the homepage
 *  category cards, the catalog filter pills, and footer shop links —
 *  `/?cat=<key>#products` deep-links into a filtered catalog. */
export interface CategoryGroup {
  key: string;
  label: string;
  blurb: string;
  categories: string[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    key: "peptides",
    label: "Peptides",
    blurb: "Laboratory peptide reference materials",
    categories: ["Peptide", "Copper Peptide", "Heptapeptide"],
  },
  {
    key: "blends",
    label: "Blends",
    blurb: "Defined laboratory reference blends",
    categories: ["Peptide Blend"],
  },
  {
    key: "coenzymes",
    label: "Other Materials",
    blurb: "Non-peptide laboratory reference materials",
    categories: ["Coenzyme", "Tripeptide"],
  },
];

export const groupByKey = (key: string | null) =>
  CATEGORY_GROUPS.find((g) => g.key === key);

/** Distinct catalog cards in a group (variants share a groupId). */
export const productCountForGroup = (group: CategoryGroup) => {
  const seen = new Set<string>();
  for (const p of products) {
    if (group.categories.includes(p.category)) seen.add(p.groupId ?? p.id);
  }
  return seen.size;
};
