-- Add per-influencer referral points multiplier.
-- Default NULL means the function falls back to its hardcoded 3× rate.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS referral_points_multiplier INTEGER DEFAULT NULL;

-- Alex Bonnemaiso (ALEX10) earns 5× points per $1 his referrals spend.
UPDATE profiles
  SET referral_points_multiplier = 5
  WHERE referral_code = 'ALEX10';
