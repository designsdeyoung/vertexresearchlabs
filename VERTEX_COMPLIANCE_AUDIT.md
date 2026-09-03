# Vertex Research Labs Compliance-Risk Audit

**Audit date:** September 3, 2026
**Scope:** Repository-wide review of public pages, catalog data, metadata, structured data, images and alt text, navigation, cart/checkout, policies, email functions, chatbot, database migrations, API functions, sitemap, robots rules, dependencies, and legacy routes.
**Status:** Production deployment was authorized on September 3, 2026. Deployment and live verification results are recorded in the release task.
**Important:** This is an engineering and marketing risk review, not legal advice or a conclusion that any product, sale, or claim complies with the FD&C Act, FTC Act, state law, institutional rules, payment-network rules, or any other requirement.

## Baseline and method

The review used the total-impression principle: a research-use disclaimer cannot cure surrounding content or conduct that communicates intended personal use. The primary references were the FDA warning-letter database, the FDA's August 24, 2026 NuScience Peptides warning letter, and the FTC Health Products Compliance Guidance:

- https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/compliance-actions-and-activities/warning-letters
- https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/nuscience-peptides-llc-733652-08242026
- https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance

The NuScience letter is especially relevant because FDA treated website intended-use statements and selling bacteriostatic water alongside peptides as evidence of injectable drug intent, and expressly rejected RUO/not-for-human-use wording where other evidence contradicted it. FTC guidance likewise evaluates express and implied claims in context and requires competent substantiation; a disclaimer is not a safe harbor.

## Executive red-team result

Before remediation, an investigator or processor could reasonably infer consumer personal-use sales from the combination of purchasable high-risk peptides, GLP-related/coded products, bacteriostatic water, reconstitution instructions, effects-oriented articles, consumer search SEO, bestseller/low-stock/free-shipping prompts, timed restock emails, referral rewards, and generic purity/independent-testing claims. That total impression contradicted the RUO notices.

After remediation, the working tree is materially more research-oriented: effects articles and chatbot UI are removed, BAC water and coded products are withheld, product copy is neutral, unsupported blanket testing claims are removed, qualification is organization-only, organization and final research-use confirmation are required at checkout, tracking is opt-in, old pages redirect, and lifecycle messages that most strongly implied personal cadence are retired. Important business, security, evidence, legal, and deployment work remains.

## Findings and disposition

