import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";
import type { Product } from "@/data/products";
import { SITEWIDE_SALE } from "@/config/sale";
import { trackAddToCart } from "@/lib/analytics";

export const FREE_SHIPPING_THRESHOLD = 99;
export const FLAT_RATE_SHIPPING = 9.99;

export const THREE_PACK_DISCOUNT = 0.10; // 10% off
export const AUTOSHIP_DISCOUNT = 0.10; // 10% off Subscribe & Save
export const AUTOSHIP_INTERVAL_DAYS = 30;
export const THREE_PACK_AUTOSHIP_INTERVAL_DAYS = 90;

export interface CartItem {
  product: Product;
  quantity: number;
  is3Pack?: boolean;
  isAutoship?: boolean;
  /** Autoship cadence in days. Defaults to 30 for singles, 90 for 3-Packs when omitted. */
  intervalDays?: number;
}

interface InquiryCartContextType {
  items: CartItem[];
  addItem: (product: Product, opts?: { isAutoship?: boolean }) => void;
  add3Pack: (product: Product, opts?: { isAutoship?: boolean; intervalDays?: number }) => void;
  removeItem: (lineKey: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  qualifiesForFreeShipping: boolean;
  amountToFreeShipping: number;
  hasAutoship: boolean;
}

const InquiryCartContext = createContext<InquiryCartContextType | undefined>(undefined);

// Stable per-line identity. The same product can appear as distinct lines
// (single vs 3-Pack vs autoship vs different autoship cadence), so we cannot
// key/target a line by product.id alone.
export const lineKey = (
  item: Pick<CartItem, "product" | "is3Pack" | "isAutoship" | "intervalDays">
): string =>
  `${item.product.id}|${item.is3Pack ? "3" : "1"}|${item.isAutoship ? "a" : "o"}|${item.intervalDays ?? ""}`;

// Compute the effective unit price for a cart line (post-discounts, pre-quantity)
export const computeUnitPrice = (item: CartItem): number => {
  let unit = item.product.price;
  if (SITEWIDE_SALE.active) unit *= 1 - SITEWIDE_SALE.discount;
  if (item.is3Pack) unit *= 1 - THREE_PACK_DISCOUNT;
  if (item.isAutoship) unit *= 1 - AUTOSHIP_DISCOUNT;
  return unit;
};

export const InquiryCartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: Product, opts?: { isAutoship?: boolean }) => {
    const isAutoship = !!opts?.isAutoship;
    let unit = product.price;
    if (SITEWIDE_SALE.active) unit *= 1 - SITEWIDE_SALE.discount;
    if (isAutoship) unit *= 1 - AUTOSHIP_DISCOUNT;
    trackAddToCart(product, { quantity: 1, unitPrice: unit });
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && !item.is3Pack && !!item.isAutoship === isAutoship
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && !item.is3Pack && !!item.isAutoship === isAutoship
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, isAutoship }];
    });
  }, []);

  const add3Pack = useCallback((product: Product, opts?: { isAutoship?: boolean; intervalDays?: number }) => {
    const isAutoship = !!opts?.isAutoship;
    const intervalDays = isAutoship
      ? (opts?.intervalDays ?? THREE_PACK_AUTOSHIP_INTERVAL_DAYS)
      : undefined;
    let unit = product.price;
    if (SITEWIDE_SALE.active) unit *= 1 - SITEWIDE_SALE.discount;
    unit *= 1 - THREE_PACK_DISCOUNT;
    if (isAutoship) unit *= 1 - AUTOSHIP_DISCOUNT;
    trackAddToCart(product, { quantity: 3, unitPrice: unit });
    setItems((prev) => {
      // Remove single items of same product with the same autoship flag, then add/merge 3-pack
      const filtered = prev.filter(
        (item) => !(item.product.id === product.id && !item.is3Pack && !!item.isAutoship === isAutoship)
      );
      const existing3Pack = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.is3Pack &&
          !!item.isAutoship === isAutoship &&
          (item.intervalDays ?? undefined) === intervalDays
      );
      if (existing3Pack) {
        return prev.map((item) =>
          item === existing3Pack ? { ...item, quantity: item.quantity + 3 } : item
        );
      }
      return [...filtered, { product, quantity: 3, is3Pack: true, isAutoship, intervalDays }];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((item) => lineKey(item) !== key));
  }, []);

  const updateQuantity = useCallback(
    (key: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(key);
        return;
      }
      setItems((prev) =>
        prev.map((item) => (lineKey(item) === key ? { ...item, quantity } : item))
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + computeUnitPrice(item) * item.quantity, 0),
    [items]
  );

  const hasAutoship = items.some((i) => i.isAutoship);

  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountToFreeShipping = qualifiesForFreeShipping ? 0 : FREE_SHIPPING_THRESHOLD - subtotal;
  const shippingCost = qualifiesForFreeShipping ? 0 : FLAT_RATE_SHIPPING;
  const total = subtotal + shippingCost;

  return (
    <InquiryCartContext.Provider
      value={{
        items,
        addItem,
        add3Pack,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        itemCount,
        subtotal,
        shippingCost,
        total,
        qualifiesForFreeShipping,
        amountToFreeShipping,
        hasAutoship,
      }}
    >
      {children}
    </InquiryCartContext.Provider>
  );
};

export const useInquiryCart = () => {
  const context = useContext(InquiryCartContext);
  if (!context) {
    throw new Error("useInquiryCart must be used within InquiryCartProvider");
  }
  return context;
};
