-- Migration 0006: Omni-Sport Architecture
-- Transform ForteTrain from single-sport to multi-sport platform
-- Author: Senior Software Architect
-- Date: 2026-03-30

-- ============================================
-- 1. ADD SPORT_TYPE COLUMN TO WORKOUTS
-- ============================================
-- This column defines which sport modality the workout belongs to
-- Values: 'bodybuilding', 'cycling', 'tennis', 'swimming', 'beach_tennis', 
--         'crossfit', 'running', 'pilates', 'physiotherapy'

ALTER TABLE workouts ADD COLUMN sport_type TEXT DEFAULT 'bodybuilding';

-- Create index for faster sport-specific queries
CREATE INDEX IF NOT EXISTS idx_workouts_sport_type ON workouts(sport_type);

-- ============================================
-- 2. ADD METRICS COLUMN (JSONB-LIKE) TO WORKOUTS
-- ============================================
-- Since D1 doesn't support true JSONB, we use TEXT with JSON validation
-- This column stores sport-specific metrics in JSON format
-- Examples:
--   Bodybuilding: {"exercises": [{"name": "Supino", "sets": 4, "reps": 12, "weight": 80}]}
--   Cycling: {"distance": "50km", "elevation": "800m", "zones": {"Z2": "30min", "Z3": "15min"}}
--   Tennis: {"drills": [{"type": "Serve", "duration": "30min", "focus": "Power"}]}

ALTER TABLE workouts ADD COLUMN metrics TEXT DEFAULT '{}';

-- ============================================
-- 3. ADD SPORT_TYPE TO STUDENTS (PRIMARY SPORT)
-- ============================================
-- Students can have a primary sport, but can train in multiple
ALTER TABLE students ADD COLUMN primary_sport TEXT DEFAULT 'bodybuilding';

CREATE INDEX IF NOT EXISTS idx_students_primary_sport ON students(primary_sport);

-- ============================================
-- 4. ADD SPORT_TYPE TO TENANTS (SPECIALIZATION)
-- ============================================
-- Personal Trainers can specify their primary specialization
-- This helps in onboarding and marketing
ALTER TABLE tenants ADD COLUMN specialization TEXT DEFAULT 'bodybuilding';
ALTER TABLE tenants ADD COLUMN supported_sports TEXT DEFAULT '["bodybuilding"]';

CREATE INDEX IF NOT EXISTS idx_tenants_specialization ON tenants(specialization);

