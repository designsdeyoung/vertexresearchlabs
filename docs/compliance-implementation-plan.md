# Processor-Readiness Compliance Plan — Vertex Research Labs

**Target classification:** MCC 5169 — Chemicals and Allied Products
**Model:** RUO analytical-grade biochemical reference standards / laboratory research materials
**Goal:** Every public surface (copy, metadata, schema, alt text, checkout, blog) reads as a laboratory reference-materials supplier — never a supplement, wellness, weight-loss, peptide-therapy, or consumer-health store.

**Canonical business description** (reused verbatim, brand-edited, on homepage, About, footer, Terms, checkout, compliance page):

> Vertex Research Labs supplies analytical-grade biochemical reference standards and laboratory research materials to qualified research customers. Materials are intended exclusively for in-vitro research, analytical method development, identity verification, and laboratory evaluation. Products are not intended for human or animal consumption, therapeutic use, clinical use, diagnostic use, dietary supplementation, dosing, injection, ingestion, or administration of any kind.

---

## 1. Audit findings (current state)

**Stack:** Vite + React + TS SPA, Supabase backend, Stripe, deployed on Vercel. Catalog is code-defined in `src/data/`.

**Already compliant / strong:**
- Existing research-use gate: `ResearchDisclaimerDialog`, `ResearchAccess` page, `useCompliance` context, `ComplianceBanner` ("Research Use Only · Not for human or veterinary use").
- Catalog product records in `products.ts` use neutral "reference material supplied exclusively for laboratory research and analytical applications" + "Not for human consumption."

**Gaps / liabilities (ranked):**
1. **`src/data/articles.ts` (141 KB blog)** — weight-loss / obesity / metabolic / diabetes framing; approved-drug comparisons (Ozempic, Wegovy, Mounjaro, Zepbound); healing/recovery/regeneration, tanning, libido/sexual, sleep, cognition claims; before/after-style framing. *Highest liability.*
2. **`src/data/productSEO.ts` (54 KB)** — "Buy X", "best X peptide" retail keywords; drug-comparison FAQs (Retatrutide vs Semaglutide/Tirzepatide); benefit-oriented research summaries; tanning/libido/weight framing in meta.
3. **Retatrutide** — needs the narrow Retatrutide formatting standard (accurate technical name, neutral title/description/meta/schema, no obesity/GLP-comparison).
4. **Tirzepatide** — GLP/GIP; must be reference-material-only, stripped of obesity/diabetes framing.
5. **Wolverine Blend** — consumer code-word name + "Recovery Blend / regenerative / injury / repair" bespoke page. **Rename → "BPC-157 / TB-500 Blend" (5 mg of each).**
6. **MT2 (Melanotan II)** — tanning is a forbidden claim; neutralize name framing + all tanning/skin copy.
7. **PT-141 (Bremelanotide)** — libido/erectile/sexual forbidden; neutralize.
8. **Retail urgency chrome** — `sale.ts` ("10% OFF EVERYTHING — TODAY ONLY"), "Best Sellers" (`FeaturedPeptides`, `BestSellersShowcase`), welcome-discount popups, rewards framing.
9. **Checkout acknowledgment** (`Checkout.tsx`) — present but thin ("for laboratory research use only"); missing explicit not-for-administration/injection/ingestion/dosing/clinical/therapeutic/diagnostic + human/animal consumption language.
10. **`index.html`** meta + JSON-LD — "Research-Grade Peptides" positioning; tighten to analytical reference-standards language.

**Not present (confirmed clean):** SARMs, ED-drug names (sildenafil/tadalafil/etc.), enclomiphene/clomiphene, methylene blue, needles/syringes/alcohol pads/injection kits, pills/capsules/tablets/gummies.

---

## 2. Restricted-product decisions

| Product | Decision | Rationale |
|---|---|---|
| Retatrutide | **Keep, reformat** to strict Retatrutide standard | Allowed as reference material only; strip obesity/GLP-comparison everywhere |
| Tirzepatide | **Keep, reformat** as analytical reference only | GLP/GIP — remove obesity/diabetes framing; neutral technical copy |
| Wolverine Blend | **Rename → "BPC-157 / TB-500 Blend", subtitle "5 mg of each"** | Remove code-word + recovery/injury claims |
| MT2 (Melanotan II) | **Keep, neutralize** — remove all tanning/skin-pigmentation claims | Tanning is a forbidden consumer claim |
| PT-141 | **Keep, neutralize** — remove libido/sexual-function claims | Libido/erectile forbidden |
| KLOW | **Keep**; present as component-defined blend (GHK-Cu/BPC-157/TB-500/KPV) | Code-word softened by explicit composition |
| BAC Water | **Keep as "diluent" reference item**; ensure copy never instructs reconstitution/administration | Injection-adjacent — copy must stay procurement-only |
| Blog drug-comparison articles (Retatrutide-vs-Semaglutide, GLP-1 class) | **Remove** | Irredeemable approved-drug-comparison / weight-loss framing |

No products are deleted from the catalog; risk is removed by reframing. Slug `wolverine-blend` is retained internally to avoid link/route breakage — recommend a follow-up 301 to a neutral slug (optional, not blocking).

---

## 3. Workstreams (delegated, partitioned by file to avoid edit conflicts)

