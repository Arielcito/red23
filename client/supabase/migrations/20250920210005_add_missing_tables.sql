-- Create the missing tables for the Red23 application

-- Table: automatic_prompts
-- Used for storing automatic prompts that appear in the chat interface
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

-- Table: user_referrals
-- Used for managing user referral codes and relationships
CREATE TABLE IF NOT EXISTS user_referrals (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  referred_by_code TEXT,
  referred_by_user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Table: referral_tracking
-- Used for tracking referral statistics and status
CREATE TABLE IF NOT EXISTS referral_tracking (
  id BIGSERIAL PRIMARY KEY,
  referrer_user_id TEXT NOT NULL,
  referred_user_id TEXT NOT NULL,
  referral_code TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_referrals_user_id ON user_referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_referral_code ON user_referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_tracking_referrer ON referral_tracking(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_tracking_referred ON referral_tracking(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_automatic_prompts_active ON automatic_prompts(is_active);
CREATE INDEX IF NOT EXISTS idx_automatic_prompts_order ON automatic_prompts(order_index);

-- Enable Row Level Security (RLS) for security
ALTER TABLE automatic_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_tracking ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
-- These allow authenticated users to read and service role to manage everything

-- Policies for automatic_prompts
CREATE POLICY "Enable read access for authenticated users" 
ON automatic_prompts FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for service role" 
ON automatic_prompts FOR ALL 
USING (auth.role() = 'service_role');

-- Policies for user_referrals  
CREATE POLICY "Users can view their own referrals" 
ON user_referrals FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for service role on user_referrals" 
ON user_referrals FOR ALL 
USING (auth.role() = 'service_role');

-- Policies for referral_tracking
CREATE POLICY "Users can view their own tracking" 
ON referral_tracking FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for service role on referral_tracking" 
ON referral_tracking FOR ALL 
USING (auth.role() = 'service_role');

-- Insert some initial data for automatic_prompts if the table is empty
INSERT INTO automatic_prompts (title, content, category, is_active, order_index)
SELECT 
  'Banner promocional para casino',
  'Crear un banner promocional atractivo para nuestro casino online con colores vibrantes y elementos llamativos',
  'general',
  true,
  1
WHERE NOT EXISTS (SELECT 1 FROM automatic_prompts LIMIT 1);

INSERT INTO automatic_prompts (title, content, category, is_active, order_index)
SELECT 
  'Jackpot progresivo',
  'Diseñar una imagen para promocionar nuestro jackpot progresivo con números grandes y efectos brillantes',
  'jackpots',
  true,
  2
WHERE (SELECT COUNT(*) FROM automatic_prompts) < 2;