import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";
import type { Product } from "@/data/products";
import { SITEWIDE_SALE } from "@/config/sale";

export const FREE_SHIPPING_THRESHOLD = 99;
export const FLAT_RATE_SHIPPING = 9.99;

export interface CartItem {
  product: Product;
  quantity: number;
}

interface InquiryCartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
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
}

const InquiryCartContext = createContext<InquiryCartContextType | undefined>(undefined);

// Stable per-line identity. One line per product.
export const lineKey = (item: Pick<CartItem, "product">): string => item.product.id;

// Compute the effective unit price for a cart line (post-discounts, pre-quantity)
export const computeUnitPrice = (item: CartItem): number => {
  let unit = item.product.price;
  if (SITEWIDE_SALE.active) unit *= 1 - SITEWIDE_SALE.discount;
  return unit;
};

export const InquiryCartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
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

  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountToFreeShipping = qualifiesForFreeShipping ? 0 : FREE_SHIPPING_THRESHOLD - subtotal;
  const shippingCost = qualifiesForFreeShipping ? 0 : FLAT_RATE_SHIPPING;
  const total = subtotal + shippingCost;

  return (
    <InquiryCartContext.Provider
      value={{
        items,
        addItem,
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
