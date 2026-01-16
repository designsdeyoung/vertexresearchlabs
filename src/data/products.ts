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
import sluPP332Image from "@/assets/products/slu-pp-332.png";
import pt141Image from "@/assets/products/pt-141.png";
import mt2Image from "@/assets/products/mt2.png";

export interface Reference {
  authors: string;
  journal: string;
  year: number;
  title: string;
  url: string;
}

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
  references?: Reference[];
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
    coa: ghkCuCoa,
    references: [
      {
        authors: "Pickart L, Margolina A",
        journal: "Molecular Biology Reports",
        year: 2010,
        title: "GHK-Cu peptide and tissue remodeling",
        url: "https://pubmed.ncbi.nlm.nih.gov/20680445/"
      },
      {
        authors: "Reed S et al.",
        journal: "Journal of Dermatological Science",
        year: 2015,
        title: "GHK-Cu effects on skin collagen synthesis",
        url: "https://pubmed.ncbi.nlm.nih.gov/25913479/"
      }
    ]
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
    coa: retatrutideCoa,
    references: [
      {
        authors: "Coskun T et al.",
        journal: "Cell Metabolism",
        year: 2022,
        title: "Discovery and characterization of a triagonist peptide acting on GLP-1, GIP, and glucagon receptors",
        url: "https://pubmed.ncbi.nlm.nih.gov/35675805/"
      },
      {
        authors: "Knerr PJ et al.",
        journal: "Journal of Medicinal Chemistry",
        year: 2023,
        title: "Structure-activity relationships of multi-receptor peptide agonists",
        url: "https://pubmed.ncbi.nlm.nih.gov/37195025/"
      }
    ]
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
    coa: tb500Coa,
    references: [
      {
        authors: "Sikiric P et al.",
        journal: "Peptides",
        year: 2011,
        title: "Behavioral and biochemical effects of BPC-157",
        url: "https://pubmed.ncbi.nlm.nih.gov/21419183/"
      }
    ]
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
    coa: tb500Coa,
    references: [
      {
        authors: "Hecker L et al.",
        journal: "Cell Biology International",
        year: 2014,
        title: "Effects of thymosin β4 fragments on cell proliferation",
        url: "https://pubmed.ncbi.nlm.nih.gov/24643608/"
      }
    ]
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
    category: "Peptide",
    references: [
      {
        authors: "Kling MA et al.",
        journal: "Neuroscience Letters",
        year: 2001,
        title: "Semax and neuroprotective activity",
        url: "https://pubmed.ncbi.nlm.nih.gov/11118852/"
      }
    ]
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
    category: "Heptapeptide",
    references: [
      {
        authors: "Makarkina VA et al.",
        journal: "Doklady Biological Sciences",
        year: 2009,
        title: "Selank modulation of neurotransmitter systems",
        url: "https://pubmed.ncbi.nlm.nih.gov/19548159/"
      }
    ]
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
    category: "Coenzyme",
    references: [
      {
        authors: "Bogan KL, Brenner C",
        journal: "Annual Review of Nutrition",
        year: 2008,
        title: "Nicotinamide riboside and NAD metabolism",
        url: "https://pubmed.ncbi.nlm.nih.gov/18598138/"
      },
      {
        authors: "Trammell SA et al.",
        journal: "Nature Communications",
        year: 2016,
        title: "NAD+ precursor bioavailability studies",
        url: "https://pubmed.ncbi.nlm.nih.gov/27721479/"
      }
    ]
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
    category: "Peptide",
    references: [
      {
        authors: "Lee C et al.",
        journal: "Cell Metabolism",
        year: 2015,
        title: "Mitochondrial-encoded peptide MOTS-C and metabolic regulation",
        url: "https://pubmed.ncbi.nlm.nih.gov/26166748/"
      }
    ]
  },
  {
    id: "slu-pp-332",
    name: "SLU-PP-332",
    subtitle: "Research Grade",
    size: "5mg",
    price: 80,
    description: "Peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: sluPP332Image,
    category: "Peptide",
    references: [
      {
        authors: "Meriwether D et al.",
        journal: "Journal of Medicinal Chemistry",
        year: 2023,
        title: "SLU-PP-332 and ERR agonist activity",
        url: "https://pubmed.ncbi.nlm.nih.gov/37307608/"
      }
    ]
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
    category: "Peptide",
    references: [
      {
        authors: "Thorner MO et al.",
        journal: "Endocrinology",
        year: 1985,
        title: "Human growth hormone–releasing hormone: synthesis and biological activity",
        url: "https://pubmed.ncbi.nlm.nih.gov/3934196/"
      },
      {
        authors: "Gelato MC et al.",
        journal: "Journal of Clinical Endocrinology & Metabolism",
        year: 1990,
        title: "Pharmacological properties of growth hormone–releasing hormone analogs",
        url: "https://pubmed.ncbi.nlm.nih.gov/2125285/"
      }
    ]
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
    category: "Peptide",
    references: [
      {
        authors: "Ohtaki T et al.",
        journal: "Nature",
        year: 2001,
        title: "Metastasis suppressor gene KiSS-1 encodes peptide ligand of a G-protein–coupled receptor",
        url: "https://pubmed.ncbi.nlm.nih.gov/11313911/"
      },
      {
        authors: "Pinilla L et al.",
        journal: "Endocrine Reviews",
        year: 2012,
        title: "Kisspeptins and reproduction: physiological roles and mechanisms",
        url: "https://pubmed.ncbi.nlm.nih.gov/22782237/"
      }
    ]
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
    category: "Peptide",
    references: [
      {
        authors: "Falutz J et al.",
        journal: "Journal of Clinical Endocrinology & Metabolism",
        year: 2008,
        title: "Effects of a growth hormone–releasing hormone analog on body composition",
        url: "https://pubmed.ncbi.nlm.nih.gov/18940876/"
      },
      {
        authors: "Stanley TL et al.",
        journal: "Pituitary",
        year: 2013,
        title: "Growth hormone–releasing hormone analogs: pharmacology and physiology",
        url: "https://pubmed.ncbi.nlm.nih.gov/23315004/"
      }
    ]
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
    category: "Peptide",
    references: [
      {
        authors: "Kingsberg SA et al.",
        journal: "Journal of Sexual Medicine",
        year: 2012,
        title: "Bremelanotide (PT-141) clinical research",
        url: "https://pubmed.ncbi.nlm.nih.gov/22906405/"
      }
    ]
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
    category: "Peptide",
    references: [
      {
        authors: "Hadley ME et al.",
        journal: "Endocrinology",
        year: 1999,
        title: "Melanocortin receptor activation by Melanotan II",
        url: "https://pubmed.ncbi.nlm.nih.gov/10579327/"
      }
    ]
  }
];

export const FREE_SHIPPING_THRESHOLD = 99;