| Severity | Location | Current language/function at audit start | Why it matters | Recommended change | Status |
|---|---|---|---|---|---|
| CRITICAL | `migration/auth/*`, `migration/data/*` | Tracked exports contained real names, emails, addresses, account and order/reward data. | Customer data in source control can be copied through clones, backups, CI logs, or history even after a working-tree deletion. | Remove exports; ignore future dumps; assess access; purge Git history with a coordinated backup/clone plan; notify counsel/security; rotate credentials only if exposure analysis warrants it. | **Partial:** working-tree files removed and ignored. Git history and production/backup access are unresolved. |
| CRITICAL | `src/data/articles.ts`, `/learn/*`, product SEO and internal links | Effects-oriented research summaries, human-condition language, consumer-intent keywords, and product pathways sat beside checkout. | Scientific language can still establish intended use when used as sales-oriented disease/effect content. | Remove until each article has scientific, legal, and substantiation review and is institutionally focused without a sales funnel. | **Fixed:** article routes/data/navigation removed; old URLs redirect to the neutral methods page and are absent from sitemap. |
| CRITICAL | BAC-water products, cart upsell, Methods page | BAC water was sold with peptides, described as a required diluent, and paired with reconstitution instructions. | FDA has expressly cited this combination as evidence of intended injection. | Stop offering diluent, remove preparation instructions and related SEO/assets from production output. | **Fixed in reachable site:** products/upsell/instructions/routes removed. Unused source image files remain and should be deleted before release. |
| HIGH | RP-200/RP-300 and legacy redirects | Coded catalog identities and redirects from tirzepatide/retatrutide could appear designed to conceal product identity. | Obfuscation is adverse evidence for regulators/processors and undermines truthful marketing. | Remove coded items and all disguise redirects; do not relaunch without identity, legal-status, and documentation review. | **Fixed:** removed from catalog and sitemap; discontinued routes redirect to `/`. Unused source images remain. |
| HIGH | All product records and product cards | Blanket `≥99%`, independent testing, and COA claims appeared across products without matched current lot records. | Material, lot, and method-specific claims need evidence; one result cannot substantiate every product or lot. | Use “see/request current lot documentation”; publish nothing until identity, lot, method, issuing lab, and result are matched and verified. | **Fixed in copy.** Owner must build the evidence library before making positive claims. |
| HIGH | `src/assets/coa/ghk-cu-coa.jpg`, prior product detail/quality UI | The only bundled COA appeared to identify a GHK-Cu/BPC-157/TB-4 blend, lot CGM-003, not the labeled standalone GHK-Cu item or current KLOW formula/amount. | A mismatched report can be materially deceptive and creates traceability risk. | Do not display it; reconcile with source records; delete or quarantine the file; obtain correct lot-specific records. | **Display fixed:** component/import deleted and asset no longer bundles. Physical source file still requires deletion/quarantine. |
| HIGH | `src/components/ChatWidget.tsx`; `supabase/functions/chat/index.ts` | Public assistant used a Lovable AI gateway and a stale hard-coded catalog/prices with unsupported purity language. Production returned HTTP 500 because `LOVABLE_API_KEY` was absent. | A broken, unconstrained assistant can invent dosing, personal recommendations, or product claims and creates needless compliance exposure. | Remove public UI; retire endpoint. Reintroduce only with a tested refusal policy, current approved retrieval corpus, logging/privacy controls, adversarial tests, and human ownership. | **Fixed:** UI deleted; route removed; endpoint returns 410. |
| HIGH | Checkout/gate (`ComplianceContext`, `ResearchAccessGate`, `Checkout`) | Individuals could self-identify as eligible; organization was optional; acknowledgments were mostly client-side. | Weak qualification does little to change the actual customer base or preserve meaningful evidence. | Restrict to authorized organizational procurement, require organization and explicit prohibitions, validate server-side, record time and organization. | **Substantially fixed:** UI and manual endpoint validation added; migration records organization/time. Migration not applied and no independent credential verification exists. |
| HIGH | `submit-order-request`, `award-points`, `create-payment-intent`, subscription functions | Public/manual endpoint trusted client totals; `award-points` accepted client order/payment data; card endpoints trusted client prices; webhook signature was optional. | Attackers could manipulate orders/rewards or forge payment state; public email preview could be abused. | Price only from a server catalog, verify paid PaymentIntents from Stripe, require auth/admin roles, rate-limit public submissions, require webhook signatures, and make disabled rails fail closed. | **Partial:** numeric reconciliation, acknowledgment validation, preview shutdown, payment feature gate, admin checks, and mandatory webhook signature added. Server-authoritative pricing/payment verification and rate limiting remain HIGH. |
| HIGH | `admin-create-manual-order`, `send-new-compound-announcement` | Service-role operations did not independently enforce an admin allowlist; announcement function was configured without JWT verification. | Any authenticated or public caller could potentially invoke privileged account/order/email behavior. | Require a verified user and centrally managed admin role; avoid hard-coded personal email allowlists. | **Partial:** explicit allowlist checks added and announcement JWT enabled. Replace allowlists with role/claims and test deployed config. |
| HIGH | Email lifecycle (`send-reorder-nurture`, `send-restock-reminder`, win-back functions) | “Time to reorder,” “mid-protocol,” “everyone needs [BAC water],” and cadence-based repurchase prompts. | Strong evidence of recurring personal-use behavior when combined with these products. | Retire. If ever replaced, use consented organization/procurement communications without inferred consumption cadence. | **Fixed:** functions return 410; scheduling call removed. |
| HIGH | Rewards/autoship/referrals and remaining emails | Points, “free product,” autoship, referral multipliers, product popularity, and repeat-purchase CTAs remain in account/transactional email code. | While not health claims alone, they preserve a consumer-retail impression and can amplify intended-use evidence. | Pause autoship and promotional reward emails; redesign around verified institutional purchasing accounts and procurement controls. | **Open.** Requires business-owner decision and coordinated data/UI change. |
| MEDIUM | Homepage/cards/cart/header/footer | “Featured,” bestseller, low-stock, “shop,” free-shipping progress and direct consumer retail cues. | Total impression looked like a direct-to-consumer supplement storefront. | Use catalog/procurement terminology, remove urgency and diluent upsells, keep ordering subject to qualification. | **Mostly fixed.** Ordinary pricing/cart/free-shipping language remains and should be reviewed with counsel/processor. |
| MEDIUM | `Quality`, `TestingCOAs`, `Methods`, `ChainOfCustody`, quality widgets | Claimed comprehensive methods, retention samples, ISO-certified/independent testing, sterility/endotoxin testing, and exact results without a verified evidence set. | Unsupported objective quality claims are FTC and contract/liability risks. | Replace with a neutral reading guide and lot-specific limitations until records substantiate exact claims. | **Fixed:** pages rewritten; metric/COA widgets deleted. |
| MEDIUM | `index.html`, `productSEO.ts`, sitemap, old routes | Consumer-oriented titles/keywords, stale learn/product URLs, and unconditional analytics. | Search snippets can themselves communicate intended use; stale pages remain discoverable; analytics collection must match disclosure/choice. | Neutral metadata, remove stale sitemap entries, redirect intentionally, load analytics only after choice. | **Fixed in source:** neutral metadata/schema/sitemap; explicit redirects; opt-in analytics component. Confirm behavior after deployment and search-engine recrawl. |
| MEDIUM | Privacy policy and tracking implementation | Generic policy did not accurately inventory Supabase, Stripe, payment apps, EasyPost/USPS, Resend, Google Places/Analytics, Vercel, local storage, accounts, forms, IP/device logs, referrals, and email tracking. | An inaccurate privacy notice creates consumer-protection and state-law risk. | Match actual processing; provide analytics choice; define retention and request workflow; review state thresholds and marketing law. | **Partial:** policy and analytics choice implemented. Retention schedule, Global Privacy Control, deletion workflow, vendor terms, state thresholds, and SMS consent remain for legal/ops review. |
| MEDIUM | Terms, Disclaimer, Shipping | Prior terms were incomplete; legal limits/dispute language and quality-document treatment needed precision. | Contract terms do not solve intended-use issues but should accurately allocate responsibilities and avoid deceptive absolutes. | Strengthen without claiming legality; have Florida/FD&C counsel review venue, warranty, liability, indemnity, returns, and entity identity. | **Drafted:** substantially rewritten Terms and Disclaimer. Counsel review required before publication. |
| MEDIUM | Shipping label/entity/payment copy | Code references `Level Up Health Solutions LLC DBA`; invoices direct Apple Cash/Zelle to an individual owner. | Entity, merchant-of-record, tax, processor, chargeback, recordkeeping, and consumer-payment disclosures may be inconsistent. | Confirm legal seller/DBA, bank/payee identity, invoices, tax treatment, processor permission, and refund workflow with counsel/accountant/processors. | **Open.** No operational/payment account changes made. |
| MEDIUM | Public order lookup and public form/email functions | Order lookup relies on combinations of order/contact data; public functions lack centralized throttling/CAPTCHA; email templates interpolate user input into HTML. | Enables enumeration, spam/cost abuse, and potentially email HTML injection. | Use authenticated magic links or single-use high-entropy tokens, rate limits/CAPTCHA, strict output encoding, request limits, and monitoring. | **Open.** |
| MEDIUM | Dependencies (`package.json`, lockfile) | Initial production audit reported 12 vulnerabilities (10 high, 1 moderate, 1 low). | Known vulnerable packages increase technical and privacy risk. | Apply non-breaking fixes; plan tested major upgrades for remaining advisories. | **Partial:** `npm audit fix` reduced production audit to 2 moderate advisories in React Router. Major v7 migration remains. |
| LOW | `robots.txt` and private routes | Checkout/account/admin/fulfillment routes were not comprehensively discouraged from indexing. | Robots rules are not access control, but indexing private workflow routes is undesirable. | Add disallow entries and preserve actual authentication. | **Fixed:** rules expanded. Admin authentication still must be tested. |
| PASS | Reviews/testimonials/UGC | No public review or testimonial UI/content was found. Dormant database enum values reference photo reviews/social posts. | No current outcome testimonial claim was located. | Keep review publishing disabled; moderate and legally review any future research review system. | **Pass with monitoring.** |
| PASS | Card-data handling in repository | Stripe Elements/provider architecture was used; no code storing raw PAN/CVC was found. | Reduces PCI exposure. | Continue using hosted tokenization; never log/store card data. | **Pass, subject to live configuration verification.** |
| PASS | Secret pattern scan | No hard-coded Stripe secret, Supabase service-role, Resend, EasyPost, or private key value was found. Browser-exposed Supabase anon/publishable and Stripe publishable keys are intentionally public but must be restricted appropriately. | Public keys are not secrets, but authorization must never depend on hiding them. | Verify Supabase RLS/function authorization, Stripe domain restrictions, Google API restrictions, and CI secret handling. | **Pass for scanned values; configuration review remains.** |