**WS-1 — Catalog data + rename (Sonnet):** `src/data/products.ts`, `src/data/categoryGroups.ts`
- Rename Wolverine → "BPC-157 / TB-500 Blend", subtitle "5 mg of each".
- Confirm every record uses the compliant template (identity, purity, lot docs, intended research scope, restrictions, CoA).
- Ensure category taxonomy stays lab/analytical (no consumer-health categories).

**WS-2 — Bespoke product pages + catalog components (Sonnet):** `src/pages/products/bespokeConfigs.tsx`, `components/BundleSection.tsx`, `ProductCatalog.tsx`, `FeaturedPeptides.tsx`, `BestSellersShowcase.tsx`, `ProductCard.tsx`
- Rewrite Wolverine bespoke page (drop "Recovery/regenerative/injury/repair"; neutral reference framing).
- Remove "Best Sellers" retail framing → neutral ("Catalog" / "Featured reference materials"); procurement card language.

**WS-3 — SEO metadata (Opus):** `src/data/productSEO.ts`
- Apply Retatrutide standard; neutralize all metaTitle/metaDescription/keywords/researchSummary/faqs.
- Strip "buy/best/cheap" retail keywords, drug comparisons, tanning/libido/weight/anti-aging/sleep/cognition benefit claims. Rename Wolverine refs.

**WS-4 — Blog/articles (Opus):** `src/data/articles.ts`
- Remove irredeemable weight-loss/obesity/GLP-drug-comparison articles (update exports/index cleanly).
- Neutralize salvageable articles to analytical/structural/mechanism-of-study framing; no outcomes, no drug brands, no dosing. Rename Wolverine refs.

**WS-5 — Site chrome, checkout, config, policies, meta (Sonnet):** `src/config/sale.ts`, `promo.ts`, `Hero.tsx`, `Footer.tsx`, `AnnouncementBar.tsx`, `TickerBar.tsx`, `EmailCapturePopup.tsx`, `NewsletterSection.tsx`, `Checkout.tsx`, `index.html`, policy pages (`Terms`, `Shipping`, `Disclaimer`, `Quality`, `Methods`, `TestingCOAs`, `ChainOfCustody`)
- Remove sitewide-sale / best-seller / discount-urgency framing.
- Replace checkout final-confirmation copy with the required acknowledgment (see §4).
- Tighten `index.html` title/description/OG/Twitter/JSON-LD to analytical reference-standards language.
- Confirm footer + homepage carry the canonical business description; policies carry qualified-buyer + prohibited-use language.

---

## 4. Required checkout acknowledgment (exact copy)

> I confirm that I am purchasing these materials exclusively for qualified laboratory research or analytical use. I will not use these materials for human or animal consumption, therapeutic use, clinical use, diagnostic use, dietary supplementation, dosing, injection, ingestion, or administration.

Checkbox must be required before payment initiation (already gated by `useCompliance`; strengthen the final-confirmation text). Retain the separate age/qualified-use gate.

---

## 5. Product-page template (enforced)

```
[Name] — Analytical-grade biochemical reference material for laboratory research use only.
Intended Use: in-vitro research, analytical method development, identity verification, laboratory evaluation by qualified research customers.
Documentation: lot-level documentation and Certificate of Analysis access available for review.
Restrictions: not for human or animal consumption; not for therapeutic, clinical, diagnostic, dietary-supplement, dosing, injection, ingestion, or administration use.
Buyer Acknowledgment: by ordering, buyer confirms qualified research use and agrees not to use the material for human/animal consumption or administration.
```
No dosage, reconstitution, route-of-administration, benefits, outcomes, or user reviews.

---

## 6. Metadata / SEO / structured-data checklist

Audit and neutralize: page `<title>` + meta descriptions, OG/Twitter cards, image `alt` text, product & category JSON-LD, sitemap URLs / hidden collection names, plugin-generated snippets, blog categories/tags/search. All must use research-material language only.

---

## 7. Pre-application evidence to assemble (operational)

- Sample Certificate of Analysis URL (CoA assets exist under `src/assets/coa/`).
- Product-page screenshot showing research-only + prohibited-use blocks.
- Checkout acknowledgment screenshot.
- Terms of sale with qualified-buyer + prohibited-use language.
- Homepage screenshot showing reference-material positioning.
- Metadata audit confirming no medical/dosing/injection/weight-loss terms.
- Legal entity + DBA, support email/phone, mailing/contact presence, shipping + refund policies.

---

## 8. Final pre-application checklist

- [ ] Homepage uses analytical-grade reference-material language.
- [ ] Every product page has research-only + not-for-consumption + not-for-administration language.
- [ ] No dosage/injection/reconstitution/cycles/stacks/human-use instructions anywhere.
- [ ] No consumer-benefit claims (weight-loss, tanning, libido, recovery, anti-aging, cognition, sleep, performance) anywhere.
- [ ] No restricted products or consumer-positioned restricted names in catalog, categories, metadata, or hidden pages.
- [ ] CoA / lot-testing references visible.
- [ ] Qualified-buyer acknowledgment before checkout (exact §4 wording).
- [ ] Terms, shipping, refund, contact, compliance pages live.
- [ ] Legal entity + support contact visible.
- [ ] Retail-urgency / sale / best-seller / external-payment framing removed.
