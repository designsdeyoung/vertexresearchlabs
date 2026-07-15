# Vertex Research Labs — Growth Audit (SEO · Marketing · Conversion · Sales)

**Date:** 2026-07-15
**Scope:** Full repo audit + catalog/structured-data cross-check. Code-level fixes implemented on branch `claude/vertex-growth-audit-rs18yk` (see *Implemented fixes* per section).
**Stack:** Vite + React 18 SPA (Lovable-generated), React Router (client-side routing), `react-helmet-async` for head tags, Supabase (Postgres + 40+ Edge Functions), Stripe, Resend (email), deployed on Vercel.

> **Live-site verification note:** the production domain (`vertexresearchlabs.com`) is blocked by this environment's outbound network policy (403 at the egress proxy), and the Vercel share-URL tool could not proxy it either. I therefore audited against the repository, which for a client-rendered SPA *is* what ships: the server returns the same static `index.html` for every route, and all per-page tags are injected client-side. Every finding below is verified against source; items that specifically need a live browser (Lighthouse field data, rendered-DOM crawl) are called out in *Verification limitations* at the end.

---

## Executive summary

This is a **surprisingly mature storefront**, not a thin Lovable template. It already has: a 20-article long-form research library with `Article`/`FAQPage`/`BreadcrumbList` schema; per-product SEO metadata, FAQs and references; a robots.txt tuned for AI crawlers; a real address, phone, and named third-party lab (Freedom Diagnostics); compliant "research use only" copy throughout; a rewards/loyalty system; and an extensive transactional + lifecycle email system (welcome, order confirmation, day-14 restock, day-21 reorder nurture, shipping/delivery, win-back). The compliance discipline is genuinely good — the riskiest compounds (PT-141, Melanotan 2) are drafted carefully and avoid human-use language.

Because the fundamentals are strong, **the highest-leverage wins are a handful of specific defects and gaps, not a rebuild.** The five that matter most:

1. **Client-side rendering with no prerendering (highest impact, strategic).** Every route ships the *same* static `index.html`. All unique titles, descriptions, and JSON-LD only exist after JavaScript executes. Googlebot renders JS (slowly, second-wave), but social scrapers, many AI answer-engines, and low-crawl-budget bots see homepage OG tags on every product and article URL. For a business whose *only* growth channels are organic + shares (paid ads are banned in this category), this caps the ceiling on everything else. **Fix = prerender/SSG at build.**
2. **Soft-404s in the sitemap (fixed).** `/product/bpc-157`, `/product/tb-500`, `/product/nad-plus` were listed in the sitemap and had full SEO + page configs, but **no product records exist**, so they rendered "Product Not Found." BPC-157 and TB-500 are the two highest-volume research-peptide search terms in the entire category — and the store isn't selling them. (Sitemap cleaned; **re-stocking these two SKUs is the single biggest revenue opportunity** — flagged, not auto-added, because it's a product/pricing decision.)
3. **Analytics measured almost nothing (fixed).** GA4 was installed but fired only the initial pageview — zero `view_item`/`add_to_cart`/`begin_checkout`/`purchase`, and no pageviews on SPA route changes. You were flying blind on the entire funnel. Full e-commerce event tracking is now wired.
4. **Cart and compliance state are in-memory only.** A page refresh **wipes the cart** and re-shows the "Research Use Only" modal. Refreshing on `/checkout` bounces the user back to `/research-access`. This silently leaks orders.
5. **Product images are 1.0–1.9 MB PNGs (22 of them).** This is the dominant Core Web Vitals problem — LCP on every product page is a ~1.8 MB image. WebP/AVIF conversion cuts ~80% off with zero visible change.

Everything else is incremental. Implemented code fixes are grouped below and pushed; strategic items have specific, drafted recommendations in `GROWTH_PLAN.md`.

