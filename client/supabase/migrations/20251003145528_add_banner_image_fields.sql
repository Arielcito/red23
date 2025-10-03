ALTER TABLE reward_settings
ADD COLUMN IF NOT EXISTS banner_image_url TEXT,
ADD COLUMN IF NOT EXISTS banner_use_image BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN reward_settings.banner_image_url IS 'URL de la imagen personalizada para el banner';
COMMENT ON COLUMN reward_settings.banner_use_image IS 'Indica si se debe usar imagen en lugar del degradado de color';

