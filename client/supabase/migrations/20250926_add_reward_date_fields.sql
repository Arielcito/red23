-- Add fields for custom reward dates to reward_settings table

ALTER TABLE reward_settings 
ADD COLUMN daily_prize_draw_date TIMESTAMPTZ NULL,
ADD COLUMN monthly_prize_draw_date TIMESTAMPTZ NULL,
ADD COLUMN use_custom_dates BOOLEAN NOT NULL DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN reward_settings.daily_prize_draw_date IS 'Custom date/time for next daily prize draw';
COMMENT ON COLUMN reward_settings.monthly_prize_draw_date IS 'Custom date/time for next monthly prize draw';
COMMENT ON COLUMN reward_settings.use_custom_dates IS 'Whether to use custom dates instead of automatic calculation';

-- Add constraints to ensure future dates only
ALTER TABLE reward_settings 
ADD CONSTRAINT check_daily_prize_draw_date_future 
CHECK (daily_prize_draw_date IS NULL OR daily_prize_draw_date > NOW());

ALTER TABLE reward_settings 
ADD CONSTRAINT check_monthly_prize_draw_date_future 
CHECK (monthly_prize_draw_date IS NULL OR monthly_prize_draw_date > NOW());