## Product-by-product disposition

All retained pages now use the same conservative pattern: material name and labeled amount, “Laboratory Reference Material,” current-lot documentation request, neutral storage controlled by lot documentation/protocol, and explicit no-human/no-veterinary language. No purity value or COA is asserted without evidence.

| Product ID | Disposition | Residual decision |
|---|---|---|
| `ghk-cu`, `ghk-cu-100` | Retained with neutral identity/procurement copy | Verify legal status, identity/specification, current lot records, label and supply chain. |
| `klow` | Retained and expanded coded name to GHK-Cu/BPC-157/TB-500/KPV Blend | Combination remains high scrutiny; counsel should decide whether it should be offered at all. |
| `igf1-lr3` | Retained with neutral copy | High-risk analyte; counsel/legal-status review required. |
| `semax`, `selank` | Retained with neutral copy | Counsel/legal-status and import/supply-chain review required. |
| `nad-plus-1000`, `glutathione` | Retained with neutral copy | Ensure classification, labeling, and lot documentation match the exact offered form. |
| `mots-c`, `mots-c-40` | Retained with neutral copy | Counsel/legal-status review required. |
| `tesamorelin` | Retained with neutral copy | Particularly sensitive because the active ingredient is associated with an approved drug; counsel review required. |
| `mt2`, `dsip` | Retained with neutral copy | High-risk intended-use/legal-status review required. |
| `wolverine-blend` | Retained under explicit BPC-157/TB-500 name | Marketing nickname remains a consumer signal; safest option is removal or full rename after counsel review. |
| `cjc-ipa-blend` | Retained with explicit component identity | High-risk combination; counsel should decide whether it should be offered. |
| `rp-200`, `rp-300` | Withheld | Do not use coded identity. |
| `bac-water-3ml`, `bac-water-10ml` | Withheld | Do not sell alongside the catalog absent attorney-approved lawful model. |
| `tirzepatide`, `retatrutide`, `kisspeptin`, `tesamorelin-2mg`, `pt-141`, `epithalon`, legacy `bpc-157`/`tb-500` | Explicitly discontinued/redirected | Do not restore based only on an RUO disclaimer. |

