// Import product images
import bpc157Image from "@/assets/products/bpc-157.png";
import tb500Image from "@/assets/products/tb-500.png";
import retatrutideImage from "@/assets/products/retatrutide.png";
import ghkCuImage from "@/assets/products/ghk-cu.png";
import semaxImage from "@/assets/products/semax.png";

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  purity: string;
  testing: string;
  documentation: string;
  intendedUse: string;
  disclaimer: string;
  image?: string;
  category: string;
}

export const products: Product[] = [
  {
    id: "bpc-157",
    name: "BPC-157",
    subtitle: "Research Grade",
    description: "Peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: bpc157Image,
    category: "Peptide"
  },
  {
    id: "tb-500",
    name: "TB-500 / Thymosin Beta-4 Acetate",
    subtitle: "Research Grade",
    description: "Peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: tb500Image,
    category: "Peptide"
  },
  {
    id: "ghk-cu",
    name: "GHK-Cu",
    subtitle: "Research Grade",
    description: "Copper peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: ghkCuImage,
    category: "Copper Peptide"
  },
  {
    id: "semax",
    name: "Semax",
    subtitle: "Research Grade",
    description: "Peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: semaxImage,
    category: "Peptide"
  },
  {
    id: "selank",
    name: "Selank",
    subtitle: "Research Grade",
    description: "Heptapeptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥98%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    category: "Heptapeptide"
  },
  {
    id: "nad-plus",
    name: "NAD+",
    subtitle: "Research Grade",
    description: "Coenzyme reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    category: "Coenzyme"
  },
  {
    id: "ll-37",
    name: "LL-37",
    subtitle: "Research Grade",
    description: "Antimicrobial peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥95%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    category: "Antimicrobial Peptide"
  },
  {
    id: "kpv",
    name: "KPV",
    subtitle: "Research Grade",
    description: "Tripeptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    category: "Tripeptide"
  },
  {
    id: "retatrutide",
    name: "Retatrutide",
    subtitle: "Research Grade",
    description: "Peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: retatrutideImage,
    category: "Peptide"
  }
];
