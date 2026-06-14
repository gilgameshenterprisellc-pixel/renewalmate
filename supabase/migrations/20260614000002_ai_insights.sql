-- Phase 2: AI spending insights (Gemini), Plus tier only, cached per-user to control API cost

CREATE TABLE IF NOT EXISTS ai_insights (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ai insights" ON ai_insights
  FOR SELECT USING (auth.uid() = user_id);