## Chatbot audit

- **Frontend:** former `src/components/ChatWidget.tsx`, mounted from `src/App.tsx`.
- **Backend:** `supabase/functions/chat/index.ts`.
- **Provider/model:** Lovable AI gateway, configured for `google/gemini-3-flash-preview`.
- **Production test:** returned HTTP 500, `LOVABLE_API_KEY is not configured`.
- **Data access:** hard-coded assistant prompt/catalog and user messages; no verified lot-document retrieval or customer-account tool was found.
- **Decision:** public assistant removed and backend retired with HTTP 410. No replacement is recommended until a controlled corpus, refusal suite, privacy/logging design, product-owner approval, and ongoing red-team process exist.

## Privacy/data-flow inventory

| System | Observed purpose/data |
|---|---|
| Vercel/Vite hosting | Page delivery and ordinary server/network logs. |
| Supabase | Authentication, profiles, addresses/contact details, orders, rewards/referrals/credits/subscriptions, tracking/email logs, Edge Functions. |
| Stripe | Hosted payment/tokenization and subscription code; card details should remain with Stripe. Card rails are default-off in the revised source. |
| Apple Cash/Zelle (manual invoice) | Owner-directed payment identifiers; legal seller and merchant-record review needed. |
| EasyPost/USPS | Address, shipment, label, tracking and delivery events. |
| Resend | Transactional and consented marketing emails plus delivery/open/click status where enabled. |
| Google Places | Address autocomplete and related device/request data at checkout. |
| Google Analytics | Now loaded only after explicit opt-in; anonymize-IP option enabled. |
| Google Fonts | Remote font request may expose IP/user agent; consider self-hosting. |
| qrserver.com | QR generation used in an admin fulfillment surface; avoid placing sensitive payloads in third-party QR URLs. |
| Browser local storage | Research gate, analytics choice, referral attribution, temporary pending-order recovery. |
| Chatbot | Retired; old provider request path no longer reachable from UI. |