-- ============================================
-- 5. CREATE SPORT_CONFIGS TABLE
-- ============================================
-- Central configuration for each sport modality
-- Stores colors, icons, metric templates, and UI themes
CREATE TABLE IF NOT EXISTS sport_configs (
  id TEXT PRIMARY KEY,
  sport_type TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  metric_template TEXT NOT NULL,
  ui_theme TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Seed default sport configurations
INSERT INTO sport_configs (id, sport_type, display_name, icon_name, primary_color, secondary_color, metric_template, ui_theme) VALUES
  ('sport-bodybuilding', 'bodybuilding', 'Musculação', 'dumbbell', '#CCFF00', '#99FF00', '{"exercises": [{"name": "", "sets": 0, "reps": 0, "weight": 0, "rest": 60}]}', '{"gradient": "linear-gradient(135deg, #CCFF00, #99FF00)", "iconBg": "#1A1A1A"}'),
  ('sport-cycling', 'cycling', 'Ciclismo', 'bike', '#00D4FF', '#0099CC', '{"distance": "", "elevation": "", "zones": {}, "avg_power": 0, "avg_cadence": 0}', '{"gradient": "linear-gradient(135deg, #00D4FF, #0099CC)", "iconBg": "#0A1929"}'),
  ('sport-tennis', 'tennis', 'Tênis', 'circle-dot', '#FFD700', '#FFA500', '{"drills": [{"type": "", "duration": "", "focus": "", "repetitions": 0}], "match_simulation": false}', '{"gradient": "linear-gradient(135deg, #FFD700, #FFA500)", "iconBg": "#1A1500"}'),
  ('sport-swimming', 'swimming', 'Natação', 'waves', '#00CED1', '#008B8B', '{"distance": "", "strokes": [], "intervals": [{"distance": "", "time": "", "rest": ""}], "technique_focus": ""}', '{"gradient": "linear-gradient(135deg, #00CED1, #008B8B)", "iconBg": "#001F1F"}'),
  ('sport-beach-tennis', 'beach_tennis', 'Beach Tennis', 'sun', '#FF6B35', '#FF4757', '{"drills": [{"type": "", "duration": "", "intensity": ""}], "game_scenarios": [], "serve_practice": ""}', '{"gradient": "linear-gradient(135deg, #FF6B35, #FF4757)", "iconBg": "#1F0A00"}'),
  ('sport-crossfit', 'crossfit', 'CrossFit', 'zap', '#FF0000', '#CC0000', '{"wod_type": "", "movements": [{"name": "", "reps": 0, "weight": 0}], "time_cap": "", "scaling_options": []}', '{"gradient": "linear-gradient(135deg, #FF0000, #CC0000)", "iconBg": "#1F0000"}'),
  ('sport-running', 'running', 'Corrida', 'footprints', '#7CFC00', '#32CD32', '{"distance": "", "pace": "", "intervals": [{"distance": "", "pace": "", "rest": ""}], "terrain": "", "elevation": ""}', '{"gradient": "linear-gradient(135deg, #7CFC00, #32CD32)", "iconBg": "#0F1F00"}'),
  ('sport-pilates', 'pilates', 'Pilates', 'circle', '#FF69B4', '#FF1493', '{"exercises": [{"name": "", "repetitions": 0, "duration": "", "breathing_pattern": ""}], "equipment": [], "focus_area": ""}', '{"gradient": "linear-gradient(135deg, #FF69B4, #FF1493)", "iconBg": "#1F0A15"}'),
  ('sport-physiotherapy', 'physiotherapy', 'Fisioterapia', 'heart-pulse', '#9370DB', '#6A5ACD', '{"exercises": [{"name": "", "sets": 0, "reps": 0, "hold_time": ""}], "pain_level": 0, "target_area": "", "contraindications": []}', '{"gradient": "linear-gradient(135deg, #9370DB, #6A5ACD)", "iconBg": "#0F0A1F"}');

CREATE INDEX IF NOT EXISTS idx_sport_configs_type ON sport_configs(sport_type);

-- ============================================
-- 6. ADD SPORT_TYPE TO AI_LOGS
-- ============================================
-- Track which sport modality generated the AI request
ALTER TABLE ai_logs ADD COLUMN sport_type TEXT DEFAULT 'bodybuilding';

CREATE INDEX IF NOT EXISTS idx_ai_logs_sport_type ON ai_logs(sport_type);

-- ============================================
-- 7. CREATE SPORT_METRICS_HISTORY TABLE
-- ============================================
-- Track evolution of sport-specific metrics over time
-- Examples: Power output progression in cycling, serve speed in tennis
CREATE TABLE IF NOT EXISTS sport_metrics_history (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  sport_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value TEXT NOT NULL,
  unit TEXT,
  measured_at INTEGER DEFAULT (strftime('%s', 'now')),
  notes TEXT,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sport_metrics_student ON sport_metrics_history(student_id);
CREATE INDEX IF NOT EXISTS idx_sport_metrics_sport ON sport_metrics_history(sport_type);
CREATE INDEX IF NOT EXISTS idx_sport_metrics_measured ON sport_metrics_history(measured_at);

-- ============================================
-- 8. UPDATE WORKOUT_SESSIONS FOR SPORT TRACKING
-- ============================================
-- Add sport_type to track which sport was trained
ALTER TABLE workout_sessions ADD COLUMN sport_type TEXT DEFAULT 'bodybuilding';
ALTER TABLE workout_sessions ADD COLUMN metrics_achieved TEXT DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_sessions_sport_type ON workout_sessions(sport_type);

-- ============================================
-- 9. MIGRATION NOTES
-- ============================================
-- This migration transforms ForteTrain into an Omni-Sport platform
-- Key changes:
-- 1. workouts.sport_type: Defines workout modality
-- 2. workouts.metrics: Flexible JSON storage for sport-specific data
-- 3. sport_configs: Central repository for sport configurations
-- 4. sport_metrics_history: Track performance evolution
-- 5. Indexes: Optimized for multi-sport queries
--
-- IMPORTANT: Frontend must now read sport_type and render UI dynamically
-- IMPORTANT: AI prompts must include sport_type for proper workout generation
