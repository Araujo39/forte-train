-- FitFlow SaaS Database Schema
-- Multi-tenant Architecture with Row Level Security

-- 1. TABELA DE PERSONAIS (TENANTS)
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  subdomain TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan_status TEXT DEFAULT 'trial',
  plan_type TEXT DEFAULT 'start',
  branding_colors TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_tenants_email ON tenants(email);

-- 2. TABELA DE ALUNOS (VINCULADOS AO TENANT)
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  goal TEXT,
  physical_data TEXT,
  status TEXT DEFAULT 'active',
  last_workout_date INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_students_tenant ON students(tenant_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_last_workout ON students(last_workout_date);

-- 3. TABELA DE TREINOS (GERADOS POR IA)
CREATE TABLE IF NOT EXISTS workouts (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  exercises TEXT NOT NULL,
  ai_logic_used TEXT,
  is_active INTEGER DEFAULT 1,
  workout_type TEXT,
  duration_minutes INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_workouts_student ON workouts(student_id);
CREATE INDEX IF NOT EXISTS idx_workouts_tenant ON workouts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_workouts_active ON workouts(is_active);

-- 4. TABELA DE LOGS DE NOTIFICAÇÕES
CREATE TABLE IF NOT EXISTS notifications_log (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  channel TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  sent_at INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_student ON notifications_log(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_tenant ON notifications_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications_log(status);

-- 5. CACHE DE EQUIPAMENTOS IDENTIFICADOS (AI VISION)
CREATE TABLE IF NOT EXISTS ai_equipment_cache (
  id TEXT PRIMARY KEY,
  image_hash TEXT UNIQUE NOT NULL,
  equipment_name TEXT NOT NULL,
  muscle_groups TEXT,
  youtube_video_url TEXT,
  youtube_query TEXT,
  confidence_score REAL,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Index for faster hash lookups
CREATE INDEX IF NOT EXISTS idx_equipment_hash ON ai_equipment_cache(image_hash);

-- 6. TABELA DE LOGS DE IA (CONTROLE DE CUSTOS)
CREATE TABLE IF NOT EXISTS ai_logs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  token_usage INTEGER,
  cost_usd REAL,
  purpose TEXT NOT NULL,
  model TEXT,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Indexes for cost tracking
CREATE INDEX IF NOT EXISTS idx_ai_logs_tenant ON ai_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_purpose ON ai_logs(purpose);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created ON ai_logs(created_at);

-- 7. TABELA DE SESSÕES DE TREINO (TRACKING DE PROGRESSO)
CREATE TABLE IF NOT EXISTS workout_sessions (
  id TEXT PRIMARY KEY,
  workout_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  exercises_completed TEXT,
  duration_minutes INTEGER,
  notes TEXT,
  completed_at INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Indexes for progress tracking
CREATE INDEX IF NOT EXISTS idx_sessions_workout ON workout_sessions(workout_id);
CREATE INDEX IF NOT EXISTS idx_sessions_student ON workout_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_completed ON workout_sessions(completed_at);
