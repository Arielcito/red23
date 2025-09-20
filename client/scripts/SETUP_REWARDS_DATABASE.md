# 🏆 Setup de Base de Datos - Sistema de Recompensas

Este archivo contiene todos los comandos SQL necesarios para configurar el sistema de recompensas en Supabase.

## 📋 Instrucciones

1. **Abrir Supabase Dashboard** → SQL Editor
2. **Copiar y pegar** cada sección en orden
3. **Ejecutar** cada bloque de SQL
4. **Crear bucket** manualmente en Storage
5. **Verificar** con el script de Node.js

---

## 🗄️ PASO 1: Crear Tablas Principales

```sql
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
```

---

## 📊 PASO 2: Crear Índices para Performance

```sql
-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_reward_winners_type ON reward_winners(type);
CREATE INDEX IF NOT EXISTS idx_reward_winners_won_at ON reward_winners(won_at DESC);
CREATE INDEX IF NOT EXISTS idx_reward_winners_is_active ON reward_winners(is_active);
CREATE INDEX IF NOT EXISTS idx_reward_images_type ON reward_images(image_type);
CREATE INDEX IF NOT EXISTS idx_reward_images_is_active ON reward_images(is_active);
```

---

## ⚡ PASO 3: Crear Función y Triggers para updated_at

```sql
-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers a las tablas
CREATE TRIGGER update_reward_winners_updated_at 
  BEFORE UPDATE ON reward_winners 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reward_settings_updated_at 
  BEFORE UPDATE ON reward_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reward_images_updated_at 
  BEFORE UPDATE ON reward_images 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔒 PASO 4: Configurar Row Level Security (RLS)

```sql
-- Habilitar RLS en las tablas
ALTER TABLE reward_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_images ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para ganadores activos
CREATE POLICY "Permitir lectura pública de ganadores" ON reward_winners
  FOR SELECT USING (is_active = true);

-- Políticas de lectura pública para configuraciones
CREATE POLICY "Permitir lectura pública de configuraciones" ON reward_settings
  FOR SELECT USING (true);

-- Políticas de lectura pública para imágenes activas
CREATE POLICY "Permitir lectura pública de imágenes" ON reward_images
  FOR SELECT USING (is_active = true);
```

---

## 📦 PASO 5: Insertar Datos Iniciales

```sql
-- Insertar configuración inicial de rewards
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

-- Insertar ganadores de ejemplo
INSERT INTO reward_winners (name, user_email, prize, prize_amount, type, won_at) VALUES
  ('Carlos M.', 'carlos@example.com', '$1,000 USD', 1000, 'daily', NOW() - INTERVAL '1 day'),
  ('Ana L.', 'ana@example.com', '$750 USD', 750, 'daily', NOW() - INTERVAL '2 days'),
  ('Miguel R.', 'miguel@example.com', '$5,000 USD', 5000, 'monthly', NOW() - INTERVAL '30 days'),
  ('Sofia T.', 'sofia@example.com', '$500 USD', 500, 'daily', NOW() - INTERVAL '3 days'),
  ('Roberto K.', 'roberto@example.com', 'iPhone 15', 1200, 'daily', NOW() - INTERVAL '4 days'),
  ('Elena P.', 'elena@example.com', '$800 USD', 800, 'daily', NOW() - INTERVAL '5 days'),
  ('Diego F.', 'diego@example.com', 'MacBook Air', 1500, 'monthly', NOW() - INTERVAL '60 days'),
  ('Carmen S.', 'carmen@example.com', '$600 USD', 600, 'daily', NOW() - INTERVAL '6 days')
ON CONFLICT DO NOTHING;
```

---

## 🔍 PASO 6: Consultas de Verificación

```sql
-- Verificar que las tablas se crearon correctamente
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'reward_%'
ORDER BY table_name;

-- Contar registros en cada tabla
SELECT 'reward_winners' as tabla, COUNT(*) as registros FROM reward_winners
UNION ALL
SELECT 'reward_settings' as tabla, COUNT(*) as registros FROM reward_settings
UNION ALL
SELECT 'reward_images' as tabla, COUNT(*) as registros FROM reward_images;

-- Verificar ganadores por tipo
SELECT type, COUNT(*) as cantidad, 
       MIN(won_at) as primer_ganador, 
       MAX(won_at) as ultimo_ganador
