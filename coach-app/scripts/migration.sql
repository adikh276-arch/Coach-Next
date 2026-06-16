-- ============================================================
-- COACH App — Full Database Schema
-- Neon PostgreSQL Migration
-- ============================================================

-- 0. Shared Users Table
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 1. COACH JOURNEY — Assessments & Onboarding
-- ============================================================
CREATE TABLE IF NOT EXISTS coach_assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_coach_assess_user ON coach_assessment_results(user_id);

CREATE TABLE IF NOT EXISTS coach_assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  result_id UUID NOT NULL REFERENCES coach_assessment_results(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  value INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_coach_answers_result ON coach_assessment_answers(result_id);

CREATE TABLE IF NOT EXISTS coach_onboarding_progress (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  set_focus_areas BOOLEAN DEFAULT FALSE,
  rate_focus_areas BOOLEAN DEFAULT FALSE,
  attend_first_session BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. COACHING AREAS — Exercise Sessions & Responses
-- ============================================================
CREATE TABLE IF NOT EXISTS coaching_exercise_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coaching_area_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user ON coaching_exercise_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_area ON coaching_exercise_sessions(coaching_area_id);

CREATE TABLE IF NOT EXISTS coaching_exercise_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES coaching_exercise_sessions(id) ON DELETE CASCADE,
  field_id TEXT NOT NULL,
  field_label TEXT,
  field_type TEXT,
  response_text TEXT,
  response_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, field_id)
);

CREATE TABLE IF NOT EXISTS coaching_special_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES coaching_exercise_sessions(id) ON DELETE CASCADE UNIQUE,
  special_type TEXT NOT NULL,
  response_data JSONB NOT NULL DEFAULT '{}',
  score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. COACHING INTEGRATION — Daily Entries
-- ============================================================
CREATE TABLE IF NOT EXISTS coaching_integration_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  implemented BOOLEAN DEFAULT FALSE,
  implementation_depth TEXT,
  accountability_score INTEGER DEFAULT 0,
  session_value INTEGER DEFAULT 0,
  next_action TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);
CREATE INDEX IF NOT EXISTS idx_coaching_int_user ON coaching_integration_entries(user_id);

-- ============================================================
-- 4. CONFIDENCE & IDENTITY — Daily Check-In
-- ============================================================
CREATE TABLE IF NOT EXISTS confidence_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  confidence_score NUMERIC NOT NULL DEFAULT 5,
  decisiveness_score NUMERIC NOT NULL DEFAULT 5,
  avoided BOOLEAN DEFAULT FALSE,
  avoidance_reason TEXT,
  custom_reason_text TEXT,
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);
CREATE INDEX IF NOT EXISTS idx_confidence_user ON confidence_entries(user_id);

-- ============================================================
-- 5. DAILY FOCUS — Performance Tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS performance_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  execution_score NUMERIC NOT NULL DEFAULT 5,
  mental_clarity NUMERIC NOT NULL DEFAULT 5,
  priority_completed BOOLEAN DEFAULT FALSE,
  priority_completion_text TEXT,
  primary_blocker TEXT,
  custom_blocker_text TEXT,
  productivity_depth TEXT CHECK (productivity_depth IN ('surface', 'focused', 'deep', 'custom', '')),
  custom_work_depth_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);
CREATE INDEX IF NOT EXISTS idx_performance_user ON performance_entries(user_id);

-- ============================================================
-- 6. EMOTIONAL REGULATION — Emotion Tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS emotional_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  timestamp BIGINT NOT NULL,
  stability NUMERIC NOT NULL DEFAULT 5,
  stress NUMERIC NOT NULL DEFAULT 5,
  challenging_situation BOOLEAN DEFAULT FALSE,
  response_quality TEXT CHECK (response_quality IN ('Reactive', 'Managed', 'Composed', 'Strategic')),
  context TEXT,
  thoughts TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);
CREATE INDEX IF NOT EXISTS idx_emotional_user ON emotional_entries(user_id);

-- ============================================================
-- 7. GOAL MOMENTUM — Goals & Daily Entries
-- ============================================================
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'learning',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id);

CREATE TABLE IF NOT EXISTS goal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  drive NUMERIC DEFAULT 5,
  energy NUMERIC DEFAULT 5,
  focus NUMERIC DEFAULT 5,
  clarity NUMERIC DEFAULT 5,
  took_action BOOLEAN DEFAULT FALSE,
  impact_level NUMERIC DEFAULT 5,
  action_note TEXT DEFAULT '',
  blocker TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(goal_id, date)
);
CREATE INDEX IF NOT EXISTS idx_goal_entries_goal ON goal_entries(goal_id);
