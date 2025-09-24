-- Agregar columna position a la tabla casinos
ALTER TABLE casinos 
ADD COLUMN position INTEGER;

-- Migrar datos existentes: convertir top_three_position a position
UPDATE casinos 
SET position = top_three_position 
WHERE is_top_three = true AND top_three_position IS NOT NULL;

-- Eliminar las columnas antigas (opcional, comentado por seguridad)
-- ALTER TABLE casinos DROP COLUMN is_top_three;
-- ALTER TABLE casinos DROP COLUMN top_three_position;

-- Crear índice en position para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_casinos_position
ON casinos(position)
WHERE position IS NOT NULL;

-- Actualizar RLS policies para permitir operaciones CRUD
DROP POLICY IF EXISTS "Enable read access for all users" ON casinos;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON casinos;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON casinos;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON casinos;

-- Crear políticas más permisivas (ajustar según necesidades de seguridad)
CREATE POLICY "Enable all access for authenticated users" ON casinos
    FOR ALL USING (auth.role() = 'authenticated');

-- Para desarrollo, también permitir acceso público (comentar en producción)
CREATE POLICY "Enable all access for anonymous users" ON casinos
    FOR ALL USING (true);