**Overall grade by area:** Technical SEO **B‑** (great metadata, undermined by CSR + soft-404s) · Content/E-E-A-T **A‑** (library + trust pages are excellent; no About/team page) · Marketing **B** (email system strong; positioning slightly soft) · Conversion **B‑** (good AOV mechanics; cart-persistence and gating friction).

---

## Phase 1 — Technical SEO

### 1.1 Rendering & indexability — **the ceiling problem**

| Item | Current state | Issue | Impact | Effort |
|---|---|---|---|---|
| **Client-side rendering** | Vite SPA, no SSR/SSG/prerender. `vercel.json` rewrites all routes to `/index.html`. Per-page tags via Helmet run only after hydration. | Non-JS crawlers/scrapers see homepage title+OG on *every* URL. Googlebot must render (slower, second-wave indexing). Weak link previews for shared product/article links. | **High** | **Med** |
| robots.txt | Well done — explicit allows for Googlebot/Bing + AI engines (GPTBot, PerplexityBot, Claude-Web, OAI-SearchBot), blocks Ahrefs/Semrush/scrapers, disallows `/dashboard`,`/checkout`,`/auth`,`/order-confirmation`. Sitemap referenced. | None material. Consider allowing `AhrefsBot`/`SemrushBot` **only if** you want your own audits via those tools. | Low | — |
| XML sitemap | Existed but **drifted from catalog** (see 1.2). Now regenerated from source-of-truth. | Was serving soft-404s. | High | **Fixed** |
| Canonicals | Present and correct per route via `SEOHead` (`BASE_URL + canonical`). Homepage self-canonical in `index.html`. | Grouped size-variants (`ghk-cu` vs `ghk-cu-100`) each self-canonical — correct (distinct SKUs). | Low | — |
| 404 handling | `NotFound.tsx` renders a 404 UI, but the server returns **HTTP 200** (SPA rewrite). Missing products render "Product Not Found" under a 200. | Soft-404. Low volume once sitemap is clean, but any bad inbound link is a soft-404. | Med | Med |
| Trailing slash / www / http | Vercel handles http→https and www normalization at the platform layer (not in repo). | Verify in Vercel domain settings that `www` 301s to apex (or vice-versa) and both aren't indexable. | Med | Low |

**Implemented:** sitemap regenerated (1.2). **Recommended (strategic, in GROWTH_PLAN):** add prerendering (e.g. `vite-react-ssg`, `react-snap`, or migrate to a framework with SSG) so each of the ~55 URLs ships fully-formed HTML. This is deliberately *not* auto-implemented — it changes the build/deploy pipeline and must be verified against a live deploy to avoid breaking the site.

### 1.2 Sitemap ↔ catalog integrity — **defect found & fixed**

Cross-checking `products.ts` ⇄ `productSEO.ts` ⇄ `bespokeConfigs.tsx` ⇄ `sitemap.xml` surfaced drift:

- **Soft-404s (removed):** `/product/bpc-157`, `/product/tb-500`, `/product/nad-plus` were in the sitemap and had full SEO + bespoke page configs, but **no matching product in `products.ts`** → render "Product Not Found." Google was being fed three dead URLs, two of them the category's top keywords.
- **Missing real product (added):** `tirzepatide` is a live, purchasable SKU (`$85`, `isNew`) but was **absent from the sitemap** and has **no `productSEO` entry** (so it falls back to generic title/description/keywords).
- **Fix:** `public/sitemap.xml` is now generated directly from the 22 real product IDs and 20 article slugs, with `/rewards` and `/track` added. It can no longer silently drift.

**Still open (needs product decision):**
- **BPC-157 & TB-500 do not exist as sellable products.** They're the two most-searched research peptides; the SEO/page scaffolding is already written and waiting. Re-adding them (with price/stock) is the highest-ROI single action in this whole audit — see GROWTH_PLAN #1.
- `tirzepatide` needs a `productSEO` entry (title/description/keywords/FAQs) to match its siblings — drafted in GROWTH_PLAN.

