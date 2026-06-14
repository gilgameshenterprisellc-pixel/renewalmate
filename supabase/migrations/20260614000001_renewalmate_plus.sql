-- Phase 2: RenewalMate Plus paid tier (Stripe) + Plaid bank sync support

ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free'
    CHECK (plan IN ('free', 'plus'));

ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS stripe_customer_id text;

ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS plaid_enabled boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS user_settings_stripe_customer_idx ON user_settings(stripe_customer_id);

-- Plaid linked bank items (Plus tier only, opt-in)
CREATE TABLE IF NOT EXISTS plaid_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id text NOT NULL UNIQUE,
  access_token text NOT NULL,
  institution_name text,
  cursor text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS plaid_items_user_idx ON plaid_items(user_id);

ALTER TABLE plaid_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plaid items" ON plaid_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plaid items" ON plaid_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plaid items" ON plaid_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plaid items" ON plaid_items
  FOR DELETE USING (auth.uid() = user_id);

-- Track which trackables originated from a Plaid sync (vs manual entry)
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS plaid_transaction_id text;

CREATE INDEX IF NOT EXISTS subscriptions_plaid_transaction_idx ON subscriptions(plaid_transaction_id);
