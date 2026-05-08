UPDATE public.orders
SET status = 'confirmed',
    payment_method = 'stripe',
    stripe_payment_intent_id = 'pi_3TUVF3C1sO3DYmPX00b5LE67',
    paid_at = now()
WHERE order_number = 'VRL-100026';