// Import product images
import bpc157Image from "@/assets/products/bpc-157.png";

// Import COA images
import ghkCuCoa from "@/assets/coa/ghk-cu-coa.jpg";
import retatrutideCoa from "@/assets/coa/retatrutide-coa.jpg";
import tb500Coa from "@/assets/coa/tb-500-coa.jpg";
import tb500Image from "@/assets/products/tb-500.png";
import retatrutideImage from "@/assets/products/retatrutide.png";
import ghkCuImage from "@/assets/products/ghk-cu.png";
import semaxImage from "@/assets/products/semax.png";
import selankImage from "@/assets/products/selank.png";
import nadPlusImage from "@/assets/products/nad-plus.png";
import motsCImage from "@/assets/products/mots-c.png";
import kisspeptinImage from "@/assets/products/kisspeptin.png";
import sermorelinImage from "@/assets/products/sermorelin.png";
import tesamorelinImage from "@/assets/products/tesamorelin.png";
import supp322Image from "@/assets/products/supp-322.png";
import pt141Image from "@/assets/products/pt-141.png";
import mt2Image from "@/assets/products/mt2.png";

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  size: string;
  price: number;
  description: string;
  purity: string;
  testing: string;
  documentation: string;
  intendedUse: string;
  disclaimer: string;
  image?: string;
  category: string;
  coa?: string;
}

export const products: Product[] = [
  {
    id: "ghk-cu",
    name: "GHK-Cu",
    subtitle: "Research Grade",
    size: "50mg",
    price: 44,
    description: "Copper peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: ghkCuImage,
    category: "Copper Peptide",
    coa: ghkCuCoa
  },
  {
    id: "retatrutide",
    name: "Retatrutide",
    subtitle: "Research Grade",
    size: "10mg",
    price: 98,
    description: "Peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: retatrutideImage,
    category: "Peptide",
    coa: retatrutideCoa
  },
  {
    id: "bpc-157",
    name: "BPC-157",
    subtitle: "Research Grade",
    size: "10mg",
    price: 60,
    description: "Peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: bpc157Image,
    category: "Peptide",
    coa: tb500Coa
  },
  {
    id: "tb-500",
    name: "TB-500 / Thymosin Beta-4 Acetate",
    subtitle: "Research Grade",
    size: "10mg",
    price: 68,
    description: "Peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: tb500Image,
    category: "Peptide",
    coa: tb500Coa
  },
  {
    id: "semax",
    name: "Semax",
    subtitle: "Research Grade",
    size: "5mg",
    price: 33,
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
    size: "5mg",
    price: 33,
    description: "Heptapeptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: selankImage,
    category: "Heptapeptide"
  },
  {
    id: "nad-plus",
    name: "NAD+",
    subtitle: "Research Grade",
    size: "100mg",
    price: 75,
    description: "Coenzyme reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: nadPlusImage,
    category: "Coenzyme"
  },
  {
    id: "mots-c",
    name: "MOTS-C",
    subtitle: "Research Grade",
    size: "10mg",
    price: 55,
    description: "Peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: motsCImage,
    category: "Peptide"
  },
  {
    id: "supp-322",
    name: "SUPP-322",
    subtitle: "Research Grade",
    size: "10mg",
    price: 322,
    description: "Peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: supp322Image,
    category: "Peptide"
  },
  {
    id: "sermorelin",
    name: "Sermorelin",
    subtitle: "Research Grade",
    size: "10mg",
    price: 75,
    description: "Peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: sermorelinImage,
    category: "Peptide"
  },
  {
    id: "kisspeptin",
    name: "Kisspeptin",
    subtitle: "Research Grade",
    size: "10mg",
    price: 60,
    description: "Peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: kisspeptinImage,
    category: "Peptide"
  },
  {
    id: "tesamorelin",
    name: "Tesamorelin",
    subtitle: "Research Grade",
    size: "10mg",
    price: 75,
    description: "Peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: tesamorelinImage,
    category: "Peptide"
  },
  {
    id: "pt-141",
    name: "PT-141",
    subtitle: "Research Grade",
    size: "10mg",
    price: 55,
    description: "Peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: pt141Image,
    category: "Peptide"
  },
  {
    id: "mt2",
    name: "MT2 (Melanotan II)",
    subtitle: "Research Grade",
    size: "10mg",
    price: 45,
    description: "Peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: mt2Image,
    category: "Peptide"
  }
];

export const FREE_SHIPPING_THRESHOLD = 99;
