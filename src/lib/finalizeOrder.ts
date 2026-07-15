import { supabase } from "@/integrations/supabase/client";
import { scheduleRestockReminder, subscribeEmail } from "./resend";
import { trackPurchase } from "./analytics";

const RESTOCK_REMINDER_DAYS = 14;

export const PENDING_ORDER_KEY = "vrl_pending_order";

export interface PendingOrderItem {
  productId: string;
  productName: string;
  size: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface PendingOrderCustomer {
  fullName: string;
  email: string;
  phoneNumber: string;
  organization?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  notes?: string;
}

export interface PendingOrder {
  paymentIntentId: string;
  customer: PendingOrderCustomer;
  eligibilityType: string | null;
  items: PendingOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  creditApplied: number;
  creditId: string | null;
  referrerCode: string | null;
  referrerProfileId: string | null;
  discountCode: string | null;
  discountAmount: number;
  paymentMethod: string;
  pointsEarnedFallback: number;
  /** Customer opted in to updates/new-release emails at checkout. */
  marketingConsent?: boolean;
}

export interface FinalizeResult {
  orderNumber: string | null;
  pointsEarned: number;
  creditApplied: number;
  total: number;
  referralCode: string | null;
  paymentMethod: string;
  alreadyProcessed: boolean;
}

export async function finalizeOrder(pending: PendingOrder): Promise<FinalizeResult> {
  const { data: awardData, error: awardError } = await supabase.functions.invoke("award-points", {
    body: {
      customerEmail: pending.customer.email,
      customerName: pending.customer.fullName,
      items: pending.items,
      subtotal: pending.subtotal,
      shipping: pending.shipping,
      total: pending.total,
      creditApplied: pending.creditApplied,
      creditId: pending.creditId,
      referrerCode: pending.referrerCode,
      referrerProfileId: pending.referrerProfileId,
      shippingAddress: {
        name: pending.customer.fullName,
        address1: pending.customer.addressLine1,
        address2: pending.customer.addressLine2,
        city: pending.customer.city,
        state: pending.customer.state,
        zip: pending.customer.zipCode,
      },
      discountCode: pending.discountCode,
      discountAmount: pending.discountAmount,
      paymentMethod: pending.paymentMethod,
      stripePaymentIntentId: pending.paymentIntentId,
    },
  });

  if (awardError) {
    console.error("finalizeOrder: award-points error", awardError);
    throw awardError;
  }

  const alreadyProcessed = !!awardData?.alreadyProcessed;
  const orderNumber: string | null = awardData?.orderNumber || null;
  const pointsEarned: number = awardData?.pointsEarned ?? pending.pointsEarnedFallback;
  const referralCode: string | null = awardData?.referralCode || null;

  if (!alreadyProcessed) {
    const { error: emailError } = await supabase.functions.invoke("send-order-confirmation", {
      body: {
        customer: pending.customer,
        eligibilityType: pending.eligibilityType,
        items: pending.items,
        subtotal: pending.subtotal,
        shipping: pending.shipping,
        total: pending.total,
        orderNumber,
        pointsEarned,
        referralCode,
        isNewAccount: awardData?.accountCreated || false,
        discountAmount: pending.discountAmount,
        discountCode: pending.discountCode,
        paymentMethod: pending.paymentMethod,
      },
    });
    if (emailError) {
      console.error("finalizeOrder: send-order-confirmation error", emailError);
    }

    // GA4 purchase event — fired once per order (guarded by !alreadyProcessed
    // so a page refresh on the confirmation screen can't double-count).
    trackPurchase({
      transactionId: orderNumber ?? pending.paymentIntentId,
      value: pending.total,
      shipping: pending.shipping,
      coupon: pending.discountCode ?? undefined,
      items: pending.items.map((i) => ({
        item_id: i.productId,
        item_name: `${i.productName} ${i.size}`.trim(),
        price: i.price,
        quantity: i.quantity,
      })),
    });

    // Retention: schedule the day-14 reorder reminder (fire-and-forget).
    try {
      const scheduledAt = new Date(
        Date.now() + RESTOCK_REMINDER_DAYS * 24 * 60 * 60 * 1000,
      ).toISOString();
      void scheduleRestockReminder({
        email: pending.customer.email,
        fullName: pending.customer.fullName,
        items: pending.items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          size: i.size,
        })),
        orderNumber: orderNumber ?? undefined,
        scheduledAt,
      });
    } catch (e) {
      console.error("finalizeOrder: restock reminder scheduling failed", e);
    }

    // If the customer opted in at checkout, add them to the updates audience.
    // (Order confirmation is transactional and already sent above regardless.)
    if (pending.marketingConsent) {
      void subscribeEmail(pending.customer.email, { sendWelcome: false, source: "checkout-consent" });
    }
  }

  return {
    orderNumber,
    pointsEarned,
    creditApplied: pending.creditApplied,
    total: pending.total,
    referralCode,
    paymentMethod: pending.paymentMethod,
    alreadyProcessed,
  };
}
