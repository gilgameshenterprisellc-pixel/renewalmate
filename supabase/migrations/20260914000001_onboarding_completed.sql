ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Existing users shouldn't suddenly see a "welcome" tour they never asked for.
UPDATE user_settings SET onboarding_completed = TRUE WHERE onboarding_completed IS DISTINCT FROM TRUE;
