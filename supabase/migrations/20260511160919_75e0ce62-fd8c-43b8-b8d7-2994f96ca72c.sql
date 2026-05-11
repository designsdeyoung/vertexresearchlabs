UPDATE public.profiles
SET points_balance = points_balance + 5768,
    lifetime_points = lifetime_points + 5768,
    referred_by = COALESCE(referred_by, NULL)
WHERE id = '9509d218-09c0-4d67-9615-ffa93ff478e9';

UPDATE public.profiles
SET referred_by = '9509d218-09c0-4d67-9615-ffa93ff478e9'
WHERE id = 'bf3b3514-74d0-4995-afbf-566cb08f4a77' AND referred_by IS NULL;