-- Red23 Notifications System - Database Schema
-- Execute this SQL in Supabase SQL Editor

-- 1. Helper function for updating updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Main notifications table (stores global notification content)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('success', 'warning', 'info', 'error', 'prize')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 3. User-specific notification state (junction table)
CREATE TABLE user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure one record per user per notification
  UNIQUE(user_id, notification_id)
);

-- Indexes for efficient querying
CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_notification_id ON user_notifications(notification_id);
CREATE INDEX idx_user_notifications_user_unread ON user_notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX idx_user_notifications_user_not_deleted ON user_notifications(user_id) WHERE deleted_at IS NULL;

-- Combined index for the most common query (user's unread, not deleted)
CREATE INDEX idx_user_notifications_active ON user_notifications(user_id, created_at DESC)
  WHERE read_at IS NULL AND deleted_at IS NULL;

-- 4. Function to get all unique user IDs from the platform
CREATE OR REPLACE FUNCTION get_all_user_ids()
RETURNS SETOF TEXT AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT user_id::TEXT FROM user_referrals
  UNION
  SELECT DISTINCT user_id::TEXT FROM user_logos
  UNION
  SELECT DISTINCT user_id::TEXT FROM user_notifications
  ORDER BY 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verification queries (optional - run to test)
-- SELECT * FROM notifications LIMIT 5;
-- SELECT * FROM user_notifications LIMIT 5;
-- SELECT * FROM get_all_user_ids() LIMIT 10;
