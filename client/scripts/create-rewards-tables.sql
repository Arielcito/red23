-- Script para crear las tablas del sistema de recompensas
-- Ejecutar en Supabase SQL Editor

-- Tabla para ganadores de premios
CREATE TABLE IF NOT EXISTS reward_winners (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  user_email TEXT,
  avatar TEXT, -- URL a Supabase Storage
  prize TEXT NOT NULL,
  prize_amount DECIMAL(10,2),
  type TEXT NOT NULL CHECK (type IN ('daily', 'monthly')),
  won_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Tabla para configuraciones de rewards
CREATE TABLE IF NOT EXISTS reward_settings (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  banner_enabled BOOLEAN DEFAULT true,
  banner_title TEXT NOT NULL DEFAULT '¡Participa por premios exclusivos!',
  banner_description TEXT,
  banner_cta_label TEXT,
  banner_cta_url TEXT,
  banner_theme TEXT DEFAULT 'emerald' CHECK (banner_theme IN ('emerald', 'indigo', 'amber')),
  daily_prize_amount TEXT DEFAULT '$500 - $1,500 USD',
  monthly_prize_amount TEXT DEFAULT '$5,000 - $15,000 USD',
  rules_text TEXT
);

-- Tabla para gestión de imágenes de premios
CREATE TABLE IF NOT EXISTS reward_images (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL, -- URL a Supabase Storage
  image_type TEXT NOT NULL CHECK (image_type IN ('winner_avatar', 'banner_image', 'prize_image')),
  uploaded_by TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_reward_winners_type ON reward_winners(type);
CREATE INDEX IF NOT EXISTS idx_reward_winners_won_at ON reward_winners(won_at DESC);
CREATE INDEX IF NOT EXISTS idx_reward_winners_is_active ON reward_winners(is_active);
CREATE INDEX IF NOT EXISTS idx_reward_images_type ON reward_images(image_type);
CREATE INDEX IF NOT EXISTS idx_reward_images_is_active ON reward_images(is_active);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a las tablas
CREATE TRIGGER update_reward_winners_updated_at BEFORE UPDATE ON reward_winners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reward_settings_updated_at BEFORE UPDATE ON reward_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reward_images_updated_at BEFORE UPDATE ON reward_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar configuración inicial
INSERT INTO reward_settings (
  banner_enabled,
  banner_title,
  banner_description,
  banner_cta_label,
  banner_cta_url,
  banner_theme,
  daily_prize_amount,
  monthly_prize_amount
) VALUES (
  true,
  '¡Participa por premios exclusivos en tu país!',
  'Cada semana seleccionamos ganadores en Paraguay, México y Uruguay. Aumenta tus chances usando Red23.',
  'Ver reglas',
  '#reglas-premios',
  'emerald',
  '$500 - $1,500 USD',
  '$5,000 - $15,000 USD'
) ON CONFLICT DO NOTHING;

-- Insertar algunos ganadores de ejemplo
INSERT INTO reward_winners (name, user_email, prize, prize_amount, type, won_at) VALUES
  ('Carlos M.', 'carlos@example.com', '$1,000 USD', 1000, 'daily', NOW() - INTERVAL '1 day'),
  ('Ana L.', 'ana@example.com', '$750 USD', 750, 'daily', NOW() - INTERVAL '2 days'),
  ('Miguel R.', 'miguel@example.com', '$5,000 USD', 5000, 'monthly', NOW() - INTERVAL '30 days'),
  ('Sofia T.', 'sofia@example.com', '$500 USD', 500, 'daily', NOW() - INTERVAL '3 days'),
  ('Roberto K.', 'roberto@example.com', 'iPhone 15', 1200, 'daily', NOW() - INTERVAL '4 days')
ON CONFLICT DO NOTHING;

-- Crear bucket para imágenes de rewards (ejecutar por separado en la sección de Storage)
-- NOTA: Esto debe ejecutarse manualmente en Supabase Dashboard > Storage
-- 1. Crear bucket: 'rewards-images'
-- 2. Configurar como público
-- 3. Configurar políticas de acceso

-- Políticas de seguridad para las tablas
-- Permitir lectura pública de ganadores activos
CREATE POLICY "Permitir lectura pública de ganadores" ON reward_winners
  FOR SELECT USING (is_active = true);

-- Permitir lectura pública de configuraciones
CREATE POLICY "Permitir lectura pública de configuraciones" ON reward_settings
  FOR SELECT USING (true);

-- Permitir lectura pública de imágenes activas
CREATE POLICY "Permitir lectura pública de imágenes" ON reward_images
  FOR SELECT USING (is_active = true);

-- Habilitar RLS (Row Level Security)
ALTER TABLE reward_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_images ENABLE ROW LEVEL SECURITY;

-- Nota: Las políticas de escritura se configurarán en el backend con service key