import { describe, expect, it } from "vitest";
import {
  calculateRp20020mgPairDiscount,
  RP200_20MG_PRODUCT_ID,
} from "./cashOrderPricing";

describe("RP-200 20mg cash-order pricing", () => {
  it("prices two vials at $300", () => {
    expect(calculateRp20020mgPairDiscount([
      { productId: RP200_20MG_PRODUCT_ID, quantity: 2 },
    ])).toBe(20);
  });

  it("only discounts complete pairs", () => {
    expect(calculateRp20020mgPairDiscount([
      { productId: RP200_20MG_PRODUCT_ID, quantity: 3 },
    ])).toBe(20);
    expect(calculateRp20020mgPairDiscount([
      { productId: RP200_20MG_PRODUCT_ID, quantity: 4 },
    ])).toBe(40);
  });

  it("combines the same product across separate rows", () => {
    expect(calculateRp20020mgPairDiscount([
      { productId: RP200_20MG_PRODUCT_ID, quantity: 1 },
      { productId: RP200_20MG_PRODUCT_ID, quantity: 1 },
    ])).toBe(20);
  });

  it("does not discount other products", () => {
    expect(calculateRp20020mgPairDiscount([
      { productId: "rp-200", quantity: 2 },
    ])).toBe(0);
  });
});
