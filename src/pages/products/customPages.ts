import type { ComponentType } from "react";
import type { Product } from "@/data/products";
import type { ProductSEOData } from "@/data/productSEO";
import { makeBespokePage } from "./_kit";
import { bespokeConfigs } from "./bespokeConfigs";

export interface BespokeProductPageProps {
  product: Product;
  seo?: ProductSEOData;
}

/**
 * Registry of fully bespoke product pages, keyed by product id. ProductDetail
 * renders the registered component instead of the shared template. Pages are
 * generated from per-product configs in bespokeConfigs.tsx; to make a single
 * product diverge entirely, replace its entry here with a hand-built component.
 */
export const customProductPages: Record<string, ComponentType<BespokeProductPageProps>> =
  Object.fromEntries(
    Object.entries(bespokeConfigs).map(([id, config]) => [id, makeBespokePage(config)]),
  );
