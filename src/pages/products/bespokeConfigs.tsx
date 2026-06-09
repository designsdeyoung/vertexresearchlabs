import {
  Activity,
  Atom,
  Battery,
  Bed,
  Brain,
  Clock,
  Dna,
  Droplets,
  Flame,
  FlaskConical,
  Gauge,
  HeartPulse,
  Hourglass,
  Leaf,
  Microscope,
  Moon,
  Network,
  Repeat,
  Scale,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TestTube,
  Waves,
  Zap,
} from "lucide-react";
import type { BespokeConfig } from "./_kit";

/**
 * One bespoke-page config per product, keyed by product id. Each block owns its
 * copy, color identity (accentHue), section mix, and cross-sells. All content is
 * framed for laboratory research use only — no human-use or therapeutic claims.
 */
export const bespokeConfigs: Record<string, BespokeConfig> = {
  "ghk-cu": {
    accentHue: 25,
    eyebrow: "Copper Tripeptide Complex",
    headline: ["GHK", "-Cu"],
    description:
      "A naturally occurring copper-binding tripeptide and one of the most-studied reference materials in regenerative and dermatological research.",
    features: [
      { icon: Repeat, title: "Tissue Remodeling", body: "Extensively referenced in in vitro studies of collagen, elastin, and extracellular-matrix synthesis." },
      { icon: ShieldCheck, title: "Antioxidant Pathways", body: "Investigated for copper-mediated modulation of oxidative-stress and inflammatory signaling." },
      { icon: Dna, title: "Gene Expression", body: "Published work has examined GHK-Cu's broad influence on gene-expression profiles in cultured cells." },
    ],
    crossSell: ["ghk-cu-100", "klow", "bpc-157"],
  },

  "ghk-cu-100": {
    accentHue: 25,
    eyebrow: "Copper Tripeptide · Bulk 100mg",
    headline: ["GHK-Cu", "100mg"],
    description:
      "The same ≥99% copper tripeptide reference material in a higher-mass vial for extended or higher-throughput research programs.",
    features: [
      { icon: Scale, title: "Higher Mass", body: "100mg vial reduces per-milligram cost for labs running larger or longer studies." },
      { icon: Repeat, title: "Tissue Remodeling", body: "Referenced across in vitro collagen, elastin, and matrix-synthesis assays." },
      { icon: Dna, title: "Gene Expression", body: "Studied for its wide-ranging effects on gene-expression profiles in cultured cells." },
    ],
    crossSell: ["ghk-cu", "klow", "glutathione"],
  },

  klow: {
    accentHue: 200,
    eyebrow: "Four-Peptide Research Blend",
    headline: ["KLOW", "Blend"],
    description:
      "A single 80mg vial combining four of the most-referenced regenerative peptides — GHK-Cu, BPC-157, TB-500, and KPV — for multi-pathway research.",
    composition: [
      { code: "GHK-Cu", dose: "50 mg", pct: 62, focus: "Copper-peptide remodeling", blurb: "Copper tripeptide studied for matrix synthesis and gene-expression modulation." },
      { code: "BPC-157", dose: "10 mg", pct: 13, focus: "Localized tissue & gut", blurb: "Gastric-derived pentadecapeptide referenced in connective-tissue repair models." },
      { code: "TB-500", dose: "10 mg", pct: 13, focus: "Cell migration", blurb: "Thymosin β4 fragment investigated for actin regulation and angiogenesis." },
      { code: "KPV", dose: "10 mg", pct: 12, focus: "Inflammatory signaling", blurb: "α-MSH-derived tripeptide studied in models of inflammatory modulation." },
    ],
    compositionSub: "Four complementary peptides in one 80mg vial.",
    features: [
      { icon: Network, title: "Multi-Pathway", body: "Each component is studied for distinct but overlapping regenerative pathways." },
      { icon: Activity, title: "Localized + Systemic", body: "Combines site-specific and circulating research compounds in one protocol." },
      { icon: ShieldCheck, title: "Inflammatory Modulation", body: "KPV adds an inflammatory-signaling research angle the other three don't cover." },
    ],
    crossSell: ["wolverine-blend", "ghk-cu", "bpc-157"],
  },

  retatrutide: {
    accentHue: 172,
    eyebrow: "Triple-Receptor Research Peptide",
    headline: ["Reta", "trutide"],
    description:
      "A triple-hormone-receptor agonist and one of the most-discussed metabolic research peptides in recent peer-reviewed literature.",
    features: [
      { icon: Target, title: "Triple Receptor", body: "Studied as a single agonist acting at GIP, GLP-1, and glucagon receptors." },
      { icon: Gauge, title: "Metabolic Research", body: "Referenced across preclinical and Phase-2 metabolic and body-composition studies." },
      { icon: Microscope, title: "Published Literature", body: "Featured in New England Journal of Medicine trial reports as a reference compound." },
    ],
    crossSell: ["tesamorelin", "mots-c", "cjc-ipa-blend"],
  },

  "bpc-157": {
    accentHue: 172,
    eyebrow: "Body Protection Compound",
    headline: ["BPC", "-157"],
    description:
      "A synthetic pentadecapeptide derived from a gastric protein, widely referenced in connective-tissue and gastrointestinal repair research.",
    features: [
      { icon: Zap, title: "Connective Tissue", body: "Appears throughout tendon, ligament, and muscle-integrity research models." },
      { icon: HeartPulse, title: "Gastrointestinal", body: "Studied in preclinical gut-lining and mucosal-protection assays." },
      { icon: Activity, title: "Angiogenesis", body: "Investigated for its role in new-vessel formation during tissue-repair research." },
    ],
    crossSell: ["tb-500", "wolverine-blend", "klow"],
  },

  "tb-500": {
    accentHue: 188,
    eyebrow: "Thymosin β4 Fragment",
    headline: ["TB", "-500"],
    description:
      "A synthetic fragment of Thymosin β4 studied for actin regulation, cell migration, and angiogenesis across systemic tissue models.",
    features: [
      { icon: Waves, title: "Cell Migration", body: "Its actin-binding sequence is a frequent subject of cell-motility research." },
      { icon: Activity, title: "Angiogenesis", body: "Referenced in new-vessel-formation and tissue-recovery study models." },
      { icon: Repeat, title: "Systemic Reach", body: "Investigated for broad, circulating activity complementary to localized peptides." },
    ],
    crossSell: ["bpc-157", "wolverine-blend", "klow"],
  },

  semax: {
    accentHue: 150,
    eyebrow: "Nootropic Research Heptapeptide",
    headline: ["Sem", "ax"],
    description:
      "A synthetic ACTH-derived heptapeptide studied for neuroprotective and cognitive-research applications in preclinical models.",
    features: [
      { icon: Brain, title: "Neuroprotection", body: "Investigated for neuroprotective signaling in cerebral research models." },
      { icon: Sparkles, title: "BDNF Expression", body: "Referenced for effects on brain-derived neurotrophic factor in cultured neurons." },
      { icon: Microscope, title: "Cognitive Research", body: "Studied in attention, memory, and learning paradigms in animal models." },
    ],
    crossSell: ["selank", "dsip", "glutathione"],
  },

  selank: {
    accentHue: 160,
    eyebrow: "Anxiolytic Research Heptapeptide",
    headline: ["Sel", "ank"],
    description:
      "A synthetic analog of the immunomodulatory peptide tuftsin, studied for anxiolytic and neuro-immune research applications.",
    features: [
      { icon: Brain, title: "GABA / Serotonin", body: "Investigated for modulation of GABAergic and serotonergic signaling." },
      { icon: ShieldCheck, title: "Immune Modulation", body: "Tuftsin lineage makes it a reference compound in neuro-immune research." },
      { icon: Activity, title: "Stress Response", body: "Studied in anxiolytic and stress-adaptation behavioral models." },
    ],
    crossSell: ["semax", "dsip", "ghk-cu"],
  },

  "nad-plus": {
    accentHue: 265,
    eyebrow: "Cellular Coenzyme · 500mg",
    headline: ["NAD", "+ 500mg"],
    description:
      "Nicotinamide adenine dinucleotide — a central coenzyme studied across mitochondrial energy, sirtuin, and DNA-repair research.",
    features: [
      { icon: Battery, title: "Mitochondrial Energy", body: "Essential cofactor in cellular respiration and ATP-production research." },
      { icon: Dna, title: "DNA Repair", body: "Referenced as a substrate in PARP-mediated DNA-repair pathway studies." },
      { icon: Hourglass, title: "Sirtuin Activation", body: "Investigated for sirtuin and longevity-pathway signaling in cell models." },
    ],
    crossSell: ["nad-plus-1000", "glutathione", "epithalon"],
  },

  "nad-plus-1000": {
    accentHue: 265,
    eyebrow: "Cellular Coenzyme · Bulk 1000mg",
    headline: ["NAD+", "1000mg"],
    description:
      "The same coenzyme reference material in a 1000mg bulk vial for extended or higher-throughput cellular-energy research.",
    features: [
      { icon: Scale, title: "Bulk Mass", body: "1000mg vial supports larger or longer-running research programs." },
      { icon: Battery, title: "Mitochondrial Energy", body: "Central cofactor in cellular respiration and ATP-production research." },
      { icon: Hourglass, title: "Sirtuin Activation", body: "Studied for sirtuin and longevity-pathway signaling in cell models." },
    ],
    crossSell: ["nad-plus", "glutathione", "epithalon"],
  },

  glutathione: {
    accentHue: 140,
    eyebrow: "Master Antioxidant Tripeptide",
    headline: ["Gluta", "thione"],
    description:
      "A tripeptide of glutamate, cysteine, and glycine — the cell's principal redox buffer and a benchmark antioxidant reference material.",
    features: [
      { icon: ShieldCheck, title: "Oxidative Stress", body: "The primary intracellular antioxidant studied in redox-balance research." },
      { icon: Leaf, title: "Detoxification", body: "Referenced in phase-II conjugation and xenobiotic-clearance pathway studies." },
      { icon: Atom, title: "Cellular Redox", body: "Investigated as the master regulator of the cell's reduced/oxidized state." },
    ],
    crossSell: ["nad-plus-1000", "ghk-cu", "semax"],
  },

  "mots-c": {
    accentHue: 35,
    eyebrow: "Mitochondrial-Derived Peptide",
    headline: ["MOTS", "-c"],
    description:
      "A mitochondrial-derived peptide studied for metabolic regulation and exercise-mimetic signaling in preclinical models.",
    features: [
      { icon: Battery, title: "Metabolic Regulation", body: "Investigated for insulin-sensitivity and glucose-homeostasis research." },
      { icon: Gauge, title: "AMPK Pathway", body: "Referenced as an activator of the AMPK metabolic master-switch." },
      { icon: Flame, title: "Exercise Mimetic", body: "Studied for exercise-like metabolic effects in cellular and animal models." },
    ],
    crossSell: ["mots-c-40", "retatrutide", "nad-plus-1000"],
  },

  "mots-c-40": {
    accentHue: 35,
    eyebrow: "Mitochondrial Peptide · Bulk 40mg",
    headline: ["MOTS-c", "40mg"],
    description:
      "The same mitochondrial-derived peptide in a 40mg bulk vial for extended metabolic-research programs.",
    features: [
      { icon: Scale, title: "Bulk Mass", body: "40mg vial lowers per-milligram cost for higher-throughput studies." },
      { icon: Gauge, title: "AMPK Pathway", body: "Referenced as an activator of the AMPK metabolic master-switch." },
      { icon: Battery, title: "Metabolic Regulation", body: "Investigated for insulin-sensitivity and glucose-homeostasis research." },
    ],
    crossSell: ["mots-c", "retatrutide", "nad-plus-1000"],
  },

  kisspeptin: {
    accentHue: 330,
    eyebrow: "Reproductive Signaling Peptide",
    headline: ["Kiss", "peptin"],
    description:
      "A neuropeptide encoded by the KISS1 gene and a key reference compound in reproductive-endocrinology research.",
    features: [
      { icon: Network, title: "GnRH Axis", body: "Studied as an upstream regulator of gonadotropin-releasing hormone signaling." },
      { icon: Target, title: "KISS1R Signaling", body: "Referenced in receptor-binding and downstream signaling research." },
      { icon: Microscope, title: "Endocrinology", body: "Investigated across reproductive and neuroendocrine study models." },
    ],
    crossSell: ["pt-141", "tesamorelin", "mt2"],
  },

  tesamorelin: {
    accentHue: 190,
    eyebrow: "GHRH Analog · 10mg",
    headline: ["Tesa", "morelin"],
    description:
      "A stabilized growth-hormone-releasing-hormone analog studied for GH secretagogue activity and visceral-adiposity research.",
    features: [
      { icon: Activity, title: "GH Secretagogue", body: "Investigated for stimulation of endogenous growth-hormone release." },
      { icon: Gauge, title: "Visceral Adiposity", body: "Referenced in clinical research on visceral-fat reduction." },
      { icon: Repeat, title: "IGF-1 Axis", body: "Studied for downstream effects on the GH/IGF-1 signaling axis." },
    ],
    crossSell: ["tesamorelin-2mg", "cjc-ipa-blend", "retatrutide"],
  },

  "tesamorelin-2mg": {
    accentHue: 190,
    eyebrow: "GHRH Analog · 2mg",
    headline: ["Tesamorelin", "2mg"],
    description:
      "The same GHRH-analog reference material in a 2mg vial for smaller-scale or pilot research.",
    features: [
      { icon: TestTube, title: "Pilot Scale", body: "2mg vial suits dose-ranging and small-batch research designs." },
      { icon: Activity, title: "GH Secretagogue", body: "Investigated for stimulation of endogenous growth-hormone release." },
      { icon: Repeat, title: "IGF-1 Axis", body: "Studied for downstream effects on the GH/IGF-1 signaling axis." },
    ],
    crossSell: ["tesamorelin", "cjc-ipa-blend", "retatrutide"],
  },

  "pt-141": {
    accentHue: 320,
    eyebrow: "Melanocortin Research Peptide",
    headline: ["PT", "-141"],
    description:
      "Bremelanotide — a melanocortin-receptor agonist studied for central-nervous-system signaling in libido research models.",
    features: [
      { icon: Target, title: "Melanocortin Receptor", body: "Referenced as an agonist at MC3R and MC4R receptor subtypes." },
      { icon: Brain, title: "Central Pathways", body: "Investigated for centrally-mediated signaling distinct from vascular agents." },
      { icon: Microscope, title: "Behavioral Models", body: "Studied across preclinical and clinical libido-research designs." },
    ],
    crossSell: ["kisspeptin", "mt2", "tesamorelin"],
  },

  mt2: {
    accentHue: 18,
    eyebrow: "Melanocortin Agonist",
    headline: ["Melanotan", "II"],
    description:
      "A synthetic melanocortin-receptor agonist and a benchmark reference compound in melanogenesis and pigmentation research.",
    features: [
      { icon: Sun, title: "Melanogenesis", body: "Studied for stimulation of melanin synthesis in pigmentation models." },
      { icon: Target, title: "MC1R / MC4R", body: "Referenced as a non-selective melanocortin-receptor agonist." },
      { icon: Microscope, title: "Pigmentation Research", body: "Investigated across dermatological and cellular pigmentation assays." },
    ],
    crossSell: ["pt-141", "kisspeptin", "glutathione"],
  },

  dsip: {
    accentHue: 235,
    eyebrow: "Delta Sleep-Inducing Peptide",
    headline: ["D", "SIP"],
    description:
      "A naturally occurring nonapeptide studied for its influence on sleep architecture and neuroendocrine regulation.",
    features: [
      { icon: Moon, title: "Sleep Architecture", body: "Referenced in delta-wave and sleep-pattern research models." },
      { icon: Bed, title: "Neuroendocrine", body: "Investigated for modulation of stress-hormone and circadian signaling." },
      { icon: Clock, title: "Stress Response", body: "Studied for effects on stress-adaptation and recovery pathways." },
    ],
    crossSell: ["selank", "semax", "epithalon"],
  },

  epithalon: {
    accentHue: 280,
    eyebrow: "Telomerase Research Tetrapeptide",
    headline: ["Epi", "thalon"],
    description:
      "A synthetic tetrapeptide (Epitalon) studied for telomerase activity and pineal-regulation in longevity research models.",
    features: [
      { icon: Hourglass, title: "Telomerase Activity", body: "Investigated for telomerase induction and telomere-length research." },
      { icon: Moon, title: "Pineal Regulation", body: "Referenced for effects on melatonin and circadian-rhythm signaling." },
      { icon: Dna, title: "Longevity Models", body: "Studied across cellular-senescence and lifespan research designs." },
    ],
    crossSell: ["nad-plus-1000", "glutathione", "dsip"],
  },

  "wolverine-blend": {
    accentHue: 172,
    eyebrow: "Dual-Peptide Recovery Blend",
    headline: ["Wolverine", "Blend"],
    description:
      "Two of the most-studied regenerative research peptides — BPC-157 and TB-500 — combined in a single 10mg vial. The pairing researchers reach for when one protocol needs both localized and systemic coverage.",
    composition: [
      { code: "BPC-157", dose: "5 mg", pct: 50, focus: "Localized tissue & gut research", blurb: "A synthetic pentadecapeptide derived from a gastric protein, studied in preclinical models for connective-tissue, tendon, and gastrointestinal repair pathways." },
      { code: "TB-500", dose: "5 mg", pct: 50, focus: "Systemic cell-migration research", blurb: "A synthetic fragment of Thymosin β4, investigated for its role in actin regulation, cell migration, and angiogenesis across systemic tissue models." },
    ],
    compositionSub: "A 1:1 split of two complementary research peptides — 10mg total.",
    featuresSub:
      "The two peptides are studied for overlapping but distinct pathways — together they cover more of the regenerative-research surface than either alone.",
    features: [
      { icon: Target, title: "Localized + Systemic", body: "BPC-157 is studied at the site of injury while TB-500 is investigated for broader, circulating activity — the reason researchers pair them." },
      { icon: Activity, title: "Actin & Angiogenesis", body: "TB-500's actin-binding fragment is a frequent subject of cell-migration and new-vessel-formation studies." },
      { icon: Zap, title: "Connective Tissue", body: "BPC-157 appears across the tendon, ligament, and gastrointestinal literature as a reference compound." },
    ],
    crossSell: ["bpc-157", "tb-500", "klow"],
  },

  "cjc-ipa-blend": {
    accentHue: 205,
    eyebrow: "GH Secretagogue Blend · No DAC",
    headline: ["CJC/IPA", "Blend"],
    description:
      "CJC-1295 (No DAC) paired with Ipamorelin — a complementary GHRH + ghrelin-mimetic blend studied for synergistic GH-secretagogue research.",
    composition: [
      { code: "CJC-1295", dose: "5 mg", pct: 50, focus: "GHRH analog (No DAC)", blurb: "A growth-hormone-releasing-hormone analog studied for amplifying GH-pulse amplitude." },
      { code: "Ipamorelin", dose: "5 mg", pct: 50, focus: "Selective ghrelin mimetic", blurb: "A selective GH secretagogue investigated for clean GH release with minimal off-target signaling." },
    ],
    compositionSub: "GHRH analog + ghrelin mimetic — 10mg total.",
    features: [
      { icon: Activity, title: "GH-Pulse Amplitude", body: "CJC-1295 is studied for increasing the size of natural GH pulses." },
      { icon: Network, title: "Dual-Mechanism Synergy", body: "Pairs a GHRH analog with a ghrelin mimetic — two complementary research pathways." },
      { icon: Repeat, title: "IGF-1 Axis", body: "Investigated for downstream GH/IGF-1 signaling in preclinical models." },
    ],
    crossSell: ["tesamorelin", "wolverine-blend", "retatrutide"],
  },

  "bac-water-3ml": {
    accentHue: 210,
    eyebrow: "Sterile Reconstitution Diluent",
    headline: ["BAC", "Water · 3mL"],
    description:
      "USP-grade bacteriostatic water for reconstituting lyophilized research peptides. The lab essential that every peptide order needs.",
    trust: ["USP Grade", "Sterility Tested", "Multi-Use Vial", "Research Use Only"],
    form: "Sterile solution",
    specs: [
      { label: "Volume", value: "3 mL" },
      { label: "Grade", value: "USP" },
      { label: "Composition", value: "0.9% benzyl alcohol" },
      { label: "Form", value: "Sterile solution" },
      { label: "Testing", value: "Sterility tested" },
      { label: "Documentation", value: "CoA available upon request" },
    ],
    features: [
      { icon: Droplets, title: "Bacteriostatic", body: "Benzyl-alcohol preservative supports multiple draws from a single vial." },
      { icon: TestTube, title: "Reconstitution", body: "The standard diluent for returning lyophilized peptides to solution." },
      { icon: ShieldCheck, title: "Sterility Tested", body: "USP-grade and sterility verified for laboratory handling." },
    ],
    crossSell: ["bac-water-10ml", "bpc-157", "tb-500"],
  },

  "bac-water-10ml": {
    accentHue: 210,
    eyebrow: "Sterile Reconstitution Diluent",
    headline: ["BAC", "Water · 10mL"],
    description:
      "USP-grade bacteriostatic water in a larger 10mL vial — best value for labs reconstituting peptides at volume.",
    trust: ["USP Grade", "Sterility Tested", "Multi-Use Vial", "Research Use Only"],
    form: "Sterile solution",
    specs: [
      { label: "Volume", value: "10 mL" },
      { label: "Grade", value: "USP" },
      { label: "Composition", value: "0.9% benzyl alcohol" },
      { label: "Form", value: "Sterile solution" },
      { label: "Testing", value: "Sterility tested" },
      { label: "Documentation", value: "CoA available upon request" },
    ],
    features: [
      { icon: Scale, title: "Best Value", body: "10mL vial covers many reconstitutions for higher-throughput labs." },
      { icon: Droplets, title: "Bacteriostatic", body: "Benzyl-alcohol preservative supports multiple draws from a single vial." },
      { icon: TestTube, title: "Reconstitution", body: "The standard diluent for returning lyophilized peptides to solution." },
    ],
    crossSell: ["bac-water-3ml", "bpc-157", "tb-500"],
  },
};