## Before/after content register

This register covers every substantive copy family changed; mechanical import/route removal is listed separately below.

| Location(s) | Before | After |
|---|---|---|
| `Hero`, `Index`, static HTML metadata | “Research-grade peptides,” “high-purity,” and verified COA positioning | “Laboratory reference materials,” qualified organizations, request current lot records, no human/veterinary use. |
| `ProductCard`, `ProductCatalog`, `FeaturedPeptides`, `TrustBar`, `WhyVertex` | Bestsellers/featured/low stock, third-party tested, blanket COA claims | Catalog order, lot-record request, qualified procurement; featured component removed. |
| `products.ts`, `productSEO.ts` | Effects/research narratives, publications, universal purity/testing claims, consumer-search phrasing | Neutral identification/procurement copy; no effects, administration, purity result, or unverified citation. |
| Product detail | Mismatched downloadable COA, references, purity claim, low-stock cue | Lot-document request and limitations; no embedded report/reference or urgency. |
| Methods/storage | Reconstitution with bacteriostatic water, solution storage, asserted testing program | Neutral method-reading guide; storage controlled by lot records and institutional protocol; no preparation instructions. |
| Quality pages/widgets | Independent/ISO laboratory, exact purity, sterility/endotoxin, retention sample and comprehensive-program claims | Lot-specific record review, method limitations, purchaser receiving/traceability guidance; unsupported widgets removed. |
| Cart/checkout/gate | Individual eligibility, optional organization, BAC-water upsell, free-shipping progress urgency, general RUO checkbox | Authorized organization only, required organization, detailed prohibited uses, server-validated acknowledgment; diluent upsell/urgency removed. |
| Header/footer/announcement | Shop/Learn links and payment-app retail notice; categorical “no product is a drug” wording | Catalog/quality navigation, qualification notice, accurate “not offered as” positioning and limitations. |
| Learn library | Effects-oriented articles and SEO-linked product content | Entire library removed; old URLs redirect to neutral analytical-method guide. |
| Chat | Stale AI catalog, unsupported quality claims, unconstrained assistant | UI removed; endpoint returns 410. |
| Automated email | Reorder timing, “mid-protocol,” BAC requirement, restock/win-back language | Reorder/restock/win-back functions retired; new-material email limited to lot-document review. |
| Terms | Short/incomplete commercial terms | Eligibility, prohibited use, responsibilities, specs/documents, acceptance/payment, shipping/returns, IP, warranties, liability, indemnity, Florida disputes, severability, changes, contact; counsel flag included. |
| Privacy | Generic notice not aligned to implementation | Actual provider/data inventory, purposes, sharing, choices, security/retention caveats, state-rights conditional language and contact process. |
| Disclaimer | General RUO language | Clear informational scope, no medical relationship/advice, no administration guidance, literature/product distinction, lot-document limitations and purchaser responsibility. |
| Sitemap/robots/redirects | Stale consumer articles/products indexed; incomplete private-route exclusions | Only retained public pages/products; old content redirects; admin/account/checkout routes discouraged from indexing. |
| Analytics | Google Analytics executed on initial page load | No analytics request until explicit “Allow analytics”; decline path and Privacy link provided. |
| Payment/security messages | Card functions available when called; webhook signature optional; public email preview | Card/subscription functions default-off, signed webhook mandatory, public preview disabled, totals reconciled, admin mail/order actions authenticated. |

