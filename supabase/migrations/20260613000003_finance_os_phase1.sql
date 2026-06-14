-- Phase 1: generalize subscriptions into "trackables" (bills, subscriptions, licenses, one-time items)
-- plus price history, budgets, net worth, and goals.

-- 1. Generalize subscriptions table
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS item_type text NOT NULL DEFAULT 'subscription'
    CHECK (item_type IN ('subscription', 'bill', 'license', 'one_time'));

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS is_trial boolean NOT NULL DEFAULT false;

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS trial_ends_at date;

-- allow one_time billing cycle (no recurring renewal)
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_billing_cycle_check;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_billing_cycle_check
  CHECK (billing_cycle IN ('weekly', 'monthly', 'yearly', 'one_time'));

-- 2. Price history (track amount changes over time)
CREATE TABLE IF NOT EXISTS subscription_price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  old_amount numeric(10,2) NOT NULL,
  new_amount numeric(10,2) NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS subscription_price_history_sub_idx ON subscription_price_history(subscription_id);

ALTER TABLE subscription_price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own price history" ON subscription_price_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own price history" ON subscription_price_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Budget categories (monthly caps per category)
CREATE TABLE IF NOT EXISTS budget_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  monthly_cap numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, category)
);

ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own budget categories" ON budget_categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budget categories" ON budget_categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budget categories" ON budget_categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budget categories" ON budget_categories
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Net worth items (assets and debts)
CREATE TABLE IF NOT EXISTS net_worth_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('asset', 'debt')),
  category text NOT NULL DEFAULT 'other',
  value numeric(12,2) NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS net_worth_items_user_idx ON net_worth_items(user_id);

ALTER TABLE net_worth_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own net worth items" ON net_worth_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own net worth items" ON net_worth_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own net worth items" ON net_worth_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own net worth items" ON net_worth_items
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Goals
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  target_amount numeric(12,2) NOT NULL DEFAULT 0,
  current_amount numeric(12,2) NOT NULL DEFAULT 0,
  target_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS goals_user_idx ON goals(user_id);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Weekly digest opt-out + push subscription support
CREATE TABLE IF NOT EXISTS user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  weekly_digest_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS push_subscriptions_user_idx ON push_subscriptions(user_id);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own push subscriptions" ON push_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own push subscriptions" ON push_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own push subscriptions" ON push_subscriptions
  FOR DELETE USING (auth.uid() = user_id);
