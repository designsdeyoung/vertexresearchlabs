export const NAD_TREAT_CODE = "NADTREAT";
export const NAD_TREAT_PRODUCT_ID = "nad-plus-1000";
export const NAD_TREAT_UNIT_PRICE = 120;

export interface DiscountableItem {
  productId: string;
  unitPrice: number;
  quantity: number;
}

const toCents = (amount: number) => Math.round(amount * 100);

export const calculateNadTreatDiscount = (items: DiscountableItem[]): number => {
  const discountCents = items.reduce((sum, item) => {
    if (item.productId !== NAD_TREAT_PRODUCT_ID || item.quantity <= 0) return sum;
    const unitDiscountCents = Math.max(0, toCents(item.unitPrice) - toCents(NAD_TREAT_UNIT_PRICE));
    return sum + unitDiscountCents * item.quantity;
  }, 0);

  return discountCents / 100;
};

export const calculatePercentageDiscount = (
  subtotal: number,
  productDiscount: number,
  rate: number,
): number => Math.round(Math.max(0, subtotal - productDiscount) * rate * 100) / 100;

