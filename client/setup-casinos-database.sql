-- =====================================================================================
-- SISTEMA DE GESTIÓN DE CASINOS - SETUP COMPLETO
-- =====================================================================================
-- Este archivo contiene todas las tablas, funciones, triggers y configuraciones
-- necesarias para el sistema completo de gestión de casinos en Supabase.
-- =====================================================================================

-- =====================================================================================
-- 1. TABLAS PRINCIPALES
-- =====================================================================================

-- Tabla principal de casinos
CREATE TABLE IF NOT EXISTS casinos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    logo TEXT,
    plataforma VARCHAR(100) NOT NULL,
    tiempo VARCHAR(100) NOT NULL,
    potencial_value VARCHAR(50) NOT NULL CHECK (potencial_value IN ('high', 'medium', 'low')),
    potencial_color VARCHAR(20) NOT NULL CHECK (potencial_color IN ('green', 'yellow', 'red')),
    potencial_label VARCHAR(50) NOT NULL,
    "similar" TEXT,
    is_top_three BOOLEAN DEFAULT false,
    top_three_position INTEGER CHECK (top_three_position >= 1 AND top_three_position <= 3),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de campos personalizados configurables
CREATE TABLE IF NOT EXISTS casino_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    field_type VARCHAR(50) NOT NULL CHECK (field_type IN ('text', 'number', 'badge', 'percentage')),
    is_required BOOLEAN DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de valores de campos personalizados
CREATE TABLE IF NOT EXISTS casino_field_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    casino_id UUID NOT NULL REFERENCES casinos(id) ON DELETE CASCADE,
    field_id UUID NOT NULL REFERENCES casino_fields(id) ON DELETE CASCADE,
    text_value TEXT,
    number_value NUMERIC,
    badge_value VARCHAR(100),
    badge_color VARCHAR(20) CHECK (badge_color IN ('red', 'yellow', 'green')),
    badge_label VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(casino_id, field_id)
);

-- Tabla de configuración global del sistema
CREATE TABLE IF NOT EXISTS casino_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================================================
-- 2. ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================================================

