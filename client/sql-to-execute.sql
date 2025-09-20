-- SQL para ejecutar en el Supabase SQL Editor
-- Ve a https://supabase.com/dashboard/project/duuiqqhahtjwbehwnnmi/sql/new
-- Copia y pega este código, luego haz clic en "Run"

-- 1. Crear tabla automatic_prompts
CREATE TABLE IF NOT EXISTS automatic_prompts (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general' NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL
);

-- 2. Crear tabla user_referrals
CREATE TABLE IF NOT EXISTS user_referrals (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  referred_by_code TEXT,
  referred_by_user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Crear tabla referral_tracking
CREATE TABLE IF NOT EXISTS referral_tracking (
  id BIGSERIAL PRIMARY KEY,
  referrer_user_id TEXT NOT NULL,
  referred_user_id TEXT NOT NULL,
  referral_code TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ
);

-- 4. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_user_referrals_user_id ON user_referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_referral_code ON user_referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_tracking_referrer ON referral_tracking(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_tracking_referred ON referral_tracking(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_automatic_prompts_active ON automatic_prompts(is_active);
CREATE INDEX IF NOT EXISTS idx_automatic_prompts_order ON automatic_prompts(order_index);

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE automatic_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_tracking ENABLE ROW LEVEL SECURITY;

-- 6. Crear políticas básicas de RLS
-- Políticas para automatic_prompts
CREATE POLICY "Enable read access for authenticated users" 
ON automatic_prompts FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for service role" 
ON automatic_prompts FOR ALL 
USING (auth.role() = 'service_role');

-- Políticas para user_referrals  
CREATE POLICY "Users can view their own referrals" 
ON user_referrals FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for service role on user_referrals" 
ON user_referrals FOR ALL 
USING (auth.role() = 'service_role');

-- Políticas para referral_tracking
CREATE POLICY "Users can view their own tracking" 
ON referral_tracking FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for service role on referral_tracking" 
ON referral_tracking FOR ALL 
USING (auth.role() = 'service_role');

-- 7. Insertar datos de ejemplo para automatic_prompts
INSERT INTO automatic_prompts (title, content, category, is_active, order_index)
VALUES 
  ('Banner promocional para casino', 'Crear un banner promocional atractivo para nuestro casino online con colores vibrantes y elementos llamativos', 'general', true, 1),
  ('Jackpot progresivo', 'Diseñar una imagen para promocionar nuestro jackpot progresivo con números grandes y efectos brillantes', 'jackpots', true, 2),
  ('Bonos de bienvenida', 'Crear una imagen promocional para los bonos de bienvenida del casino', 'bonos', true, 3),
  ('Slots populares', 'Diseñar un banner para promocionar nuestras slots más populares', 'slots', true, 4),
  ('Mesa de blackjack', 'Crear una imagen promocional para las mesas de blackjack en vivo', 'blackjack', true, 5);

-- 8. Mensaje de confirmación
SELECT 'Todas las tablas han sido creadas exitosamente!' as message;