### 1.3 Meta layer

| Item | State |
|---|---|
| Per-page `<title>`/description | Good. `SEOHead` (Helmet) sets unique values per route; products pull from `productSEO` (keyword-led titles ≤60-ish, benefit-led descriptions). Homepage, Learn, articles all unique. |
| Duplicates/missing | `tirzepatide` (no `productSEO` → generic fallback). `TestingCOAs.tsx` had **no `SEOHead` at all** (inherited homepage tags) — **fixed** (added unique title/description/keywords + breadcrumb schema). Worth spot-checking `Methods`, `ChainOfCustody`, `Rewards`, `Shipping`, legal pages for `SEOHead` presence (some appear to rely on defaults). |
| Open Graph / Twitter | `SEOHead` emits full OG + `summary_large_image` Twitter tags with per-page title/description and product image type. `index.html` enriched with OG dimensions/alt, Twitter title/desc/alt, `og:locale`, `theme-color` — **fixed**. |
| `twitter:site` handle | Set to `@VertexResearchLabs` (19 chars). X handles max out at 15 characters, so this may be an invalid/placeholder handle — **verify the real handle** and correct it; a bad handle suppresses card attribution. |

### 1.4 Structured data — **defects found & fixed**

| Schema | State before | Fix |
|---|---|---|
| `Product` (shared template `ProductDetail.tsx`) | Hardcoded `availability: InStock` **even for sold-out SKUs** (kisspeptin, epithalon, pt-141, etc.), used **list price not sale price**, and had **no `image`**. Mismatched structured data risks Merchant/rich-result penalties. | Now reflects real `outOfStock` → `OutOfStock`, uses sale price, adds `image` (absolute), `category`, `mpn`, `itemCondition: NewCondition`. |
| `Product` (bespoke kit `_kit.tsx`) | Correct availability & sale price, but **no `image`** and **no `BreadcrumbList`**. | Added `image`, `category`, `mpn`, `itemCondition`, and the missing `BreadcrumbList`. |
| `BreadcrumbList` | Present on shared template + articles; **missing on all bespoke product pages** (ghk-cu, bpc-157*, tb-500*, mots-c, tesamorelin-2mg, pt-141, wolverine-blend, cjc-ipa, bac-water, nad-plus). | Added to bespoke kit → now on every product page. |
| `FAQPage` | Correct on products (from `productSEO.faqs`) and articles. | — |
| `Organization` | Homepage + `index.html` had `logo` pointing at the 1.4 MB `og-image.png` and **empty `sameAs`**, no address/contact. | Now: real `logo-black.png`, postal address (Clearwater FL), phone, email, `contactPoint`, `sameAs` (X). Added `WebSite` `SearchAction` (sitelinks search box). |
| `Article` | Excellent — headline, dates, publisher, breadcrumbs, FAQ, OG article tags. Only gap: `author` is the Organization, not a credentialed person (E-E-A-T — see Phase 2). | — |
| Missing opportunity | No `AggregateRating`/`Review` anywhere (no review system exists — see Phase 3 trust stack). Adding a genuine review system later unlocks review stars in results. **Do not fabricate ratings.** | — |

*BPC-157/TB-500 bespoke pages are currently unreachable (no product record).

### 1.5 Site architecture & internal linking

- **URL structure:** clean and keyword-friendly (`/product/bpc-157`, `/learn/how-to-read-peptide-coa`, `/quality/testing`). Good.
- **Category pages:** **Weakness.** Categories are **not real URLs** — the footer/nav "Peptides / Blends / Coenzymes / Ancillaries" links deep-link into a *filtered homepage* (`/?cat=peptides#products`). There is no indexable `/category/peptides` landing page to rank for head terms like "research peptides for sale" or "copper peptides." This is a missed mid-funnel layer. (GROWTH_PLAN — build 4 category pages.)
- **Click depth:** every product is ≤2 clicks from home (home → catalog → product), and articles cross-link to products. Good.
- **Cross-sell / related:** product pages render related products (from `productSEO.relatedProducts`/config `crossSell`); articles link to related products and related articles. Good internal-link graph.
- **Breadcrumbs:** visible breadcrumbs on quality/testing pages; schema breadcrumbs now on all products + articles.

