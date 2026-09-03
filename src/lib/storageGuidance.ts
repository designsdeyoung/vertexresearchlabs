import type { Product } from "@/data/products";

export interface StorageRow {
  label: string;
  value: string;
}

/**
 * Public guidance stays at the level of laboratory custody. Product-specific
 * temperatures, solution preparation, and stability periods must come from
 * current lot documentation and an institution's validated protocol.
 */
export const storageGuidance = (_product: Product): StorageRow[] => [
  { label: "Storage", value: "Follow current lot documentation" },
  { label: "Environment", value: "Controlled laboratory setting" },
  { label: "Handling", value: "Qualified laboratory personnel only" },
  { label: "Protocol", value: "Use an institutionally approved procedure" },
];
