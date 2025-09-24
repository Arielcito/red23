-- Create learning_paths table for managing tutorial routes
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Principiante', 'Intermedio', 'Avanzado')),
  duration TEXT NOT NULL, -- e.g., "4 cursos • 20 horas"
  course_count INTEGER NOT NULL DEFAULT 0,
  icon TEXT NOT NULL DEFAULT '📚', -- emoji or icon name
  color_scheme TEXT NOT NULL DEFAULT 'primary' CHECK (color_scheme IN ('primary', 'secondary', 'tertiary')),
  slug TEXT NOT NULL UNIQUE, -- for URL routing
  image_url TEXT, -- optional image for the learning path
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_learning_paths_active ON learning_paths(is_active);
CREATE INDEX IF NOT EXISTS idx_learning_paths_featured ON learning_paths(is_featured);
CREATE INDEX IF NOT EXISTS idx_learning_paths_order ON learning_paths(display_order);
CREATE INDEX IF NOT EXISTS idx_learning_paths_slug ON learning_paths(slug);
CREATE INDEX IF NOT EXISTS idx_learning_paths_level ON learning_paths(level);

-- Enable Row Level Security (RLS) for security
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;

-- Create policies for learning_paths
CREATE POLICY "Enable read access for all users" 
ON learning_paths FOR SELECT 
USING (is_active = true);

CREATE POLICY "Enable all access for service role" 
ON learning_paths FOR ALL 
USING (auth.role() = 'service_role');

-- Insert initial learning paths data
INSERT INTO learning_paths (title, description, level, duration, course_count, icon, color_scheme, slug, is_featured, display_order)
VALUES 
  (
    'Fundamentos del Marketing Digital',
    'Conceptos básicos, herramientas esenciales y primeras estrategias',
    'Principiante',
    '4 cursos • 20 horas',
    4,
    '🎯',
    'primary',
    'fundamentos-marketing',
    true,
    1
  ),
  (
    'Marketing en Redes Sociales',
    'Estrategias en Instagram, Facebook, TikTok y plataformas emergentes',
    'Intermedio',
    '5 cursos • 25 horas',
    5,
    '📱',
    'secondary',
    'marketing-redes-sociales',
    true,
    2
  ),
  (
    'Especialista en Casinos Online',
    'Estrategias avanzadas, compliance y optimización de conversiones',
    'Avanzado',
    '6 cursos • 35 horas',
    6,
    '🎰',
    'tertiary',
    'casinos-online',
    true,
    3
  )
ON CONFLICT (slug) DO NOTHING;

-- Add trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_learning_paths_updated_at 
BEFORE UPDATE ON learning_paths 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE learning_paths IS 'Stores learning paths/routes for the tutorial system';
COMMENT ON COLUMN learning_paths.title IS 'Display title of the learning path';
COMMENT ON COLUMN learning_paths.description IS 'Short description explaining what the learning path covers';
COMMENT ON COLUMN learning_paths.level IS 'Difficulty level: Principiante, Intermedio, Avanzado';
COMMENT ON COLUMN learning_paths.duration IS 'Human readable duration (e.g., "4 cursos • 20 horas")';
COMMENT ON COLUMN learning_paths.course_count IS 'Number of courses in this learning path';
COMMENT ON COLUMN learning_paths.icon IS 'Icon to display (emoji or icon name)';
COMMENT ON COLUMN learning_paths.color_scheme IS 'Color scheme for UI: primary, secondary, tertiary';
COMMENT ON COLUMN learning_paths.slug IS 'URL-friendly identifier for routing';
COMMENT ON COLUMN learning_paths.image_url IS 'Optional image URL for the learning path';
COMMENT ON COLUMN learning_paths.is_featured IS 'Whether to feature this path prominently';
COMMENT ON COLUMN learning_paths.is_active IS 'Whether this path is currently available';
COMMENT ON COLUMN learning_paths.display_order IS 'Order for displaying paths (lower = first)';
