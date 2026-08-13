import { describe, expect, it } from "vitest";
import {
  calculateNadTreatDiscount,
  calculatePercentageDiscount,
  NAD_TREAT_PRODUCT_ID,
} from "./discounts";

describe("NADTREAT", () => {
  it("reduces each NAD+ 1000mg unit from $150 to $120", () => {
    expect(calculateNadTreatDiscount([
      { productId: NAD_TREAT_PRODUCT_ID, unitPrice: 150, quantity: 2 },
    ])).toBe(60);
  });

  it("does not discount other products", () => {
    expect(calculateNadTreatDiscount([
      { productId: "nad-plus-500", unitPrice: 80, quantity: 1 },
      { productId: "retatrutide", unitPrice: 98, quantity: 1 },
    ])).toBe(0);
  });

  it("stacks a customer percentage code after the NAD+ price adjustment", () => {
    const productDiscount = calculateNadTreatDiscount([
      { productId: NAD_TREAT_PRODUCT_ID, unitPrice: 150, quantity: 1 },
    ]);
    expect(calculatePercentageDiscount(150, productDiscount, 0.1)).toBe(12);
  });
});

