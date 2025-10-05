-- Update learning_paths level constraint to match user roles
-- Drop existing check constraint
ALTER TABLE learning_paths
DROP CONSTRAINT IF EXISTS learning_paths_level_check;

-- Add new check constraint with correct role values
ALTER TABLE learning_paths
ADD CONSTRAINT learning_paths_level_check
CHECK (level IN ('Cajero', 'Administrador', 'Proveedor'));

-- Update existing data to use new role-based levels
-- Map old levels to new ones (this is a one-time migration)
UPDATE learning_paths
SET level = CASE
  WHEN level = 'Principiante' THEN 'Cajero'
  WHEN level = 'Intermedio' THEN 'Administrador'
  WHEN level = 'Avanzado' THEN 'Proveedor'
  ELSE level
END;

-- Update comment to reflect new values
COMMENT ON COLUMN learning_paths.level IS 'User role level: Cajero, Administrador, Proveedor';
