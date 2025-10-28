-- Add terms acceptance tracking to user_referrals table
-- This enables tracking of when users accept terms and which version they accepted

ALTER TABLE user_referrals
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS terms_version TEXT;

-- Create index for efficient querying of users who haven't accepted terms
CREATE INDEX IF NOT EXISTS idx_user_referrals_terms_acceptance
ON user_referrals(user_id, terms_accepted_at);

COMMENT ON COLUMN user_referrals.terms_accepted_at IS 'Timestamp when user accepted terms and privacy policy';
COMMENT ON COLUMN user_referrals.terms_version IS 'Version of terms accepted (e.g., "1.0", "2024-10-28")';
