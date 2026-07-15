# Vertex Research Labs — Growth Plan

**Companion to `AUDIT_REPORT.md`.** Top 20 actions ranked by **impact ÷ effort**, split into **This week** (code fixes already shipped on `claude/vertex-growth-audit-rs18yk`), **This month** (content + email + conversion, with drafts), and **This quarter** (authority + retention systems). Because paid ads are banned in this category, everything here is weighted toward **organic search, owned email, content authority, and conversion rate**.

## Priority ranking (impact ÷ effort)

| # | Action | Impact | Effort | Status |
|---|---|---|---|---|
| 1 | Re-stock & sell **BPC-157 + TB-500** (category's #1/#2 keywords; pages already built) | ★★★★★ | Med | **Decision needed** |
| 2 | Wire **GA4 e-commerce events** (view_item→purchase) + SPA pageviews | ★★★★★ | Low | ✅ Shipped |
| 3 | Remove **soft-404s** from sitemap, add tirzepatide, regenerate from catalog | ★★★★☆ | Low | ✅ Shipped |
| 4 | Fix **Product/Organization structured data** (availability, image, breadcrumbs, sameAs) | ★★★★☆ | Low | ✅ Shipped |
| 5 | **Persist cart + compliance ack** to localStorage (stop losing carts on refresh) | ★★★★★ | Low-Med | **Do next (code)** |
| 6 | **Prerender/SSG** the SPA so every URL ships real HTML | ★★★★★ | Med-High | Strategic |
| 7 | Convert product images to **WebP/AVIF** + code-split the 3D hero (CWV) | ★★★★☆ | Med | Needs image tooling |
| 8 | Add **`productSEO` for tirzepatide** + specs (formula/MW/CAS) to all products | ★★★★☆ | Low-Med | Draft below |
| 9 | Build **4 indexable category pages** (peptides/blends/coenzymes/ancillaries) | ★★★★☆ | Med | Draft below |
| 10 | Ship a **peptide reconstitution calculator** tool page | ★★★★☆ | Med | Draft below |
| 11 | Add an **abandoned-cart email flow** (unlocked by #5) | ★★★★☆ | Med | Draft below |
| 12 | **Publish batch COA PDFs** for download (turn "on request" into proof) | ★★★★☆ | Med | Process change |
| 13 | Add a **review/rating system** + `AggregateRating` schema | ★★★★☆ | Med-High | Draft below |
| 14 | Write **12 authority articles** (comparisons, guides, vendor-vetting) | ★★★★☆ | Med | Titles below |
| 15 | Rewrite **hero** to lead with COA/testing proof (A/B) | ★★★☆☆ | Low | 3 options below |
| 16 | Build an **About / team / founder** page (E-E-A-T) | ★★★☆☆ | Low-Med | Draft below |
| 17 | Add **bulk/volume tier pricing** + kit bundles (AOV for labs) | ★★★★☆ | Med | Decision needed |
| 18 | Advertise the **10% incentive on the inline newsletter** form; verify X handle | ★★★☆☆ | Low | Quick |
| 19 | Fill **"Our Facility" photos**; add named article author w/ credentials | ★★★☆☆ | Low | Content |
| 20 | Formalize an **affiliate/referral program** for lab communities + YouTube | ★★★★☆ | High | Quarter |

---

## THIS WEEK — code fixes already shipped

All on branch `claude/vertex-growth-audit-rs18yk`, build + tests passing.

1. **GA4 e-commerce funnel (#2).** New `src/lib/analytics.ts` + wiring: SPA `page_view` on route change, `view_item`, `add_to_cart` (at cart choke points with correct discounted value), `begin_checkout`, `purchase` (dedup-guarded in `finalizeOrder`). → *Your action:* in GA4, mark `purchase` and `begin_checkout` as conversions; verify property in Search Console; submit the new sitemap.
2. **Sitemap integrity (#3).** Dropped `/product/bpc-157`, `/product/tb-500`, `/product/nad-plus` (soft-404s); added `/product/tirzepatide`, `/rewards`, `/track`; regenerated from the 22 real products + 20 articles so it can't drift again.
3. **Structured data (#4).** Fixed `Product` availability (out-of-stock SKUs no longer claim `InStock`), sale price, added `image`/`category`/`mpn`/`itemCondition`; added missing `BreadcrumbList` to all bespoke product pages; enriched `Organization` (logo, address, phone, email, `contactPoint`, `sameAs`) + `WebSite` `SearchAction`; added `SEOHead` to `/quality/testing`; enriched `index.html` OG/Twitter/theme-color.
4. **LCP hints (#7 partial).** `width`/`height` + `decoding="async"` + `fetchPriority="high"` on product hero images (anti-CLS + prioritized paint).

---

## THIS MONTH — content, email, conversion (with drafts)

### A. Persist cart + compliance ack (#5) — *do this first; it's the biggest silent leak*
Move `InquiryCartContext` items and `ComplianceContext` ack into `localStorage` (hydrate on mount, write on change). Effects: carts survive refresh/return-visit; the "Research Use Only" modal stops re-appearing every visit; refreshing on `/checkout` no longer bounces to `/research-access`. This is also the prerequisite for abandoned-cart email (you can't recover what you don't store). *Left as a flagged code task rather than auto-applied because it touches checkout gating and deserves its own tested PR.*

### B. tirzepatide SEO + universal spec fields (#8)
Add a `productSEO["tirzepatide"]` block mirroring its siblings. Draft:
- **metaTitle:** `Tirzepatide 10mg | ≥99% Purity GLP-1/GIP Research Peptide`
- **metaDescription:** `Buy Tirzepatide 10mg research peptide. ≥99% purity, HPLC verified, COA on request. Dual GLP-1/GIP receptor agonist reference material for laboratory research.`
- **keywords:** `tirzepatide, buy tirzepatide, tirzepatide research peptide, tirzepatide 10mg, GLP-1 GIP agonist, tirzepatide COA, tirzepatide purity, dual agonist peptide`
- **FAQs:** what it is (dual GLP-1/GIP agonist, research reference only) · purity/COA · how it differs from retatrutide (dual vs triple agonist) · research-use-only disclaimer.
- **relatedProducts:** `["retatrutide","cjc-ipa-blend","bac-water-3ml"]`

Then extend the `Product` type with `formula`, `molecularWeight`, `cas`, `sequence` and render them in the specs table (both templates) — these are high-intent, differentiate a serious vendor, and enrich the `Product` schema.

### C. Four indexable category pages (#9)
Create real routes `/category/:key` for peptides / blends / coenzymes / ancillaries (the `CATEGORY_GROUPS` data already exists). Each: keyword-led H1 ("Research Peptides — ≥99% Purity, COA on Request"), 150–250 words of compliant intro copy, the filtered product grid, an FAQ block, and `CollectionPage` + `BreadcrumbList` schema. Add them to the sitemap and link from nav/footer (replacing the `/?cat=` homepage deep-links). Targets head terms the product pages can't rank for.

### D. Peptide reconstitution calculator (#10)
A `/tools/reconstitution-calculator` page: inputs = peptide mass (mg), BAC water volume (mL), target concentration; outputs = volume per unit, units per vial. Frame strictly for **laboratory handling** ("reconstitution volume for research handling — not a dosing tool"). This is one of the highest-traffic evergreen queries in the niche, earns links, and naturally cross-sells BAC water. Add `HowTo`/`WebApplication` schema + FAQ.

### E. Abandoned-cart email flow (#11) — *after B/persistence*
Once carts persist and email is captured (popup/checkout), add a Supabase function + scheduled trigger. Sequence:
- **Email 1 — +1 hour** — subject: *"Your Vertex cart is saved"* — items + one-click return-to-cart link; reinforce ≥99% purity + COA.
- **Email 2 — +24 hours** — subject: *"Still deciding? Here's 10% off"* — apply `VERTEX10` if not already used; lead with third-party testing proof.
- **Email 3 — +72 hours** — subject: *"Last call — your cart expires soon"* — honest low-stock note for any low-stock item; single CTA.
Suppress if the order completes; cap at one sequence per 30 days per email.

### F. Publish batch COA PDFs (#12)
The bespoke kit already probes `/coas/<product-id>.pdf` and falls back to email — **drop the real (optionally redacted) batch COAs into `/public/coas/`** and the "Download COA" button lights up automatically. Turns your core differentiator from a promise into on-page proof and adds unique, crawlable content per product.

### G. Hero rewrite — 3 A/B options (#15)
Lead with proof, not values. (Provided as options; positioning is a brand call.)
- **Option 1 (proof-led):** H1 *"Every Batch. Third-Party Tested. COA on File."* / sub *"Research-grade peptides and reference materials at ≥99% HPLC purity — with the documentation to prove it. For laboratory research use only."*
- **Option 2 (audience-led):** H1 *"Peptides Serious Labs Can Cite."* / sub *"Independently verified ≥99% purity, batch-tracked, and backed by Certificates of Analysis. Reference materials for research use only."*
- **Option 3 (differentiator-led):** H1 *"Know Exactly What's In the Vial."* / sub *"≥99% purity by HPLC, independent third-party testing, and a COA for every batch. Research-grade reference materials — never for human use."*
Also: **advertise the 10% welcome offer on the inline newsletter form** (#18) — it already sends the code but the form doesn't say so — and **verify the `@VertexResearchLabs` X handle** (X caps handles at 15 chars; the current value may be invalid).

### H. About / team / founder page (#16)
Biggest remaining E-E-A-T lever. One page: founding story (why the lab exists, the transparency thesis), the QC/testing philosophy, the Freedom Diagnostics partnership, real facility photos (fills the "coming soon" gap, #19), and a named founder + lab lead with credentials. Add `AboutPage` schema and a named `author` (with bio) to articles.

---

## THIS QUARTER — authority & retention systems

### I. 12 authority articles (#14)
Ranked by intent × fit. Each: target keyword — intent — angle.
1. **"BPC-157 vs TB-500: Research Comparison"** — `bpc-157 vs tb-500` — commercial/compare — mechanism, study context, why researchers pair them (→ Wolverine blend).
2. **"Retatrutide vs Tirzepatide vs Semaglutide"** — `retatrutide vs tirzepatide` — compare — receptor-target table (triple vs dual vs single agonist).
3. **"How to Vet a Research Peptide Vendor"** — `most trusted peptide vendor` / `where to buy research peptides` — trust — what a real COA/third-party test looks like (positions Vertex without naming competitors).
4. **"Peptide Reconstitution: A Lab Handling Guide"** — `how to reconstitute peptides` — informational — companion to the calculator tool.
5. **"How to Store Research Peptides (Lyophilized vs Reconstituted)"** — `peptide storage guide` — informational — temp, light, shelf-life; cross-sell BAC water.
6. **"Reading an HPLC Chromatogram on a Peptide COA"** — `how to read peptide purity` — informational — deepens the existing COA guide.
7. **"CJC-1295 vs Ipamorelin vs the CJC/IPA Blend"** — `cjc-1295 vs ipamorelin` — compare — GH-axis research tools (→ CJC/IPA product).
8. **"What Does ≥99% Purity Actually Mean?"** — `peptide purity standards` — informational — net-peptide vs HPLC purity; trust signal.
9. **"GHK-Cu vs Copper Peptides: A Reference Guide"** — `ghk-cu copper peptide` — informational/commercial.
10. **"Melanotan Peptides in Pigmentation Research"** — `melanotan research` — informational — keep compliant pigmentation-biology framing.
11. **"Bacteriostatic Water in the Lab: What It Is & Why It Matters"** — `bacteriostatic water` — informational — cross-sell ancillary.
12. **"Blends Explained: Why Researchers Combine Peptides"** — `peptide blends` — commercial — supports the blends category page.

### J. Review/rating system + AggregateRating (#13)
Add genuine post-delivery review capture (email → verified-buyer review), render star ratings + review text on product pages, and emit `AggregateRating`/`Review` schema **only from real reviews** (never fabricate). Unlocks review stars in search results and closes the top trust-stack gap.

### K. Bulk/volume pricing + kit bundles (#17)
Add lab-oriented volume tiers (e.g. 5-/10-unit price breaks) beyond the fixed 3-Pack, and "starter kit" bundles (peptide + BAC water + alcohol wipes) offered at add-to-cart. Directly lifts AOV for the lab buyers who purchase in volume. *(Pricing decision — flagged, not auto-set.)*

### L. Affiliate program + YouTube channel (#20)
Extend the existing referral system (code + 3× points) into a formal affiliate program for lab communities/newsletters, and start a YouTube channel with educational explainers (reconstitution, reading a COA, HPLC basics) — evergreen, embeddable on product/learn pages, and a channel paid-ad bans can't touch. Seed genuinely-useful presence on r/Peptides-style forums with the COA/testing content, not promotion.

### M. Prerendering (#6) — the multiplier
Once the above content exists, prerendering is what lets it actually rank at full strength. Evaluate `vite-react-ssg` or `react-snap` (lowest-effort for this Vite SPA) to emit static HTML per route, or migrate to an SSG framework. Must be validated against a live Vercel preview before promoting — a broken prerender breaks the whole site, which is why it's staged last, after the content it amplifies is in place.

---

### Measurement — how you'll know it's working
With GA4 events now live: watch **`view_item → add_to_cart → begin_checkout → purchase`** conversion rates weekly (this was previously unmeasurable). In Search Console (after verifying + submitting the sitemap): track impressions/clicks on product + article URLs and the new category/tool pages. Leading indicators for the content work: rankings for `bpc-157`, `tb-500`, `retatrutide vs tirzepatide`, and `peptide reconstitution calculator`.
