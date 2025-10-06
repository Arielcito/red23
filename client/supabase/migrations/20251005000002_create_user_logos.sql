-- Create user_logos table to store user uploaded logos
CREATE TABLE IF NOT EXISTS user_logos (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  logo_url TEXT NOT NULL,
  logo_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_logos_user_id ON user_logos(user_id);

-- Add comment to table
COMMENT ON TABLE user_logos IS 'Stores user uploaded logos in Supabase Storage';
COMMENT ON COLUMN user_logos.user_id IS 'Clerk user ID';
COMMENT ON COLUMN user_logos.logo_url IS 'Public URL of the logo in Supabase Storage';
COMMENT ON COLUMN user_logos.logo_path IS 'Storage path of the logo file';