CREATE INDEX IF NOT EXISTS idx_casinos_is_top_three ON casinos(is_top_three) WHERE is_top_three = true;
CREATE INDEX IF NOT EXISTS idx_casinos_top_three_position ON casinos(top_three_position) WHERE top_three_position IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_casinos_is_active ON casinos(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_casino_fields_display_order ON casino_fields(display_order);
CREATE INDEX IF NOT EXISTS idx_casino_field_values_casino_id ON casino_field_values(casino_id);
CREATE INDEX IF NOT EXISTS idx_casino_config_key ON casino_config(config_key);

-- =====================================================================================
-- 3. FUNCIONES Y TRIGGERS
-- =====================================================================================

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_casinos_updated_at BEFORE UPDATE ON casinos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_casino_fields_updated_at BEFORE UPDATE ON casino_fields FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_casino_field_values_updated_at BEFORE UPDATE ON casino_field_values FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_casino_config_updated_at BEFORE UPDATE ON casino_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para validar que solo hay máximo 3 casinos en top_three
CREATE OR REPLACE FUNCTION validate_top_three_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_top_three = true THEN
        -- Contar cuántos casinos están en top three (excluyendo el actual si es una actualización)
        IF TG_OP = 'UPDATE' THEN
            IF (SELECT COUNT(*) FROM casinos WHERE is_top_three = true AND id != NEW.id) >= 3 THEN
                RAISE EXCEPTION 'No puede haber más de 3 casinos en el top three';
            END IF;
        ELSE -- INSERT
            IF (SELECT COUNT(*) FROM casinos WHERE is_top_three = true) >= 3 THEN
                RAISE EXCEPTION 'No puede haber más de 3 casinos en el top three';
            END IF;
        END IF;

        -- Si se asigna una posición, validar que no esté ocupada
        IF NEW.top_three_position IS NOT NULL THEN
            IF TG_OP = 'UPDATE' THEN
                IF EXISTS (SELECT 1 FROM casinos WHERE top_three_position = NEW.top_three_position AND id != NEW.id) THEN
                    RAISE EXCEPTION 'La posición % ya está ocupada en el top three', NEW.top_three_position;
                END IF;
            ELSE -- INSERT
                IF EXISTS (SELECT 1 FROM casinos WHERE top_three_position = NEW.top_three_position) THEN
                    RAISE EXCEPTION 'La posición % ya está ocupada en el top three', NEW.top_three_position;
                END IF;
            END IF;
        END IF;
    ELSE
        -- Si no está en top three, limpiar la posición
        NEW.top_three_position = NULL;
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para validar top three
CREATE TRIGGER validate_casino_top_three BEFORE INSERT OR UPDATE ON casinos FOR EACH ROW EXECUTE FUNCTION validate_top_three_limit();

-- =====================================================================================
-- 4. DATOS INICIALES
-- =====================================================================================

-- Insertar campos personalizados predeterminados
INSERT INTO casino_fields (name, field_type, is_required, display_order) VALUES
('Bonos', 'text', false, 1),
('Métodos de Pago', 'number', false, 2),
('Calificación', 'badge', false, 3)
ON CONFLICT DO NOTHING;

-- Insertar configuración inicial
INSERT INTO casino_config (config_key, config_value, description) VALUES
('top_three_enabled', 'true', 'Habilitar funcionalidad de top 3 casinos'),
('max_custom_fields', '10', 'Número máximo de campos personalizados'),
('default_image_url', '"/placeholder-casino.svg"', 'URL de imagen por defecto para casinos')
ON CONFLICT (config_key) DO NOTHING;

-- Datos de ejemplo (casinos iniciales)
INSERT INTO casinos (name, plataforma, tiempo, potencial_value, potencial_color, potencial_label, "similar", is_top_three, top_three_position, image_url) VALUES
('Casino Royal', 'Web/Mobile', '2-4 semanas', 'high', 'green', 'Alto', 'Bet365, 888casino', true, 1, '/casino-royal.svg'),
('Golden Palace', 'Web', '3-5 semanas', 'high', 'green', 'Alto', 'William Hill, Pokerstars', true, 2, '/golden-palace.svg'),
('Lucky Stars', 'Mobile App', '1-3 semanas', 'medium', 'yellow', 'Medio', 'Betway, LeoVegas', true, 3, '/lucky-stars.svg'),
('Diamond Club', 'Web/Mobile', '2-4 semanas', 'medium', 'yellow', 'Medio', 'Unibet, Casumo', false, NULL, NULL),
('Neon Lights', 'Web', '4-6 semanas', 'low', 'red', 'Bajo', 'Spin Palace, Royal Vegas', false, NULL, NULL)
ON CONFLICT DO NOTHING;

-- Obtener IDs de los campos y casinos para los valores de ejemplo
DO $$
DECLARE
    bonos_field_id UUID;
    metodos_field_id UUID;
    calificacion_field_id UUID;
    casino_royal_id UUID;
    golden_palace_id UUID;
    lucky_stars_id UUID;
    diamond_club_id UUID;
    neon_lights_id UUID;
BEGIN
    -- Obtener IDs de campos
    SELECT id INTO bonos_field_id FROM casino_fields WHERE name = 'Bonos' LIMIT 1;
    SELECT id INTO metodos_field_id FROM casino_fields WHERE name = 'Métodos de Pago' LIMIT 1;
    SELECT id INTO calificacion_field_id FROM casino_fields WHERE name = 'Calificación' LIMIT 1;

    -- Obtener IDs de casinos
    SELECT id INTO casino_royal_id FROM casinos WHERE name = 'Casino Royal' LIMIT 1;
    SELECT id INTO golden_palace_id FROM casinos WHERE name = 'Golden Palace' LIMIT 1;
    SELECT id INTO lucky_stars_id FROM casinos WHERE name = 'Lucky Stars' LIMIT 1;
    SELECT id INTO diamond_club_id FROM casinos WHERE name = 'Diamond Club' LIMIT 1;
    SELECT id INTO neon_lights_id FROM casinos WHERE name = 'Neon Lights' LIMIT 1;

    -- Insertar valores de campos para Casino Royal
    IF casino_royal_id IS NOT NULL AND bonos_field_id IS NOT NULL THEN
        INSERT INTO casino_field_values (casino_id, field_id, text_value) VALUES
        (casino_royal_id, bonos_field_id, 'Bono de bienvenida 100%')
        ON CONFLICT (casino_id, field_id) DO NOTHING;
    END IF;

    IF casino_royal_id IS NOT NULL AND metodos_field_id IS NOT NULL THEN
        INSERT INTO casino_field_values (casino_id, field_id, number_value) VALUES
        (casino_royal_id, metodos_field_id, 8)
        ON CONFLICT (casino_id, field_id) DO NOTHING;
    END IF;

    IF casino_royal_id IS NOT NULL AND calificacion_field_id IS NOT NULL THEN
        INSERT INTO casino_field_values (casino_id, field_id, badge_value, badge_color, badge_label) VALUES
        (casino_royal_id, calificacion_field_id, 'excelente', 'green', 'Excelente')
        ON CONFLICT (casino_id, field_id) DO NOTHING;
    END IF;

    -- Insertar valores para Golden Palace
    IF golden_palace_id IS NOT NULL AND bonos_field_id IS NOT NULL THEN
        INSERT INTO casino_field_values (casino_id, field_id, text_value) VALUES
        (golden_palace_id, bonos_field_id, 'Bono + giros gratis')
        ON CONFLICT (casino_id, field_id) DO NOTHING;
    END IF;

    IF golden_palace_id IS NOT NULL AND metodos_field_id IS NOT NULL THEN
        INSERT INTO casino_field_values (casino_id, field_id, number_value) VALUES
        (golden_palace_id, metodos_field_id, 6)
        ON CONFLICT (casino_id, field_id) DO NOTHING;
    END IF;

    IF golden_palace_id IS NOT NULL AND calificacion_field_id IS NOT NULL THEN
        INSERT INTO casino_field_values (casino_id, field_id, badge_value, badge_color, badge_label) VALUES
        (golden_palace_id, calificacion_field_id, 'muy_bueno', 'green', 'Muy Bueno')
        ON CONFLICT (casino_id, field_id) DO NOTHING;
    END IF;

    -- Insertar valores para Lucky Stars
    IF lucky_stars_id IS NOT NULL AND bonos_field_id IS NOT NULL THEN
        INSERT INTO casino_field_values (casino_id, field_id, text_value) VALUES
        (lucky_stars_id, bonos_field_id, 'Programa VIP')
        ON CONFLICT (casino_id, field_id) DO NOTHING;
    END IF;

    IF lucky_stars_id IS NOT NULL AND metodos_field_id IS NOT NULL THEN
        INSERT INTO casino_field_values (casino_id, field_id, number_value) VALUES
        (lucky_stars_id, metodos_field_id, 5)
        ON CONFLICT (casino_id, field_id) DO NOTHING;
    END IF;

    IF lucky_stars_id IS NOT NULL AND calificacion_field_id IS NOT NULL THEN
        INSERT INTO casino_field_values (casino_id, field_id, badge_value, badge_color, badge_label) VALUES
        (lucky_stars_id, calificacion_field_id, 'bueno', 'yellow', 'Bueno')
        ON CONFLICT (casino_id, field_id) DO NOTHING;
    END IF;

    -- Insertar valores para Diamond Club
    IF diamond_club_id IS NOT NULL AND bonos_field_id IS NOT NULL THEN
        INSERT INTO casino_field_values (casino_id, field_id, text_value) VALUES
        (diamond_club_id, bonos_field_id, 'Cashback semanal')
        ON CONFLICT (casino_id, field_id) DO NOTHING;
    END IF;

    IF diamond_club_id IS NOT NULL AND metodos_field_id IS NOT NULL THEN
        INSERT INTO casino_field_values (casino_id, field_id, number_value) VALUES
        (diamond_club_id, metodos_field_id, 7)
        ON CONFLICT (casino_id, field_id) DO NOTHING;
    END IF;

    IF diamond_club_id IS NOT NULL AND calificacion_field_id IS NOT NULL THEN
        INSERT INTO casino_field_values (casino_id, field_id, badge_value, badge_color, badge_label) VALUES
        (diamond_club_id, calificacion_field_id, 'bueno', 'yellow', 'Bueno')
        ON CONFLICT (casino_id, field_id) DO NOTHING;
    END IF;

    -- Insertar valores para Neon Lights
    IF neon_lights_id IS NOT NULL AND bonos_field_id IS NOT NULL THEN
        INSERT INTO casino_field_values (casino_id, field_id, text_value) VALUES
        (neon_lights_id, bonos_field_id, 'Torneo mensual')
        ON CONFLICT (casino_id, field_id) DO NOTHING;
    END IF;

    IF neon_lights_id IS NOT NULL AND metodos_field_id IS NOT NULL THEN
        INSERT INTO casino_field_values (casino_id, field_id, number_value) VALUES
        (neon_lights_id, metodos_field_id, 4)
        ON CONFLICT (casino_id, field_id) DO NOTHING;
    END IF;

    IF neon_lights_id IS NOT NULL AND calificacion_field_id IS NOT NULL THEN
        INSERT INTO casino_field_values (casino_id, field_id, badge_value, badge_color, badge_label) VALUES
        (neon_lights_id, calificacion_field_id, 'regular', 'red', 'Regular')
        ON CONFLICT (casino_id, field_id) DO NOTHING;
    END IF;
END
$$;

-- =====================================================================================
-- 5. POLÍTICAS RLS (Row Level Security)
-- =====================================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE casinos ENABLE ROW LEVEL SECURITY;
ALTER TABLE casino_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE casino_field_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE casino_config ENABLE ROW LEVEL SECURITY;

-- Políticas para casinos (lectura pública, escritura restringida)
CREATE POLICY "Casinos are viewable by everyone" ON casinos FOR SELECT USING (true);
CREATE POLICY "Casinos are insertable by authenticated users" ON casinos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Casinos are updatable by authenticated users" ON casinos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Casinos are deletable by authenticated users" ON casinos FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para campos (lectura pública, escritura restringida)
CREATE POLICY "Casino fields are viewable by everyone" ON casino_fields FOR SELECT USING (true);
CREATE POLICY "Casino fields are insertable by authenticated users" ON casino_fields FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Casino fields are updatable by authenticated users" ON casino_fields FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Casino fields are deletable by authenticated users" ON casino_fields FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para valores de campos (lectura pública, escritura restringida)
CREATE POLICY "Casino field values are viewable by everyone" ON casino_field_values FOR SELECT USING (true);
CREATE POLICY "Casino field values are insertable by authenticated users" ON casino_field_values FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Casino field values are updatable by authenticated users" ON casino_field_values FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Casino field values are deletable by authenticated users" ON casino_field_values FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para configuración (lectura pública, escritura restringida)
CREATE POLICY "Casino config is viewable by everyone" ON casino_config FOR SELECT USING (true);
CREATE POLICY "Casino config is insertable by authenticated users" ON casino_config FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Casino config is updatable by authenticated users" ON casino_config FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Casino config is deletable by authenticated users" ON casino_config FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================================================
-- 6. VISTAS ÚTILES
-- =====================================================================================

-- Vista completa de casinos con sus campos personalizados
CREATE OR REPLACE VIEW casinos_with_fields AS
SELECT
    c.id,
    c.name,
    c.logo,
    c.plataforma,
    c.tiempo,
    c.potencial_value,
    c.potencial_color,
    c.potencial_label,
    c."similar",
    c.is_top_three,
    c.top_three_position,
    c.image_url,
    c.is_active,
    c.created_at,
    c.updated_at,
    COALESCE(
        json_agg(
            json_build_object(
                'fieldId', cf.id,
                'fieldName', cf.name,
                'fieldType', cf.field_type,
                'textValue', cfv.text_value,
                'numberValue', cfv.number_value,
                'badgeValue', cfv.badge_value,
                'badgeColor', cfv.badge_color,
                'badgeLabel', cfv.badge_label
            ) ORDER BY cf.display_order
        ) FILTER (WHERE cf.id IS NOT NULL),
        '[]'::json
    ) as custom_fields
FROM casinos c
LEFT JOIN casino_field_values cfv ON c.id = cfv.casino_id
LEFT JOIN casino_fields cf ON cfv.field_id = cf.id AND cf.is_active = true
WHERE c.is_active = true
GROUP BY c.id, c.name, c.logo, c.plataforma, c.tiempo, c.potencial_value, c.potencial_color, c.potencial_label, c."similar", c.is_top_three, c.top_three_position, c.image_url, c.is_active, c.created_at, c.updated_at;

-- Vista para top 3 casinos
CREATE OR REPLACE VIEW top_three_casinos AS
SELECT
    id,
    name,
    plataforma,
    image_url,
    potencial_value,
    potencial_color,
    potencial_label,
    top_three_position,
    created_at,
    updated_at
FROM casinos
WHERE is_top_three = true AND is_active = true
ORDER BY top_three_position;

-- =====================================================================================
-- 7. COMENTARIOS FINALES
-- =====================================================================================

COMMENT ON TABLE casinos IS 'Tabla principal para almacenar información de casinos';
COMMENT ON TABLE casino_fields IS 'Campos personalizados configurables para casinos';
COMMENT ON TABLE casino_field_values IS 'Valores de campos personalizados por casino';
COMMENT ON TABLE casino_config IS 'Configuración global del sistema de casinos';

COMMENT ON COLUMN casinos.potencial_value IS 'Valor del potencial: high, medium, low';
COMMENT ON COLUMN casinos.is_top_three IS 'Indica si el casino está en el top 3';
COMMENT ON COLUMN casinos.top_three_position IS 'Posición en el top 3 (1, 2, 3)';

COMMENT ON COLUMN casino_fields.field_type IS 'Tipo de campo: text, number, badge, percentage';
COMMENT ON COLUMN casino_fields.display_order IS 'Orden de visualización del campo';

COMMENT ON COLUMN casino_field_values.badge_color IS 'Color del badge: red, yellow, green';

-- =====================================================================================
-- CONSULTAS DE VERIFICACIÓN
-- =====================================================================================

-- Verificar que las tablas se crearon correctamente
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE 'casino_%'
ORDER BY tablename;

-- Contar registros en cada tabla
SELECT 'casinos' as tabla, COUNT(*) as registros FROM casinos
UNION ALL
SELECT 'casino_fields' as tabla, COUNT(*) as registros FROM casino_fields
UNION ALL
SELECT 'casino_field_values' as tabla, COUNT(*) as registros FROM casino_field_values
UNION ALL
SELECT 'casino_config' as tabla, COUNT(*) as registros FROM casino_config;

-- Verificar configuración del sistema
SELECT config_key, config_value, description FROM casino_config ORDER BY config_key;

-- Verificar casinos del top 3
SELECT name, plataforma, potencial_label, top_three_position
FROM casinos
WHERE is_top_three = true
ORDER BY top_three_position;

-- Verificar vista de casinos con campos
SELECT name, json_array_length(custom_fields) as num_custom_fields
FROM casinos_with_fields
ORDER BY name;

-- =====================================================================================
-- FIN DEL SETUP - SISTEMA DE CASINOS COMPLETO
-- =====================================================================================
-- Próximos pasos después de ejecutar este SQL:
-- 1. Crear las interfaces TypeScript correspondientes en src/lib/types/
-- 2. Implementar el servicio de casinos en src/lib/services/
-- 3. Crear las rutas API en src/app/api/casinos/
-- 4. Actualizar el hook de datos useCasinosData
-- 5. Completar la interfaz de administración en src/app/admin/casinos/
-- =====================================================================================
