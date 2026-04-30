// Import product images
import bpc157Image from "@/assets/products/bpc-157.png";
import ghkCu100Image from "@/assets/products/ghk-cu-100.png";

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
import nadPlus1000Image from "@/assets/products/nad-plus-1000.png";
import glutathioneImage from "@/assets/products/glutathione.png";
import motsCImage from "@/assets/products/mots-c.png";
import motsC40Image from "@/assets/products/mots-c-40.png";
import kisspeptinImage from "@/assets/products/kisspeptin.png";
import tesamorelinImage from "@/assets/products/tesamorelin.png";
import pt141Image from "@/assets/products/pt-141.png";
import mt2Image from "@/assets/products/mt2.png";
import bacWater3mlImage from "@/assets/products/bac-water-3ml.png";
import bacWater10mlImage from "@/assets/products/bac-water-10ml.png";
import epithalonImage from "@/assets/products/epithalon.png";
import dsipImage from "@/assets/products/dsip.png";
import cjcIpaImage from "@/assets/products/cjc-ipa.png";
import wolverineBlendImage from "@/assets/products/wolverine-blend.png";

export interface Reference {
  authors: string;
  journal: string;
  year: number;
  title: string;
  url: string;
}

export interface Product {
  id: string;
  /** Optional grouping key — multiple products with the same groupId are merged
   *  into a single catalog card with size variants. Each variant keeps its own
   *  id, image, price, and detail page. */
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
  coa?: string;
  references?: Reference[];
  isNew?: boolean;
}

