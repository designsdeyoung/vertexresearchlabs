export const RP200_20MG_PRODUCT_ID = "rp-200-20mg";
export const RP200_20MG_UNIT_PRICE = 160;
export const RP200_20MG_PAIR_PRICE = 300;
export const RP200_20MG_PAIR_CODE = "RP200-20MG-2FOR300";

interface CashOrderItem {
  productId: string;
  quantity: number;
}

/** $20 off each complete pair of RP-200 20mg vials ($300 per pair). */
export const calculateRp20020mgPairDiscount = (items: CashOrderItem[]): number => {
  const quantity = items.reduce(
    (sum, item) =>
      item.productId === RP200_20MG_PRODUCT_ID
        ? sum + Math.max(0, Math.floor(item.quantity))
        : sum,
    0,
  );
  const discountPerPair = RP200_20MG_UNIT_PRICE * 2 - RP200_20MG_PAIR_PRICE;
  return Math.floor(quantity / 2) * discountPerPair;
};