## Technical changes by file

**Added:** `src/components/AnalyticsConsent.tsx`; `supabase/migrations/20260903112156_harden_customer_data_rls.sql`; this audit; `EXTERNAL_COMPLIANCE_CHECKLIST.md`.

**Deleted/retired content:** `src/components/ChatWidget.tsx`, `FeaturedPeptides.tsx`, `QualityTransparency.tsx`, `ScientificMeters.tsx`, `PurityDial.tsx`, `src/data/articles.ts`, `src/pages/Learn.tsx`, `ArticlePage.tsx`, and tracked customer-export files under `migration/auth` and `migration/data` plus migration loader/manifest/sequence files.

**Public copy/navigation/data:** `.gitignore`, `index.html`, `public/robots.txt`, `public/sitemap.xml`, `vercel.json`, `src/App.tsx`, `AnnouncementBar.tsx`, `Footer.tsx`, `Header.tsx`, `Hero.tsx`, `InquiryCart.tsx`, `ProductCard.tsx`, `ProductCatalog.tsx`, `ResearchAccessGate.tsx`, `TrustBar.tsx`, `WhyVertex.tsx`, `ComplianceContext.tsx`, `categoryGroups.ts`, `productSEO.ts`, `products.ts`, `storageGuidance.ts`, and the `ChainOfCustody`, `Checkout`, `Disclaimer`, `Index`, `Methods`, `Privacy`, `ProductDetail`, `Quality`, `Terms`, and `TestingCOAs` pages.

**Backend/email/security:** `src/lib/finalizeOrder.ts`, `src/lib/resend.ts`, `supabase/config.toml`, and functions `admin-create-manual-order`, `award-points`, `chat`, `create-payment-intent`, `create-subscription-checkout`, `send-new-compound-announcement`, `send-reorder-nurture`, `send-restock-reminder`, `send-winback-blast`, `send-winback-followup`, `stripe-subscription-webhook`, and `submit-order-request`.

**Dependency remediation:** `package-lock.json` (non-breaking audit fixes). Existing user edits in `Fulfillment.tsx`, `admin/CashOrder.tsx`, and `update-customer-phone` were preserved and are not compliance-sweep changes.

## Remaining red-team answers

If every RUO disclaimer were ignored, evidence still capable of suggesting consumer personal use includes: direct online prices/cart/checkout, small vial quantities, loyalty points/referrals, autoship/subscription code, free-shipping promotion, manual consumer payment apps, “Wolverine” branding, high-risk ingredients commonly marketed to consumers, delivery/reward emails, individual shipping addresses, and lack of independent business/institution credential verification. These are not all unlawful by themselves, but their combination remains material.

