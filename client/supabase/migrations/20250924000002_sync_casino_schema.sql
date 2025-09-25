-- Migration: Recreate casinos table from scratch to match TypeScript definitions
-- NOTE: This migration DROPS and RECREATES the entire casinos table

-- ---------------------------------------------------------------------------
-- DROP EXISTING TABLE AND DEPENDENCIES
-- -------------------------------------w--------------------------------------

-- Drop views that depend on casinos table
DROP VIEW IF EXISTS public.top_three_casinos;
DROP VIEW IF EXISTS public.casinos_with_fields;

-- Drop triggers
DROP TRIGGER IF EXISTS casinos_set_updated_at ON public.casinos;

-- Drop functions
DROP FUNCTION IF EXISTS public.set_updated_at();

-- Drop the table completely
DROP TABLE IF EXISTS public.casinos CASCADE;

-- ---------------------------------------------------------------------------
-- CREATE ENUM TYPE
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  -- Drop existing enum if it exists
  DROP TYPE IF EXISTS precio_value CASCADE;

  -- Create the enum
  CREATE TYPE precio_value AS ENUM ('medio', 'barato', 'muy barato');
END
$$;

-- ---------------------------------------------------------------------------
-- CREATE CASINOS TABLE FROM SCRATCH
-- ---------------------------------------------------------------------------

CREATE TABLE public.casinos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  casino_name TEXT NOT NULL,
  logo TEXT,
  antiguedad TEXT NOT NULL DEFAULT 'Sin información',
  precio precio_value NOT NULL DEFAULT 'medio',
  rtp NUMERIC(5,2) NOT NULL DEFAULT 95.0 CHECK (rtp >= 0 AND rtp <= 100),
  plat_similar TEXT,
  position INTEGER CHECK (position IS NULL OR position >= 1),
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ---------------------------------------------------------------------------
-- CREATE UNIQUE INDEX FOR POSITION
-- ---------------------------------------------------------------------------

CREATE UNIQUE INDEX idx_casinos_position_unique
  ON public.casinos (position)
  WHERE position IS NOT NULL;

-- ---------------------------------------------------------------------------
-- TRIGGERS
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER casinos_set_updated_at
  BEFORE UPDATE ON public.casinos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- VIEWS
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.casinos_with_fields AS
SELECT
  c.id,
  c.casino_name,
  c.logo,
  c.antiguedad,
  c.precio,
  c.rtp,
  c.plat_similar,
  c.position,
  COALESCE(c.image_url, '/placeholder-casino.svg') AS image_url,
  c.is_active,
  c.created_at,
  c.updated_at
FROM public.casinos AS c;

CREATE OR REPLACE VIEW public.top_three_casinos AS
SELECT
  c.id,
  c.casino_name,
  c.antiguedad,
  c.precio,
  c.rtp,
  COALESCE(c.image_url, '/placeholder-casino.svg') AS image_url,
  c.position
FROM public.casinos AS c
WHERE c.position IS NOT NULL
ORDER BY c.position;
