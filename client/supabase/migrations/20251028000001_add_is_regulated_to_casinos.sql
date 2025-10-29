-- Migration: Add is_regulated field to casinos table
-- Adds a boolean field to track regulatory status of casinos

-- ---------------------------------------------------------------------------
-- ADD COLUMN TO CASINOS TABLE
-- ---------------------------------------------------------------------------

ALTER TABLE public.casinos
ADD COLUMN is_regulated BOOLEAN NOT NULL DEFAULT false;

-- ---------------------------------------------------------------------------
-- UPDATE VIEWS TO INCLUDE NEW FIELD
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
  c.is_regulated,
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
  c.is_regulated,
  COALESCE(c.image_url, '/placeholder-casino.svg') AS image_url,
  c.position
FROM public.casinos AS c
WHERE c.position IS NOT NULL
ORDER BY c.position;