- **FDA investigator:** active-ingredient selection and small-vial direct shipping remain the principal intended-use risk. Exact labeling, customer qualification records, communications, search ads, fulfillment patterns, and external content matter as much as website copy.
- **FTC investigator:** positive purity/testing/specification claims must remain unpublished until the exact evidence file supports the exact lot and wording. Affiliates and emails are part of the same advertising program.
- **Payment processor:** merchant descriptor, legal entity, product category, manual peer-to-peer rails, card/subscription code, fulfillment/refund evidence, and prohibited-business policies require written approval.
- **Plaintiff's attorney:** product identity, chain of custody, warnings, foreseeable misuse, inconsistent entity names, incomplete quality evidence, email HTML injection, weak public endpoints, and data retention are continuing exposure points.

## Required attorney and owner review before publication

1. Whether each retained material may lawfully be offered under the actual sourcing, labeling, import, storage, customer, and distribution facts—not merely the website wording.
2. FDA intended-use analysis of the entire operation, including labels, packaging, invoices, customer communications, search ads, fulfillment patterns, customer screening, and affiliates.
3. Whether to remove the KLOW, Wolverine, CJC/Ipamorelin, Tesamorelin, IGF-1 LR3, MT-II, MOTS-C, DSIP, Semax, and Selank listings pending a product-specific opinion.
4. Terms: seller identity, Florida venue/law, warranty disclaimers, liability cap, indemnity, returns, order rejection, and enforceable assent.
5. Privacy: applicable state thresholds, retention schedule, marketing/email/SMS consent, GPC/opt-out, processor contracts, request verification, incident response, and whether past tracking requires remediation.
6. Trademark/brand/product names, particularly “Wolverine,” and accuracy of every label/specification.
7. Merchant-of-record, DBA, Apple Cash/Zelle use, taxes, sanctions/export controls, shipping restrictions, and processor/network permission.
8. Customer-data incident assessment and coordinated Git-history purge; do not rewrite shared history without a clone/backup/notification plan.

## Verification performed

- Baseline and final `npm test`: **2 files / 4 tests passed**.
- Repeated production `npm run build`: **passed**; removed COA/article assets no longer appear in the final bundle and the final JavaScript chunks stayed below Vite's 500 kB warning threshold.
- `npm run lint`: **failed on the repository's existing lint debt** (88 errors and 17 warnings, predominantly `no-explicit-any` in Edge Functions and fulfillment/tracking code, plus hook/fast-refresh warnings). No new build-blocking type error was reported, but lint cleanup remains required.
- `git diff --check`: **passed**.
- Secret-pattern scan: no private key or known server-secret value found; environment-variable names are expected.
- Production dependency audit after non-breaking fixes: **0 critical, 0 high, 2 moderate**. Remaining React Router advisories require a breaking major upgrade and regression testing.
- Local Vite HTTP smoke test: **200 OK** and expected static metadata returned.
- Browser visual verification: **not completed**. The required `agent-browser` executable and the in-app browser control surface were unavailable; no screenshot is claimed.
- Edge Function `deno check`: **not completed** because Deno is unavailable in this workspace; deployed-function integration testing remains required.
- Supabase migration generated locally with CLI but **not applied**. Edge Functions were **not deployed**.

## Internal risk-reduction score

**Working-tree score: 72/100.** This is an internal engineering/marketing risk-reduction score, **not a legal conclusion**. It reflects substantial removal of contradictory content and stronger fail-closed controls, offset by the inherently sensitive catalog, consumer-commerce mechanics, unresolved quality evidence, public-endpoint hardening work, external-channel unknowns, customer-data history exposure, unreviewed legal text, and zero production deployment.

**Current production posture remains materially lower until an approved release is deployed and verified.** No production score is asserted without a fresh live-site, DNS/cache, function-config, database-policy, advertising, and external-channel audit.
