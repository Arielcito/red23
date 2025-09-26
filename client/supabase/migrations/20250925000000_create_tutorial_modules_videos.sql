-- Create tutorial_modules table for managing modules within learning paths
CREATE TABLE IF NOT EXISTS tutorial_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create tutorial_videos table for managing videos within modules
CREATE TABLE IF NOT EXISTS tutorial_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES tutorial_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration TEXT, -- e.g., "15:30"
  order_index INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tutorial_modules_learning_path ON tutorial_modules(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_tutorial_modules_active ON tutorial_modules(is_active);
CREATE INDEX IF NOT EXISTS idx_tutorial_modules_order ON tutorial_modules(order_index);

CREATE INDEX IF NOT EXISTS idx_tutorial_videos_module ON tutorial_videos(module_id);
CREATE INDEX IF NOT EXISTS idx_tutorial_videos_active ON tutorial_videos(is_active);
CREATE INDEX IF NOT EXISTS idx_tutorial_videos_order ON tutorial_videos(order_index);

-- Enable Row Level Security (RLS) for security
ALTER TABLE tutorial_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorial_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for tutorial_modules
CREATE POLICY "Enable read access for all users" 
ON tutorial_modules FOR SELECT 
USING (is_active = true);

CREATE POLICY "Enable all access for service role" 
ON tutorial_modules FOR ALL 
USING (auth.role() = 'service_role');

-- Create policies for tutorial_videos
CREATE POLICY "Enable read access for all users" 
ON tutorial_videos FOR SELECT 
USING (is_active = true);

CREATE POLICY "Enable all access for service role" 
ON tutorial_videos FOR ALL 
USING (auth.role() = 'service_role');

-- Add triggers to update updated_at columns
CREATE TRIGGER update_tutorial_modules_updated_at 
BEFORE UPDATE ON tutorial_modules 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutorial_videos_updated_at 
BEFORE UPDATE ON tutorial_videos 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial modules data for existing learning paths
INSERT INTO tutorial_modules (learning_path_id, title, description, order_index)
SELECT 
  lp.id,
  CASE 
    WHEN lp.slug = 'fundamentos-marketing' THEN 'Introducción al Marketing Digital'
    WHEN lp.slug = 'marketing-redes-sociales' THEN 'Estrategias en Instagram'
    WHEN lp.slug = 'casinos-online' THEN 'Compliance y Regulaciones'
    ELSE 'Módulo Inicial'
  END,
  CASE 
    WHEN lp.slug = 'fundamentos-marketing' THEN 'Conceptos básicos y fundamentos del marketing online'
    WHEN lp.slug = 'marketing-redes-sociales' THEN 'Domina Instagram para tu marca'
    WHEN lp.slug = 'casinos-online' THEN 'Marco legal y regulatorio para casinos online'
    ELSE 'Descripción del módulo inicial'
  END,
  1
FROM learning_paths lp
WHERE lp.is_active = true
ON CONFLICT DO NOTHING;

-- Insert initial videos data for modules
INSERT INTO tutorial_videos (module_id, title, description, video_url, duration, order_index)
SELECT 
  tm.id,
  CASE 
    WHEN lp.slug = 'fundamentos-marketing' THEN '¿Qué es el Marketing Digital?'
    WHEN lp.slug = 'marketing-redes-sociales' THEN 'Optimización de Perfil en Instagram'
    WHEN lp.slug = 'casinos-online' THEN 'Introducción al Marco Regulatorio'
    ELSE 'Video Introductorio'
  END,
  CASE 
    WHEN lp.slug = 'fundamentos-marketing' THEN 'Una introducción completa al mundo del marketing digital'
    WHEN lp.slug = 'marketing-redes-sociales' THEN 'Cómo crear un perfil que convierta'
    WHEN lp.slug = 'casinos-online' THEN 'Aspectos legales fundamentales'
    ELSE 'Video de introducción al tema'
  END,
  CASE 
    WHEN lp.slug = 'fundamentos-marketing' THEN 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    WHEN lp.slug = 'marketing-redes-sociales' THEN 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    WHEN lp.slug = 'casinos-online' THEN 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    ELSE 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  END,
  CASE 
    WHEN lp.slug = 'fundamentos-marketing' THEN '15:30'
    WHEN lp.slug = 'marketing-redes-sociales' THEN '18:45'
    WHEN lp.slug = 'casinos-online' THEN '22:15'
    ELSE '10:00'
  END,
  1
FROM tutorial_modules tm
JOIN learning_paths lp ON tm.learning_path_id = lp.id
WHERE tm.order_index = 1
ON CONFLICT DO NOTHING;

-- Add second module for fundamentos-marketing
INSERT INTO tutorial_modules (learning_path_id, title, description, order_index)
SELECT 
  lp.id,
  'Herramientas Esenciales',
  'Las herramientas que todo marketero digital debe conocer',
  2
FROM learning_paths lp
WHERE lp.slug = 'fundamentos-marketing'
ON CONFLICT DO NOTHING;

-- Add video for second module
INSERT INTO tutorial_videos (module_id, title, description, video_url, duration, order_index)
SELECT 
  tm.id,
  'Google Analytics para Principiantes',
  'Configuración y conceptos básicos de Analytics',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  '28:12',
  1
FROM tutorial_modules tm
JOIN learning_paths lp ON tm.learning_path_id = lp.id
WHERE lp.slug = 'fundamentos-marketing' AND tm.order_index = 2
ON CONFLICT DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE tutorial_modules IS 'Stores modules within learning paths';
COMMENT ON COLUMN tutorial_modules.learning_path_id IS 'Reference to the learning path this module belongs to';
COMMENT ON COLUMN tutorial_modules.title IS 'Display title of the module';
COMMENT ON COLUMN tutorial_modules.description IS 'Optional description of the module content';
COMMENT ON COLUMN tutorial_modules.order_index IS 'Order for displaying modules within a learning path';
COMMENT ON COLUMN tutorial_modules.is_active IS 'Whether this module is currently available';

COMMENT ON TABLE tutorial_videos IS 'Stores videos within tutorial modules';
COMMENT ON COLUMN tutorial_videos.module_id IS 'Reference to the module this video belongs to';
COMMENT ON COLUMN tutorial_videos.title IS 'Display title of the video';
COMMENT ON COLUMN tutorial_videos.description IS 'Optional description of the video content';
COMMENT ON COLUMN tutorial_videos.video_url IS 'URL to the video (YouTube, Vimeo, etc.)';
COMMENT ON COLUMN tutorial_videos.duration IS 'Video duration in mm:ss or hh:mm:ss format';
COMMENT ON COLUMN tutorial_videos.order_index IS 'Order for displaying videos within a module';
COMMENT ON COLUMN tutorial_videos.is_active IS 'Whether this video is currently available';