FROM reward_winners 
WHERE is_active = true 
GROUP BY type;

-- Verificar configuración actual
SELECT banner_enabled, banner_title, banner_theme, 
       daily_prize_amount, monthly_prize_amount
FROM reward_settings;
```

---

## 📦 PASO 7: Crear Bucket de Storage (Manual)

### 🎯 Pasos en Supabase Dashboard:

1. **Ir a Storage** en el menú lateral
2. **Hacer clic en "New Bucket"**
3. **Configurar el bucket:**
   - **Nombre:** `rewards-images`
   - **Público:** ✅ **SÍ** (importante)
   - **Tamaño máximo de archivo:** `5MB`
   - **Tipos permitidos:** `image/jpeg, image/jpg, image/png, image/gif, image/webp`
4. **Crear bucket**

### 📋 Políticas de Storage (Opcional - ya están en el código):

```sql
-- Política para permitir upload autenticado
CREATE POLICY "Permitir upload de imágenes autenticado" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'rewards-images' AND auth.role() = 'authenticated');

-- Política para permitir lectura pública
CREATE POLICY "Permitir lectura pública de imágenes" ON storage.objects
  FOR SELECT USING (bucket_id = 'rewards-images');

-- Política para permitir eliminación autenticada
CREATE POLICY "Permitir eliminación autenticada" ON storage.objects
  FOR DELETE USING (bucket_id = 'rewards-images' AND auth.role() = 'authenticated');
```

---

## ✅ PASO 8: Verificar Instalación

### 🖥️ Comando en terminal:

```bash
cd /Users/arielserato/Developer/red23/client
node scripts/create-missing-tables.js
```

### 📊 Resultado esperado:

```
🚀 Checking database connection and existing tables...
✅ automatic_prompts table exists, found X records
✅ user_referrals table exists, found X records
✅ referral_tracking table exists, found X records
✅ images_generator table exists, found X records
✅ telegram_members table exists, found X records
✅ telegram_winners table exists, found X records
🏆 Checking for reward_winners table...
✅ reward_winners table exists, found 8 records
⚙️ Checking for reward_settings table...
✅ reward_settings table exists, found 1 records
🖼️ Checking for reward_images table...
✅ reward_images table exists, found 0 records
📦 Checking rewards-images storage bucket...
✅ rewards-images bucket exists: rewards-images
✅ bucket is accessible, found 0 files
🎉 Database and storage check completed!
```

---

## 🚀 PASO 9: Probar el Sistema

### 🎯 URLs para probar:

1. **Página pública:** `http://localhost:3000/rewards`
2. **Admin panel:** `http://localhost:3000/admin/rewards`

### 🧪 Funcionalidades a probar:

- ✅ Ver ganadores reales en página pública
- ✅ Configurar banner desde admin
- ✅ Subir imágenes desde admin
- ✅ Crear/editar ganadores
- ✅ Cambiar temas del banner

---

## 🔧 Troubleshooting

### ❌ Error: "relation reward_winners does not exist"
**Solución:** Ejecutar PASO 1 - Crear Tablas

### ❌ Error: "bucket rewards-images does not exist"
**Solución:** Crear bucket manualmente en Storage (PASO 7)

### ❌ Error: "permission denied for table reward_winners"
**Solución:** Verificar RLS policies (PASO 4)

### ❌ Error: "function update_updated_at_column() does not exist"
**Solución:** Ejecutar PASO 3 - Crear función y triggers

---

## 📝 Notas Importantes

- **⚠️ Orden de ejecución:** Los pasos deben ejecutarse EN ORDEN
- **🔑 Service Key:** Asegúrate de tener `SUPABASE_SERVICE_ROLE_KEY` en `.env`
- **🌐 Bucket público:** El bucket DEBE ser público para mostrar imágenes
- **🔒 Seguridad:** Las políticas RLS protegen las operaciones de escritura
- **📊 Performance:** Los índices mejoran las consultas de ganadores

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, tendrás:

- ✅ **3 tablas** nuevas en tu base de datos
- ✅ **1 bucket** de storage para imágenes
- ✅ **Datos de ejemplo** para probar
- ✅ **Seguridad configurada** con RLS
- ✅ **Performance optimizada** con índices
- ✅ **Sistema completo** funcionando

**¡El sistema de recompensas está listo para usar! 🚀**