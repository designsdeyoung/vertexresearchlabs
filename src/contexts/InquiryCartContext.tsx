import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";
import type { Product } from "@/data/products";
import { SITEWIDE_SALE } from "@/config/sale";

export const FREE_SHIPPING_THRESHOLD = 99;
export const FLAT_RATE_SHIPPING = 9.99;

export const THREE_PACK_DISCOUNT = 0.10; // 10% off
export const AUTOSHIP_DISCOUNT = 0.10; // 10% off Subscribe & Save
export const AUTOSHIP_INTERVAL_DAYS = 30;

export interface CartItem {
  product: Product;
  quantity: number;
  is3Pack?: boolean;
  isAutoship?: boolean;
}

interface InquiryCartContextType {
  items: CartItem[];
  addItem: (product: Product, opts?: { isAutoship?: boolean }) => void;
  add3Pack: (product: Product, opts?: { isAutoship?: boolean }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
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

  const add3Pack = useCallback((product: Product, opts?: { isAutoship?: boolean }) => {
    const isAutoship = !!opts?.isAutoship;
    setItems((prev) => {
      // Remove single items of same product with the same autoship flag, then add/merge 3-pack
      const filtered = prev.filter(
        (item) => !(item.product.id === product.id && !item.is3Pack && !!item.isAutoship === isAutoship)
      );
      const existing3Pack = prev.find(
        (item) => item.product.id === product.id && item.is3Pack && !!item.isAutoship === isAutoship
      );
      if (existing3Pack) {
        return prev.map((item) =>
          item.product.id === product.id && item.is3Pack && !!item.isAutoship === isAutoship
            ? { ...item, quantity: item.quantity + 3 }
            : item
        );
      }
      return [...filtered, { product, quantity: 3, is3Pack: true, isAutoship }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      setItems((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
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
