import ghkCu100Image from "@/assets/products/ghk-cu-100.png";
import ghkCuImage from "@/assets/products/ghk-cu.png";
import semaxImage from "@/assets/products/semax.png";
import selankImage from "@/assets/products/selank.png";
import nadPlus1000Image from "@/assets/products/nad-plus-1000.png";
import glutathioneImage from "@/assets/products/glutathione.png";
import motsCImage from "@/assets/products/mots-c.png";
import motsC40Image from "@/assets/products/mots-c-40.png";
import tesamorelinImage from "@/assets/products/tesamorelin.png";
import mt2Image from "@/assets/products/mt2.png";
import dsipImage from "@/assets/products/dsip.png";
import cjcIpaImage from "@/assets/products/cjc-ipa.png";
import wolverineBlendImage from "@/assets/products/wolverine-blend.png";
import klowImage from "@/assets/products/klow.png";

export interface Product {
  id: string;
  groupId?: string;
  name: string;
  subtitle?: string;
  size: string;
  price: number;
  originalPrice?: number;
  description: string;
  purity: string;
  testing: string;
  documentation: string;
  intendedUse: string;
  disclaimer: string;
  image?: string;
  category: string;
  isNew?: boolean;
  outOfStock?: boolean;
  stock?: number;
}

/**
 * These identifiers are not offered through the public catalog. Historical
 * URLs are redirected at the hosting layer so they cannot silently resolve to
 * a coded substitute or imply that a discontinued material remains available.
 */
export const DISCONTINUED_PRODUCT_IDS = new Set<string>([
  "kisspeptin",
  "tesamorelin-2mg",
  "pt-141",
  "epithalon",
  "tirzepatide",
  "retatrutide",
  "rp-200",
  "rp-300",
  "bac-water-3ml",
  "bac-water-10ml",
]);

export const SLUG_REDIRECTS: Record<string, string> = {};

const researchOnly = {
  subtitle: "Laboratory Reference Material",
  purity: "See lot documentation",
  testing: "See lot-specific analytical documentation",
  documentation: "Request current lot documentation before ordering",
  intendedUse: "Laboratory research and analytical use only.",
  disclaimer:
    "Not for human or veterinary use. Not a medicine, food, dietary supplement, cosmetic, or consumer product.",
} as const;

export const products: Product[] = [
  {
    ...researchOnly,
    id: "ghk-cu",
    groupId: "ghk-cu",
    name: "GHK-Cu",
    size: "50mg",
    price: 44,
    description: "GHK-Cu reference material offered for qualified laboratory procurement and analytical workflows.",
    image: ghkCuImage,
    category: "Copper Peptide",
    stock: 30,
  },
  {
    ...researchOnly,
    id: "ghk-cu-100",
    groupId: "ghk-cu",
    name: "GHK-Cu",
    size: "100mg",
    price: 88,
    description: "GHK-Cu reference material offered for qualified laboratory procurement and analytical workflows.",
    image: ghkCu100Image,
    category: "Copper Peptide",
    stock: 1,
  },
  {
    ...researchOnly,
    id: "klow",
    name: "GHK-Cu/BPC-157/TB-500/KPV Blend",
    size: "80mg",
    price: 129,
    description: "Co-formulated reference material labeled as GHK-Cu 50mg, BPC-157 10mg, TB-500 10mg, and KPV 10mg per vial. Obtain and review current lot documentation before ordering.",
    image: klowImage,
    category: "Peptide Blend",
  },
  {
    ...researchOnly,
    id: "igf1-lr3",
    name: "IGF-1 LR3",
    size: "1mg",
    price: 85,
    description: "IGF-1 LR3 reference material offered for qualified laboratory procurement and analytical workflows.",
    category: "Peptide",
  },
  {
    ...researchOnly,
    id: "semax",
    name: "Semax",
    size: "5mg",
    price: 33,
    description: "Semax reference material offered for qualified laboratory procurement and analytical workflows.",
    image: semaxImage,
    category: "Peptide",
    stock: 15,
  },
  {
    ...researchOnly,
    id: "selank",
    name: "Selank",
    size: "5mg",
    price: 33,
    description: "Selank reference material offered for qualified laboratory procurement and analytical workflows.",
    image: selankImage,
    category: "Heptapeptide",
  },
  {
    ...researchOnly,
    id: "nad-plus-1000",
    name: "NAD+",
    size: "1000mg",
    price: 150,
    description: "NAD+ reference material offered for qualified laboratory procurement and analytical workflows.",
    image: nadPlus1000Image,
    category: "Coenzyme",
    stock: 6,
  },
  {
    ...researchOnly,
    id: "glutathione",
    name: "Glutathione",
    size: "1500mg",
    price: 75,
    description: "Glutathione reference material offered for qualified laboratory procurement and analytical workflows.",
    image: glutathioneImage,
    category: "Tripeptide",
    stock: 7,
  },
  {
    ...researchOnly,
    id: "mots-c",
    groupId: "mots-c",
    name: "MOTS-C",
    size: "10mg",
    price: 48,
    description: "MOTS-C reference material offered for qualified laboratory procurement and analytical workflows.",
    image: motsCImage,
    category: "Peptide",
  },
  {
    ...researchOnly,
    id: "mots-c-40",
    groupId: "mots-c",
    name: "MOTS-C",
    size: "40mg",
    price: 140,
    description: "MOTS-C reference material offered for qualified laboratory procurement and analytical workflows.",
    image: motsC40Image,
    category: "Peptide",
  },
  {
    ...researchOnly,
    id: "tesamorelin",
    name: "Tesamorelin",
    size: "10mg",
    price: 85,
    description: "Tesamorelin reference material offered for qualified laboratory procurement and analytical workflows.",
    image: tesamorelinImage,
    category: "Peptide",
  },
  {
    ...researchOnly,
    id: "mt2",
    name: "Melanotan II (MT-II)",
    size: "10mg",
    price: 45,
    description: "Melanotan II reference material offered for qualified laboratory procurement and analytical workflows.",
    image: mt2Image,
    category: "Peptide",
    stock: 5,
  },
  {
    ...researchOnly,
    id: "dsip",
    name: "Delta Sleep-Inducing Peptide (DSIP)",
    size: "5mg",
    price: 42,
    description: "DSIP reference material offered for qualified laboratory procurement and analytical workflows.",
    image: dsipImage,
    category: "Peptide",
  },
  {
    ...researchOnly,
    id: "wolverine-blend",
    name: "BPC-157/TB-500 Blend",
    size: "10mg",
    price: 55,
    description: "Co-formulated reference material labeled as BPC-157 5mg and TB-500 5mg per vial. Obtain and review current lot documentation before ordering.",
    image: wolverineBlendImage,
    category: "Peptide Blend",
    stock: 7,
  },
  {
    ...researchOnly,
    id: "cjc-ipa-blend",
    name: "CJC-1295 (No DAC)/Ipamorelin Blend",
    size: "10mg",
    price: 85,
    description: "Co-formulated CJC-1295 (No DAC) and Ipamorelin reference material. Obtain and review current lot documentation before ordering.",
    image: cjcIpaImage,
    category: "Peptide Blend",
    stock: 6,
  },
];

export const FREE_SHIPPING_THRESHOLD = 99;
