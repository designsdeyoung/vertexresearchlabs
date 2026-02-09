
-- Replace the generate_referral_code function with NAME10 logic
CREATE OR REPLACE FUNCTION public.generate_referral_code()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  first_name text;
  base_code text;
  candidate text;
  suffix int := 0;
BEGIN
  -- Extract first name from full_name
  first_name := trim(split_part(COALESCE(NEW.full_name, ''), ' ', 1));
  
  -- If no name, fallback to VX-XXXXXX
  IF first_name = '' OR first_name IS NULL THEN
    NEW.referral_code := 'VX-' || upper(substr(md5(random()::text), 1, 6));
    RETURN NEW;
  END IF;
  
  -- Build base code: UPPERNAME10
  base_code := upper(first_name) || '10';
  candidate := base_code;
  
  -- Check for duplicates and add suffix if needed
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM profiles WHERE referral_code = candidate AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) THEN
      NEW.referral_code := candidate;
      RETURN NEW;
    END IF;
    suffix := suffix + 1;
    candidate := base_code || suffix::text;
  END LOOP;
END;
$function$;

-- Add discount_applied column to orders table for tracking the 10% discount
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_code text DEFAULT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0;

-- Regenerate codes for existing profiles that have names
DO $$
DECLARE
  rec RECORD;
  first_name text;
  base_code text;
  candidate text;
  suffix int;
BEGIN
  FOR rec IN SELECT id, full_name FROM profiles WHERE full_name IS NOT NULL AND full_name != '' LOOP
    first_name := trim(split_part(rec.full_name, ' ', 1));
    IF first_name != '' THEN
      base_code := upper(first_name) || '10';
      candidate := base_code;
      suffix := 0;
      LOOP
        IF NOT EXISTS (
          SELECT 1 FROM profiles WHERE referral_code = candidate AND id != rec.id
        ) THEN
          UPDATE profiles SET referral_code = candidate WHERE id = rec.id;
          EXIT;
        END IF;
        suffix := suffix + 1;
        candidate := base_code || suffix::text;
      END LOOP;
    END IF;
  END LOOP;
END $$;
