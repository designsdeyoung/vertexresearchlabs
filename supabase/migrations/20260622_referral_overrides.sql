-- Special multi-referrer exceptions (admin-approved only)
CREATE TABLE IF NOT EXISTS referral_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email TEXT NOT NULL,           -- matched at order time before profile exists
  customer_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referrer_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  multiplier INT NOT NULL DEFAULT 3,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_email, referrer_profile_id)
);

-- Gaylee shared between Lauryn + Eddie (both get 3x per $1 she spends)
INSERT INTO referral_overrides (customer_email, referrer_profile_id, multiplier, note) VALUES
  ('gayleelock1954@gmail.com', '3f109798-80a2-40d8-9563-14a66f07205b', 3, 'Lauryn McCleary — Gaylees niece, admin approved'),
  ('gayleelock1954@gmail.com', '6b121396-60d1-49ba-867c-2166aeb0b367', 3, 'Eddie McCleary — Gaylees nephew, admin approved');
