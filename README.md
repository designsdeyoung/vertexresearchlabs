# Vertex Research Labs

E-commerce storefront for research-grade peptides and analytical reference materials.

## Stack

- **Frontend:** Vite + React 18 + TypeScript, React Router v6
- **Styling:** Tailwind CSS + shadcn/ui, lucide-react icons
- **Backend:** Supabase (Postgres + Auth + Edge Functions on Deno)
- **Payments:** Stripe (PaymentIntents + subscriptions)
- **Email:** Resend (transactional + audience), via Edge Functions
- **Hosting:** Vercel (SPA) — frontend auto-deploys on push to `main`

## Local development

```bash
npm install
npm run dev      # Vite dev server on http://localhost:8080
npm run build    # production build
npm run lint     # eslint
npm test         # vitest
```

Copy `.env.example` to `.env` and fill in the `VITE_*` values. Server-side
secrets (Resend, Stripe, Supabase service role) live in Supabase Edge Function
secrets, not in `.env`.

## Project layout

```
src/
  pages/            route components (Index, ProductDetail, Checkout, …)
  pages/products/   bespoke per-product page system (_kit + bespokeConfigs)
  components/       UI + sections (Header, Footer, EmailCapturePopup, …)
  data/             product catalog + per-product SEO data
  lib/              order finalize, Resend client helpers
  contexts/         cart, auth, compliance providers
supabase/functions/ Deno Edge Functions (orders, email, discounts, chat)
```

## Deployment

- **Frontend:** push to `main` → Vercel builds and deploys automatically.
- **Edge Functions:** deploy separately and explicitly to the live project:

  ```bash
  supabase functions deploy <name> --project-ref qgritvsluilqptgtvayv --no-verify-jwt
  ```

  (`supabase/config.toml` may carry a stale `project_id` — always pass
  `--project-ref` for the project the client actually calls.)
