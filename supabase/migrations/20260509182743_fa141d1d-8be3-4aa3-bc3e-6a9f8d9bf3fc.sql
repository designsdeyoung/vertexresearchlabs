REVOKE ALL ON FUNCTION public.redeem_reward_credit(uuid, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.redeem_reward_credit(uuid, integer) FROM anon;
REVOKE ALL ON FUNCTION public.redeem_reward_credit(uuid, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_reward_credit(uuid, integer) TO service_role;