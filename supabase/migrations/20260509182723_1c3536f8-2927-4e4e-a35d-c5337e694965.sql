-- Harden client-side access to rewards records. The backend functions use elevated access.
DROP POLICY IF EXISTS "Users can insert their own credits" ON public.credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON public.credits;
DROP POLICY IF EXISTS "System can insert transactions" ON public.points_transactions;

-- Atomic rewards redemption: no partial credit creation, no partial balance update.
CREATE OR REPLACE FUNCTION public.redeem_reward_credit(
  _user_id uuid,
  _points integer
)
RETURNS TABLE (
  credit_id uuid,
  credit_amount numeric,
  credit_points_cost integer,
  credit_min_cart numeric,
  credit_max_percent numeric,
  new_points_balance integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _profile public.profiles%ROWTYPE;
  _tier_credit numeric;
  _tier_min_cart numeric;
  _tier_max_percent numeric;
  _credit public.credits%ROWTYPE;
BEGIN
  SELECT tier.credit, tier.min_cart, tier.max_percent
    INTO _tier_credit, _tier_min_cart, _tier_max_percent
  FROM (VALUES
    (500, 20::numeric, 100::numeric, 100::numeric),
    (750, 30::numeric, 120::numeric, 100::numeric),
    (1000, 40::numeric, 150::numeric, 100::numeric),
    (1500, 65::numeric, 200::numeric, 100::numeric),
    (2000, 90::numeric, 250::numeric, 100::numeric),
    (3000, 140::numeric, 350::numeric, 100::numeric),
    (5000, 250::numeric, 500::numeric, 100::numeric)
  ) AS tier(points, credit, min_cart, max_percent)
  WHERE tier.points = _points;

  IF _tier_credit IS NULL THEN
    RAISE EXCEPTION 'Invalid reward tier' USING ERRCODE = 'P0001';
  END IF;

  SELECT * INTO _profile
  FROM public.profiles
  WHERE user_id = _user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found' USING ERRCODE = 'P0001';
  END IF;

  IF _profile.points_balance < _points THEN
    RAISE EXCEPTION 'Not enough points' USING ERRCODE = 'P0001';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.credits
    WHERE profile_id = _profile.id
      AND status = 'active'
      AND expires_at > now()
  ) THEN
    RAISE EXCEPTION 'An unused credit already exists' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.credits (
    profile_id,
    amount,
    points_cost,
    min_cart,
    max_percent,
    status
  ) VALUES (
    _profile.id,
    _tier_credit,
    _points,
    _tier_min_cart,
    _tier_max_percent,
    'active'
  )
  RETURNING * INTO _credit;

  INSERT INTO public.points_transactions (
    profile_id,
    amount,
    type,
    description,
    order_reference
  ) VALUES (
    _profile.id,
    -_points,
    'redemption',
    'Redeemed $' || _tier_credit::text || ' Vertex Credit',
    _credit.id::text
  );

  UPDATE public.profiles
  SET points_balance = points_balance - _points
  WHERE id = _profile.id
  RETURNING points_balance INTO new_points_balance;

  credit_id := _credit.id;
  credit_amount := _credit.amount;
  credit_points_cost := _credit.points_cost;
  credit_min_cart := _credit.min_cart;
  credit_max_percent := _credit.max_percent;

  RETURN NEXT;
END;
$$;

REVOKE ALL ON FUNCTION public.redeem_reward_credit(uuid, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.redeem_reward_credit(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_reward_credit(uuid, integer) TO service_role;