export const products: Product[] = [
  {
    id: "ghk-cu",
    groupId: "ghk-cu",
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
        journal: "International Journal of Molecular Sciences",
        year: 2015,
        title: "Regenerative and Protective Actions of the GHK-Cu Peptide",
        url: "https://pubmed.ncbi.nlm.nih.gov/26236730/"
      },
      {
        authors: "Pickart L et al.",
        journal: "Oxidative Medicine and Cellular Longevity",
        year: 2018,
        title: "GHK Peptide as a Natural Modulator of Multiple Cellular Pathways",
        url: "https://pubmed.ncbi.nlm.nih.gov/29986520/"
      }
    ]
  },
  {
    id: "ghk-cu-100",
    groupId: "ghk-cu",
    name: "GHK-Cu",
    subtitle: "Research Grade",
    size: "100mg",
    price: 88,
    description: "Copper peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: ghkCu100Image,
    category: "Copper Peptide",
    coa: ghkCuCoa,
    references: [
      {
        authors: "Pickart L, Margolina A",
        journal: "International Journal of Molecular Sciences",
        year: 2015,
        title: "Regenerative and Protective Actions of the GHK-Cu Peptide",
        url: "https://pubmed.ncbi.nlm.nih.gov/26236730/"
      },
      {
        authors: "Pickart L et al.",
        journal: "Oxidative Medicine and Cellular Longevity",
        year: 2018,
        title: "GHK Peptide as a Natural Modulator of Multiple Cellular Pathways",
        url: "https://pubmed.ncbi.nlm.nih.gov/29986520/"
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
        authors: "Jastreboff AM et al.",
        journal: "New England Journal of Medicine",
        year: 2023,
        title: "Triple-Hormone-Receptor Agonist Retatrutide for Obesity",
        url: "https://pubmed.ncbi.nlm.nih.gov/37366315/"
      },
      {
        authors: "Jastreboff AM et al.",
        journal: "New England Journal of Medicine",
        year: 2023,
        title: "Retatrutide Phase 2 Trial",
        url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2301972"
      }
    ]
  },
  {
    id: "bpc-157",
    name: "BPC-157",
    subtitle: "Research Grade",
    size: "5mg",
    price: 38,
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
        journal: "Current Pharmaceutical Design",
        year: 2011,
        title: "BPC-157 Peptide Studies",
        url: "https://pubmed.ncbi.nlm.nih.gov/21548867/"
      },
      {
        authors: "Chang CH et al.",
        journal: "Journal of Applied Physiology",
        year: 2011,
        title: "BPC-157 Research",
        url: "https://journals.physiology.org/doi/abs/10.1152/japplphysiol.00945.2010"
      }
    ]
  },
  {
    id: "tb-500",
    name: "TB-500 / Thymosin Beta-4 Acetate",
    subtitle: "Research Grade",
    size: "5mg",
    price: 38,
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
        authors: "Philp D et al.",
        journal: "FASEB Journal",
        year: 2011,
        title: "Thymosin β4 Research",
        url: "https://pubmed.ncbi.nlm.nih.gov/22074294/"
      },
      {
        authors: "Goldstein AL et al.",
        journal: "Annals of the New York Academy of Sciences",
        year: 1997,
        title: "Thymosin β4 Studies",
        url: "https://pubmed.ncbi.nlm.nih.gov/9194528/"
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
        authors: "Dolotov OV et al.",
        journal: "Brain Research",
        year: 2006,
        title: "Semax Peptide Research",
        url: "https://pubmed.ncbi.nlm.nih.gov/16635254/"
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
        authors: "Zolotarev YA et al.",
        journal: "Neurochemical Research",
        year: 2008,
        title: "Selank Peptide Studies",
        url: "https://pubmed.ncbi.nlm.nih.gov/18841804/"
      },
      {
        authors: "Kasian A et al.",
        journal: "Pharmaceutics",
        year: 2018,
        title: "Selank Research",
        url: "https://pubmed.ncbi.nlm.nih.gov/30255741/"
      }
    ]
  },
  {
    id: "nad-plus",
    groupId: "nad-plus",
    name: "NAD+",
    subtitle: "Research Grade",
    size: "500mg",
    price: 80,
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
        title: "NAD+ Biosynthesis Research",
        url: "https://pubmed.ncbi.nlm.nih.gov/18429699/"
      }
    ]
  },
  {
    id: "nad-plus-1000",
    groupId: "nad-plus",
    name: "NAD+",
    subtitle: "Research Grade",
    size: "1000mg",
    price: 150,
    description: "Coenzyme reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: nadPlus1000Image,
    category: "Coenzyme",
    references: [
      {
        authors: "Bogan KL, Brenner C",
        journal: "Annual Review of Nutrition",
        year: 2008,
        title: "NAD+ Biosynthesis Research",
        url: "https://pubmed.ncbi.nlm.nih.gov/18429699/"
      }
    ]
  },
  {
    id: "glutathione",
    name: "Glutathione",
    subtitle: "Research Grade",
    size: "1500mg",
    price: 85,
    description: "Tripeptide antioxidant reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: glutathioneImage,
    category: "Antioxidant",
    isNew: true,
    references: [
      {
        authors: "Pizzorno J",
        journal: "Integrative Medicine",
        year: 2014,
        title: "Glutathione!",
        url: "https://pubmed.ncbi.nlm.nih.gov/26770075/"
      },
      {
        authors: "Wu G et al.",
        journal: "Journal of Nutrition",
        year: 2004,
        title: "Glutathione Metabolism and Its Implications for Health",
        url: "https://pubmed.ncbi.nlm.nih.gov/14988435/"
      }
    ]
  },
  {
    id: "mots-c",
    groupId: "mots-c",
    name: "MOTS-C",
    subtitle: "Research Grade",
    size: "10mg",
    price: 38,
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
        title: "MOTS-c Peptide Research",
        url: "https://pubmed.ncbi.nlm.nih.gov/25738459/"
      },
      {
        authors: "Lee C et al.",
        journal: "Cell Metabolism",
        year: 2015,
        title: "Mitochondrial-derived Peptide MOTS-c",
        url: "https://www.cell.com/cell-metabolism/fulltext/S1550-4131(15)00061-3"
      }
    ]
  },
  {
    id: "mots-c-40",
    groupId: "mots-c",
    name: "MOTS-C",
    subtitle: "Research Grade",
    size: "40mg",
    price: 140,
    description: "Peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: motsC40Image,
    category: "Peptide",
    isNew: true,
    references: [
      {
        authors: "Lee C et al.",
        journal: "Cell Metabolism",
        year: 2015,
        title: "MOTS-c Peptide Research",
        url: "https://pubmed.ncbi.nlm.nih.gov/25738459/"
      }
    ]
  },
  {
    id: "kisspeptin",
    name: "Kisspeptin",
    subtitle: "Research Grade",
    size: "5mg",
    price: 38,
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
        authors: "Kotani M et al.",
        journal: "Journal of Biological Chemistry",
        year: 2001,
        title: "Kisspeptin Receptor Research",
        url: "https://pubmed.ncbi.nlm.nih.gov/11385580/"
      },
      {
        authors: "Ohtaki T et al.",
        journal: "Nature",
        year: 2001,
        title: "Metastasis Suppressor Gene KiSS-1 Research",
        url: "https://pubmed.ncbi.nlm.nih.gov/11457843/"
      },
      {
        authors: "Oakley AE et al.",
        journal: "Physiological Reviews",
        year: 2010,
        title: "Kisspeptin Signaling Research",
        url: "https://journals.physiology.org/doi/abs/10.1152/physrev.00037.2010"
      }
    ]
  },
  {
    id: "tesamorelin",
    name: "Tesamorelin",
    subtitle: "Research Grade",
    size: "2mg",
    price: 38,
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
        journal: "AIDS",
        year: 2007,
        title: "Tesamorelin Clinical Research",
        url: "https://pubmed.ncbi.nlm.nih.gov/18057338/"
      },
      {
        authors: "Falutz J et al.",
        journal: "New England Journal of Medicine",
        year: 2007,
        title: "Tesamorelin GHRH Analog Studies",
        url: "https://www.nejm.org/doi/full/10.1056/NEJMoa072375"
      },
      {
        authors: "Falutz J et al.",
        journal: "Journal of Clinical Endocrinology & Metabolism",
        year: 2008,
        title: "Tesamorelin Research",
        url: "https://pubmed.ncbi.nlm.nih.gov/18690162/"
      }
    ]
  },
  {
    id: "tesamorelin-10mg",
    name: "Tesamorelin",
    subtitle: "Research Grade",
    size: "10mg",
    price: 85,
    description: "Peptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: tesamorelinImage,
    category: "Peptide",
    isNew: true,
    references: [
      {
        authors: "Falutz J et al.",
        journal: "AIDS",
        year: 2007,
        title: "Tesamorelin Clinical Research",
        url: "https://pubmed.ncbi.nlm.nih.gov/18057338/"
      },
      {
        authors: "Falutz J et al.",
        journal: "New England Journal of Medicine",
        year: 2007,
        title: "Tesamorelin GHRH Analog Studies",
        url: "https://www.nejm.org/doi/full/10.1056/NEJMoa072375"
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
  },
  {
    id: "dsip",
    name: "DSIP (Delta Sleep-Inducing Peptide)",
    subtitle: "Research Grade",
    size: "5mg",
    price: 42,
    description: "Nonapeptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: dsipImage,
    category: "Peptide",
    references: [
      {
        authors: "Graf MV, Kastin AJ",
        journal: "Peptides",
        year: 1984,
        title: "Delta Sleep-Inducing Peptide (DSIP) Research",
        url: "https://pubmed.ncbi.nlm.nih.gov/6438537/"
      }
    ]
  },
  {
    id: "epithalon",
    name: "Epithalon (Epitalon)",
    subtitle: "Research Grade",
    size: "10mg",
    price: 65,
    description: "Tetrapeptide reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: epithalonImage,
    category: "Peptide",
    references: [
      {
        authors: "Khavinson VK et al.",
        journal: "Bulletin of Experimental Biology and Medicine",
        year: 2003,
        title: "Epithalon Peptide Research",
        url: "https://pubmed.ncbi.nlm.nih.gov/12937682/"
      }
    ]
  },
  {
    id: "wolverine-blend",
    name: "Wolverine Blend",
    subtitle: "Research Grade",
    size: "10mg",
    price: 55,
    originalPrice: 65,
    description: "Premium blend of BPC-157 (5mg) and TB-500 (5mg) reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    category: "Peptide Blend",
    image: wolverineBlendImage,
    isNew: true,
    references: [
      {
        authors: "Sikiric P et al.",
        journal: "Current Pharmaceutical Design",
        year: 2011,
        title: "BPC-157 Peptide Studies",
        url: "https://pubmed.ncbi.nlm.nih.gov/21548867/"
      },
      {
        authors: "Philp D et al.",
        journal: "FASEB Journal",
        year: 2011,
        title: "Thymosin β4 Research",
        url: "https://pubmed.ncbi.nlm.nih.gov/22074294/"
      }
    ]
  },
  {
    id: "cjc-ipa-blend",
    name: "CJC/IPA Blend",
    subtitle: "No DAC • Research Grade",
    size: "10mg",
    price: 85,
    description: "CJC-1295 (No DAC) and Ipamorelin blend reference material supplied exclusively for laboratory research and analytical applications.",
    purity: "≥99%",
    testing: "Independent analytical verification",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: cjcIpaImage,
    category: "Peptide Blend",
    isNew: true,
    references: [
      {
        authors: "Teichman SL et al.",
        journal: "Journal of Clinical Endocrinology & Metabolism",
        year: 2006,
        title: "CJC-1295 Growth Hormone Research",
        url: "https://pubmed.ncbi.nlm.nih.gov/16670164/"
      },
      {
        authors: "Raun K et al.",
        journal: "European Journal of Endocrinology",
        year: 1998,
        title: "Ipamorelin GH Secretagogue Research",
        url: "https://pubmed.ncbi.nlm.nih.gov/9916862/"
      }
    ]
  },
  {
    id: "bac-water-3ml",
    name: "BAC Water",
    subtitle: "Research Grade",
    size: "3mL",
    price: 8,
    description: "Sterile bacteriostatic diluent supplied exclusively for laboratory research and analytical applications.",
    purity: "USP Grade",
    testing: "Sterility tested",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: bacWater3mlImage,
    category: "Diluent"
  },
  {
    id: "bac-water-10ml",
    name: "BAC Water",
    subtitle: "Research Grade",
    size: "10mL",
    price: 15,
    description: "Sterile bacteriostatic diluent supplied exclusively for laboratory research and analytical applications.",
    purity: "USP Grade",
    testing: "Sterility tested",
    documentation: "Certificate of Analysis available upon request",
    intendedUse: "Laboratory research use only.",
    disclaimer: "Not for human consumption or veterinary use.",
    image: bacWater10mlImage,
    category: "Diluent"
  }
];

export const FREE_SHIPPING_THRESHOLD = 99;
