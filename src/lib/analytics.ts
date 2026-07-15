/**
 * GA4 e-commerce analytics helpers.
 *
 * The gtag base snippet (property G-YY1Q0F0ZCQ) is loaded in index.html, but
 * because this is a client-routed SPA, GA4 only ever saw the initial page load
 * and none of the standard e-commerce events. These helpers add SPA page_view
 * tracking on route change plus the four core funnel events (view_item,
 * add_to_cart, begin_checkout, purchase).
 *
 * Every call is a no-op when gtag is unavailable (blocked, consent-gated, SSR),
 * so instrumentation can never break the UI.
 */
import type { Product } from "@/data/products";

type GtagArgs = [string, string, Record<string, unknown>?];

declare global {
  interface Window {
    gtag?: (...args: GtagArgs) => void;
    dataLayer?: unknown[];
  }
}

const CURRENCY = "USD";

function gtag(...args: GtagArgs): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag(...args);
  } catch {
    /* analytics must never throw into the render path */
  }
}

/** Fire a GA4 page_view for the current SPA location. */
export function trackPageView(path: string, title?: string): void {
  gtag("event", "page_view", {
    page_path: path,
    page_location: typeof window !== "undefined" ? window.location.href : path,
    page_title: title ?? (typeof document !== "undefined" ? document.title : undefined),
  });
}

/** Map a catalog Product into a GA4 `items[]` entry. */
function toItem(product: Product, quantity = 1, price?: number) {
  return {
    item_id: product.id,
    item_name: `${product.name} ${product.size}`.trim(),
    item_brand: "Vertex Research Labs",
    item_category: product.category,
    price: Number((price ?? product.price).toFixed(2)),
    quantity,
  };
}

export function trackViewItem(product: Product, price?: number): void {
  gtag("event", "view_item", {
    currency: CURRENCY,
    value: Number((price ?? product.price).toFixed(2)),
    items: [toItem(product, 1, price)],
  });
}

export function trackAddToCart(
  product: Product,
  opts: { quantity?: number; unitPrice?: number } = {},
): void {
  const quantity = opts.quantity ?? 1;
  const unit = opts.unitPrice ?? product.price;
  gtag("event", "add_to_cart", {
    currency: CURRENCY,
    value: Number((unit * quantity).toFixed(2)),
    items: [toItem(product, quantity, unit)],
  });
}

export interface AnalyticsLine {
  product: Product;
  quantity: number;
  unitPrice: number;
}

export function trackBeginCheckout(lines: AnalyticsLine[], value: number): void {
  gtag("event", "begin_checkout", {
    currency: CURRENCY,
    value: Number(value.toFixed(2)),
    items: lines.map((l) => toItem(l.product, l.quantity, l.unitPrice)),
  });
}

export interface PurchaseItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
  quantity: number;
}

export function trackPurchase(params: {
  transactionId: string;
  value: number;
  shipping?: number;
  tax?: number;
  coupon?: string;
  items: PurchaseItem[];
}): void {
  gtag("event", "purchase", {
    transaction_id: params.transactionId,
    currency: CURRENCY,
    value: Number(params.value.toFixed(2)),
    shipping: params.shipping != null ? Number(params.shipping.toFixed(2)) : undefined,
    tax: params.tax != null ? Number(params.tax.toFixed(2)) : undefined,
    coupon: params.coupon,
    items: params.items.map((i) => ({
      item_id: i.item_id,
      item_name: i.item_name,
      item_brand: "Vertex Research Labs",
      item_category: i.item_category,
      price: Number(i.price.toFixed(2)),
      quantity: i.quantity,
    })),
  });
}
