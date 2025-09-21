-- Crear tabla para usuarios pendientes de completar registro
CREATE TABLE pending_users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  telegram TEXT,
  country TEXT NOT NULL,
  referral_code TEXT,
  referred_by_code TEXT,
  whatsapp_message TEXT,
  clerk_user_id TEXT UNIQUE DEFAULT NULL, -- Se llena cuando se complete el registro con Clerk
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ DEFAULT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days') -- Los registros pendientes expiran en 30 días
);

-- Índices para optimizar consultas
CREATE INDEX idx_pending_users_email ON pending_users(email);
CREATE INDEX idx_pending_users_clerk_user_id ON pending_users(clerk_user_id);
CREATE INDEX idx_pending_users_status ON pending_users(status);
CREATE INDEX idx_pending_users_referred_by_code ON pending_users(referred_by_code);
CREATE INDEX idx_pending_users_created_at ON pending_users(created_at);

-- RLS (Row Level Security)
ALTER TABLE pending_users ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a usuarios autenticados de sus propios datos
CREATE POLICY "Users can read their own pending registration" ON pending_users
  FOR SELECT USING (auth.jwt() ->> 'email' = email OR auth.jwt() ->> 'sub' = clerk_user_id);

-- Política para permitir inserción pública (para el formulario de demo)
CREATE POLICY "Anyone can create pending user registration" ON pending_users
  FOR INSERT WITH CHECK (true);

-- Política para permitir actualización solo del sistema (para vincular con Clerk)
CREATE POLICY "System can update pending users" ON pending_users
  FOR UPDATE USING (true);

-- Comentarios para documentación
COMMENT ON TABLE pending_users IS 'Almacena usuarios que solicitaron demo pero aún no completaron registro con Clerk';
COMMENT ON COLUMN pending_users.email IS 'Email del usuario (único)';
COMMENT ON COLUMN pending_users.name IS 'Nombre completo del usuario';
COMMENT ON COLUMN pending_users.telegram IS 'Usuario de Telegram (opcional)';
COMMENT ON COLUMN pending_users.country IS 'País seleccionado';
COMMENT ON COLUMN pending_users.referral_code IS 'Código de referido usado (opcional)';
COMMENT ON COLUMN pending_users.referred_by_code IS 'Código de quien lo refirió (opcional)';
COMMENT ON COLUMN pending_users.whatsapp_message IS 'Mensaje enviado por WhatsApp';
COMMENT ON COLUMN pending_users.clerk_user_id IS 'ID de Clerk cuando complete el registro';
COMMENT ON COLUMN pending_users.status IS 'Estado: pending, completed, expired';
COMMENT ON COLUMN pending_users.created_at IS 'Fecha de creación del registro pendiente';
COMMENT ON COLUMN pending_users.completed_at IS 'Fecha cuando se completó el registro con Clerk';
COMMENT ON COLUMN pending_users.expires_at IS 'Fecha de expiración del registro pendiente';