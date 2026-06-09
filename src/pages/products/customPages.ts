import type { ComponentType } from "react";
import type { Product } from "@/data/products";
import type { ProductSEOData } from "@/data/productSEO";
import WolverineProduct from "./WolverineProduct";

export interface BespokeProductPageProps {
  product: Product;
  seo?: ProductSEOData;
}

/**
 * Registry of fully bespoke product pages, keyed by product id.
 * When a product id is present here, ProductDetail renders this component
 * instead of the shared template. Products not listed fall back to the
 * default template automatically. Add one entry per product as its custom
 * page is built.
 */
export const customProductPages: Record<string, ComponentType<BespokeProductPageProps>> = {
  "wolverine-blend": WolverineProduct,
};