### 1.6 Performance / Core Web Vitals

| Item | State | Impact |
|---|---|---|
| **Product images** | **22 PNGs at 1.0–1.9 MB each** (`src/assets/products/`, `showcase/`). Product-page LCP is a ~1.8 MB image. | **High.** Dominant CWV cost. |
| **OG image** | `og-image.png` is **1.48 MB** (spec recommends <300 KB; also declared 1200×630 but should be verified). | Med — slows social unfurls. |
| **JS bundle** | Main chunk **1.27 MB (355 KB gzip)**, single chunk. Pulls in `three` + `@react-three/fiber` + `@react-three/drei` (3D hero), `framer-motion`, `recharts`. Build warns >500 KB. | High — TBT/hydration cost, especially mobile. |
| Image lazy-loading | `ProductCard` images already `loading="lazy"`. Good. | — |
| LCP image hints | Product-page hero images had no dimensions/priority. **Fixed** — added `width`/`height` (anti-CLS) + `decoding="async"` + `fetchPriority="high"`. | Med |
| Fonts | Google Fonts with `display=swap` + `preconnect`. Good. Five families/weights is a bit heavy — consider self-hosting or trimming. | Low |
| Caching headers | Managed by Vercel (hashed assets get immutable caching). Fine. | — |

**Implemented:** LCP image attributes. **Recommended (can't run here — no `sharp`/`cwebp` in this environment):**
1. **Convert product/showcase PNGs → WebP (and ideally AVIF).** ~80% size cut. Command for your machine:
   `for f in src/assets/products/*.png src/assets/showcase/*.png; do cwebp -q 82 "$f" -o "${f%.png}.webp"; done` then update imports (or use `vite-imagetools` to generate at build).
2. **Code-split the 3D hero.** `React.lazy()` the `three`-based `HeroVialScene`/`Hero3DScene` so `three` (~600 KB) isn't in the initial bundle; render a static vial image as the fallback. Add `manualChunks` for vendor libs.
3. Compress `og-image.png` to <300 KB.

### 1.7 Mobile & hygiene

- **Viewport:** correct (`width=device-width, initial-scale=1`).
- **Tap targets / 375px:** layouts use responsive Tailwind; product pages have a mobile sticky add-to-cart bar. Header collapses to a hamburger with search. Looks sound in code; **verify on a real 375px device** (see limitations).
- **Heading hierarchy:** one keyword-bearing `<h1>` per page (hero, product name, article title). Section `<h2>`s used correctly.
- **Alt text:** product images, COA images, hero vials, and logos all have `alt`. Decorative backgrounds use `aria-hidden`. Good — one of the cleaner accessibility stories in a Lovable build.
- **HTTPS / mixed content:** all asset refs are relative or https. No mixed content in source.
- **hreflang:** correctly absent (single-region US business).

---

## Phase 2 — On-page & content SEO

### 2.1 Keyword coverage

The keyword architecture is strong per-product: each `productSEO` entry targets the compound + `buy X`, `X 50mg`, `X COA`, `X purity`, `X research peptide`, `X vs Y`, plus long-tail (e.g. `LY3437943`, `trending research peptides 2024`). The 20-article library covers explainers, a COA-reading guide, and a purity-standards guide.

**Gaps (dedicated optimized page missing):**
- **`buy BPC-157` / `BPC-157 for sale` / `TB-500 for sale`** — no product page exists (see 1.2). Highest-value gap in the category.
- **`tirzepatide`** cluster — product exists but no `productSEO` (generic tags) and no `/learn` article.
- **Category/head terms** — `research peptides for sale`, `copper peptides`, `GLP-1 research peptides`, `peptide blends` — no category landing pages (see 1.5).
- **Tools / high-intent utilities** — **`peptide reconstitution calculator`** and **`peptide dosage/reconstitution chart`** are huge, evergreen, link-earning search terms in this niche. No calculator exists. (Compliant framing: "reconstitution volume calculator for laboratory handling.")
- **Comparison terms** — `retatrutide vs tirzepatide`, `semaglutide vs tirzepatide vs retatrutide`, `BPC-157 vs TB-500`, `CJC-1295 vs ipamorelin` — only partially covered inside articles; deserve dedicated comparison pages.
- **`where to buy research peptides` / `most trusted peptide vendor`** — trust/roundup intent; addressable with a "how to vet a peptide vendor / third-party testing" authority piece.

Full keyword→page map and the article backlog are in `GROWTH_PLAN.md`.

### 2.2 Product page depth

Product pages are **not thin** — the bespoke template renders hero, composition breakdown (blends), feature cards, a specs table, research overview, FAQ accordion, references with PubMed links, and cross-sell. The shared template is slightly lighter but still has specs, research summary, FAQ, references.

**Depth gaps:**
- **Specs table is incomplete for SEO.** It shows Purity/Testing/Documentation but **omits molecular formula, molecular weight, CAS number, and sequence** — exactly the specifics researchers search and that differentiate a serious vendor. Add these fields to the `Product` type and render them.
- **COA is "on request," never shown pre-purchase.** The kit already looks for `/coas/<id>.pdf` and falls back to email. **Publishing real batch COA PDFs** (even redacted) turns "COA available on request" into "COA — download" — a major trust/conversion and unique-content signal. Two COA *images* exist (GHK-Cu, Retatrutide); the rest are request-only.
- `tirzepatide` uses the generic shared template with fallback copy — needs its `productSEO` block.

Top-5-seller upgrade drafts (BPC-157, TB-500, Retatrutide, GHK-Cu, Tirzepatide) are in `GROWTH_PLAN.md`.

### 2.3 Content / authority gap

The library is a real moat-in-progress (20 articles, properly structured, internally linked). Biggest opportunities: the missing high-intent **tool** (reconstitution calculator), **comparison** pages, a **vendor-vetting/third-party-testing transparency** piece, and **storage/handling** guides. 12 specific titles with target keyword + intent + angle are in `GROWTH_PLAN.md`.

### 2.4 E-E-A-T signals

**Strong (already present):**
- Real **physical address** (1444 S Belcher Rd STE C-103, Clearwater, FL 33764), **phone** (727-295-1338), **email** — on Contact + Privacy, now also in Organization schema.
- **Named third-party lab** — Freedom Diagnostics (ISO-certified) on Quality + Chain-of-Custody.
- **Deep methods page** — HPLC, LC-MS/MS, GC-MS residual solvents (ICH Q3C), LAL endotoxin, TAMC/TYMC microbial, retention samples, pass/fail spec table. Genuinely credible.
- Full legal set: Terms, Privacy (CCPA/CPRA + GDPR), Disclaimer, Shipping/Returns.
- Honest disclosure ("we do not claim GMP certification").

**Gaps:**
- **No About / team / founder page.** No named humans anywhere. For a YMYL-adjacent category, a named founder + lab-lead with credentials is the biggest remaining E-E-A-T lever. (Draft in GROWTH_PLAN.)
- **Article author = Organization**, not a credentialed person. Add a named reviewer/author with a short bio.
- **"Our Facility" gallery is empty placeholders** ("Photo gallery coming soon") on Chain-of-Custody. Real photos = strong trust proof; empty placeholders slightly *reduce* it.
- No visible **review/rating** system (also a conversion/trust gap — Phase 3).

### 2.5 Compliance flags (protects payments + rankings)

Overall the copy is well-hardened. Residual soft risks to review (all currently hedged, but worth tightening because this category loses payment processors over exactly this):
- `articles.ts` (Retatrutide): "338 participants **with obesity** … 48 weeks" — human-trial/obesity framing on a product you sell. Keep the "not a treatment claim" hedge; consider moving human-trial detail into clearly-labeled "published clinical literature" context.
- `articles.ts` (Selank): title/keyword uses **"Anxiolytic"** — a therapeutic category term in an indexable `<title>`; body stays in animal models. Consider "Selank: Tuftsin-Analog Peptide in Behavioral Neuroscience Research."
- `articles.ts` (Semax): "**cognitive** behavior assays," BDNF — framed as rodent/preclinical; acceptable but keep the framing tight.
- `articles.ts` (DSIP): "**sleep**/slow-wave sleep" — inherent to the compound; tied to animal EEG studies. Acceptable.
- Product data itself is clean (no dosing, no human-use, no before/after). The only sensitivity is a PT-141 citation to *Journal of Sexual Medicine* — a reference, not a claim; fine.

No dosing instructions, mg/kg protocols, second-person consumption language, or before/after imagery were found. **This is a well-run compliance posture — keep the discipline as content scales.**

---

## Phase 3 — Marketing

### 3.1 Positioning & messaging (5-second test)

Homepage hero: **"Research-Grade Peptides. Built on Purity, Precision, and Transparency."** + "Ultra-high purity reference materials, independent purity verification, and strict quality standards for researchers who demand certainty."

- **What it is:** clear (research-grade peptides). ✅
- **Why this vendor:** implied (purity/COA/transparency) but abstract — "Purity, Precision, Transparency" is a values triad, not a *proof* claim. ✅⁻
- **Who it's for:** "researchers" — okay but generic. ⚠️
- **The differentiator (verified COAs + batch tracking + ≥99% HPLC) is not the headline.** It's the strongest asset and it's buried in a subhead/trust chips.

Three sharper hero options (drafted, provided for A/B — not auto-applied since positioning is a brand call) in `GROWTH_PLAN.md`. Direction: lead with the *proof* ("Every batch. Third-party tested. COA on file.") rather than the *value* ("Purity, Precision, Transparency").

### 3.2 Trust stack

| Signal | Present? |
|---|---|
| Third-party testing badge / named lab | ✅ Freedom Diagnostics, ISO-certified, on Quality/CoC + TrustBar |
| COA access | ⚠️ "on request"; 2 COA images published, rest email-only |
| Purity claim (≥99% HPLC) | ✅ Everywhere |
| Secure-checkout badge | ✅ TrustBar + Stripe Payment Element |
| Shipping speed proof | ✅ "Orders ship in 1–2 business days" |
| **Review / rating system** | ❌ **None** — no social proof, no star ratings, no testimonials |
| **Money-back / purity guarantee** | ❌ None stated (and returns are "all sales final") |
| Real facility photos | ❌ Placeholder "coming soon" |
| Named team / founder | ❌ None |

The **missing review system** is the biggest trust-stack + conversion gap: no social proof on any product page, and it also blocks `AggregateRating` rich results. Recommendation + honest guarantee language in GROWTH_PLAN.

### 3.3 Email capture & lifecycle — **already strong**

- **Capture:** exit-intent + 8s-delay popup offering **10% off first order** (code `VERTEX10`), 30-day cookie suppression, gated behind compliance ack. Plus a homepage newsletter section (which quietly also sends the 10% welcome even though it advertises only "updates" — a small missed-incentive-copy issue: the inline form should *advertise* the 10%).
- **Sink:** Resend audience via a `subscribe` Edge Function. **Note:** newsletter subscribers live only in Resend — there's no Supabase subscribers table, so segmentation/export depends entirely on Resend.
- **Lifecycle (built):** welcome+discount, order confirmation, points-earned, referral notification, **day-14 restock reminder** (Resend-scheduled), **day-21 reorder nurture** (cron batch), shipping/in-transit/out-for-delivery/delivered (EasyPost webhook), **win-back blast + follow-up**, payment reminder, magic-link. This is a genuinely complete lifecycle for a store this size.
- **Gaps:**
  - **No abandoned-cart flow** — and it *can't* exist today because the cart is in-memory (never persisted). Highest-value email gap. (Requires cart persistence first — see 4.2.)
  - **Cron not wired in-repo** — the nurture/win-back "cron modes" exist but no `pg_cron`/scheduler is defined in the repo; confirm an external scheduler actually fires them, or they're dormant.
  - Win-back follow-up blasts **every profile with points > 0** (no eligibility window) and is BCC'd to a personal Gmail — tighten targeting before scaling.

### 3.4 Channels (paid banned — organic/owned only)

- **Unavailable (do not pursue):** Google Ads, Meta/Instagram ads, most paid social — research peptides are restricted. Correctly avoided.
- **Primary levers:** organic search (weight here), email (strong already), and **content authority**.
- **X/Twitter:** `@VertexResearchLabs` referenced in cards; the handle may be invalid (>15 chars) — verify and wire it into Organization `sameAs` (done, pending confirmation) and footer.
- **Under-used, high-fit:** Reddit/forum presence (r/Peptides and similar) via genuinely useful COA/testing content; **YouTube** educational explainers (reconstitution, reading a COA, HPLC basics) — evergreen, embeddable on product/learn pages, and a channel ads can't touch; **affiliate/referral for lab communities** — a referral system already exists (code + 3× points), so extend it into a formal affiliate program.

### 3.5 Analytics — **fixed**

- **Before:** GA4 (`G-YY1Q0F0ZCQ`) loaded but fired only the initial pageview. No SPA route pageviews. **Zero** e-commerce events. No Search Console verification file in repo. No server-side purchase event.
- **Implemented:** `src/lib/analytics.ts` (guarded, no-ops without gtag) + wiring for `page_view` (route change), `view_item`, `add_to_cart` (at cart choke points, correct discounted value), `begin_checkout`, and `purchase` (in `finalizeOrder`, dedup-guarded). See Phase 1 commit.
- **Still to do (you, outside repo):** verify the property in **Google Search Console** (DNS or the GA4 tag counts as verification), submit the new sitemap, and mark the GA4 events as **conversions** (`purchase`, `begin_checkout`). Optionally add server-side `purchase` via the Measurement Protocol for redirect-based payment methods (Cash App/Klarna) where the client event may not fire.

---

## Phase 4 — Conversion & sales

### 4.1 Product-page conversion

- **Strong:** price + sale price visible; stock status + honest "Low stock — order soon" (real `stock` counts, not fake timers); prominent add-to-cart above the fold + mobile sticky bar; **3-Pack (10%)** and **Subscribe & Save (10%)** stackable offers surfaced right at the CTA; free-shipping threshold ($99) shown in cart.
- **Gaps:** COA is not downloadable pre-purchase (4 findings above); no bulk/volume **quantity-tier table** (labs buy in volume — only a fixed 3-Pack exists); no reviews/social proof; specs table missing formula/MW/CAS.

### 4.2 Friction — **two silent revenue leaks**

| Friction | Detail | Impact |
|---|---|---|
| **Cart not persisted** | Cart is in-memory React state (`InquiryCartContext`, `useState`). A refresh, tab restore, or return visit **loses the entire cart**. | **High** — direct lost orders; also blocks abandoned-cart email. |
| **Compliance ack not persisted** | Ack is in-memory too. The "Research Use Only" modal **re-appears on every refresh/visit**, and refreshing on `/checkout` bounces the user to `/research-access` (checkout requires `hasAcknowledged`). | **High** — repeated interruption + checkout bounce. |
| Mandatory phone number | Checkout requires phone. | Low-Med — minor field friction. |
| Two-click payment reveal | "Continue" reveals the Stripe element rather than showing it inline; second click needed. | Low |
| Discount auto-apply gated on email | `?discount=CODE` only applies after email is typed. | Low |

**Good news on friction:** checkout is **guest checkout** (no forced account), supports Apple Pay/Google Pay via Stripe, has Google Places address autocomplete, stacks discount + store credit, and shows shipping cost before payment. The core is solid — **fix persistence** (localStorage for cart + ack) and most of the leak closes. This is a safe, high-value code change flagged for GROWTH_PLAN (not auto-done here because it touches checkout/state logic and warrants its own tested change).

### 4.3 AOV levers

- **Present:** 3-Pack (10%), Subscribe & Save (10%, stacks → 19% on 3-pack autoship), free-shipping threshold ($99) with cart nudge, cross-sell on product pages, rewards/points (3×/6× on autoship), peptide blends (KLOW, Wolverine, CJC/IPA).
- **Missing:** **bulk/volume tier pricing** for labs (e.g. 5/10-unit price breaks) beyond the fixed 3-Pack; **kit bundles** (peptide + BAC water + supplies — BAC water is sold but not bundled at the point of adding a peptide); a "researchers also bought" data-driven rail (current cross-sell is manually curated).

### 4.4 Retention levers — **strong**

Subscribe & Save (30/90-day autoship), day-14 restock reminder, day-21 reorder nurture, 8-tier rewards ladder with store credit, referral program (3× points), win-back. This is well ahead of a typical store. Main add: a **one-click reorder** shortcut from account/email (the nurture email has reorder cards — extend to a persistent "Reorder" action in the dashboard).

### 4.5 Urgency/scarcity (honest)

Done right: low-stock badge is driven by real `stock` values, out-of-stock is clearly marked, "ships in 1–2 business days" is a real promise. **No fake countdown timers.** Keep it this way — the sitewide "10% OFF — TODAY ONLY" sale label (`sale.ts`, currently `active:false`) is the one thing to use sparingly and truthfully if re-enabled.

---

## Implemented code fixes (this branch)

| Commit | Category | Files |
|---|---|---|
| Structured data | Product availability/image/breadcrumbs + Organization + TestingCOAs SEOHead + index.html OG/Twitter | `ProductDetail.tsx`, `_kit.tsx`, `Index.tsx`, `index.html`, `TestingCOAs.tsx` |
| Sitemap hygiene | Remove soft-404s, add tirzepatide, regenerate from source | `public/sitemap.xml` |
| Analytics | GA4 funnel events + SPA pageviews (+ LCP image attrs) | `analytics.ts` (new), `ScrollToTop.tsx`, `InquiryCartContext.tsx`, `ProductDetail.tsx`, `_kit.tsx`, `Checkout.tsx`, `finalizeOrder.ts` |

**Explicitly NOT changed (flagged for decision):** product catalog/pricing (BPC-157/TB-500 re-stock, bulk tiers), checkout/cart-persistence logic, hero positioning copy, image binary re-encoding (no image tooling available in this environment). All are specified with drafts in `GROWTH_PLAN.md`.

## Verification limitations

- **Live production pages** couldn't be fetched (egress policy blocks the domain; Vercel proxy tool declined). Findings are verified against source, which for this CSR SPA equals the shipped initial HTML.
- **Lighthouse / field CWV** couldn't be run here (no live URL + no headless run against prod). Image/bundle sizes are from the actual production build output (`npm run build`), so the *causes* are confirmed even though the *scores* aren't measured.
- **Rendered-DOM crawl** (what Googlebot sees post-hydration) couldn't be executed — this is exactly why prerendering is recommended rather than assumed-fine.
- **WebP/AVIF conversion** couldn't be performed (`sharp`/`cwebp` absent); provided as a command instead.
- Build (`npm run build`) passes; test suite passes; TypeScript shows only pre-existing unrelated errors (`AddressAutocomplete` missing `@types/google.maps`). All JSON-LD validated as parseable JSON.
