import type { Product } from "@/data/products";

export interface StorageRow {
  label: string;
  value: string;
}

/**
 * Storage & handling guidance for a research material. Peptides and most
 * lyophilized reference materials share the same cold-chain guidance;
 * diluents (BAC water) differ. Returned as neutral technical rows.
 */
export const storageGuidance = (product: Product): StorageRow[] => {
  if (product.category === "Diluent") {
    return [
      { label: "Storage", value: "Room temperature (2–30 °C), away from direct light" },
      { label: "After opening", value: "Refrigerate at 2–8 °C; use within 28 days" },
      { label: "Shelf life", value: "See lot documentation" },
      { label: "Handling", value: "Use aseptic technique for reconstitution" },
    ];
  }

  return [
    { label: "Lyophilized", value: "Store at −20 °C; protect from light and moisture" },
    { label: "Reconstituted", value: "Refrigerate at 2–8 °C; use within 2–4 weeks" },
    { label: "Shelf life", value: "≈ 24 months lyophilized at −20 °C" },
    { label: "Handling", value: "Allow to reach room temperature before opening the vial" },
  ];
};
