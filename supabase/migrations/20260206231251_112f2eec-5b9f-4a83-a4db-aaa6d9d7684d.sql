
-- Add order_number column with auto-generated sequential VRL-###### format
ALTER TABLE public.orders ADD COLUMN order_number text UNIQUE;

-- Create a sequence starting at 100001 for nice 6-digit numbers
CREATE SEQUENCE public.order_number_seq START WITH 100001;

-- Create a trigger to auto-assign order_number on insert
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.order_number := 'VRL-' || nextval('public.order_number_seq')::text;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.generate_order_number();
