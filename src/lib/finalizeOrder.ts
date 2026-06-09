import { supabase } from "@/integrations/supabase/client";
import { scheduleRestockReminder, subscribeEmail } from "./resend";

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
