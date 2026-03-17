-- Migration 0003: Add Business Metrics and Platform Administration
-- Adds tables for financial tracking, plan management, impersonation logs, and AI monitoring

-- ======================================
-- 1. SUBSCRIPTIONS TABLE (Financial Tracking)
-- ======================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  plan_type TEXT NOT NULL, -- 'start', 'pro', 'enterprise'
  status TEXT NOT NULL, -- 'active', 'trial', 'delinquent', 'cancelled'
  mrr REAL NOT NULL, -- Monthly Recurring Revenue in BRL
  billing_cycle TEXT NOT NULL, -- 'monthly', 'annual'
  start_date INTEGER NOT NULL,
  end_date INTEGER,
  trial_ends_at INTEGER,
  cancelled_at INTEGER,
  stripe_subscription_id TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant ON subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan_type);

-- ======================================
-- 2. PAYMENTS TABLE (Transaction History)
-- ======================================
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  subscription_id TEXT,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'BRL',
  status TEXT NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
  payment_method TEXT, -- 'credit_card', 'pix', 'boleto'
  stripe_payment_id TEXT,
  reference TEXT, -- Invoice number or reference
  paid_at INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_payments_tenant ON payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(paid_at);

-- ======================================
-- 3. PLAN LIMITS TABLE (Dynamic Pricing)
-- ======================================
CREATE TABLE IF NOT EXISTS plan_limits (
  id TEXT PRIMARY KEY,
  plan_type TEXT UNIQUE NOT NULL, -- 'start', 'pro', 'enterprise'
  name TEXT NOT NULL,
  price_monthly REAL NOT NULL,
  price_annual REAL NOT NULL,
  max_students INTEGER NOT NULL,
  max_ai_requests INTEGER, -- Per month, NULL = unlimited
  max_vision_requests INTEGER, -- Per month, NULL = unlimited
  features TEXT, -- JSON array of features
  is_active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Seed default plans
INSERT OR IGNORE INTO plan_limits (id, plan_type, name, price_monthly, price_annual, max_students, max_ai_requests, max_vision_requests, features) VALUES
  ('plan-start', 'start', 'Plano Start', 99.90, 999.00, 30, 100, 50, '["AI Workout Generator", "Vision Module", "WhatsApp Notifications", "Basic Analytics"]'),
  ('plan-pro', 'pro', 'Plano Pro', 199.90, 1999.00, 100, 500, 200, '["AI Workout Generator", "Vision Module", "WhatsApp Notifications", "Advanced Analytics", "Custom Branding", "Priority Support"]'),
  ('plan-enterprise', 'enterprise', 'Plano Enterprise', 499.90, 4999.00, -1, -1, -1, '["AI Workout Generator", "Vision Module", "WhatsApp Notifications", "Advanced Analytics", "Custom Branding", "Priority Support", "API Access", "Unlimited Students", "Unlimited AI Requests", "Dedicated Account Manager"]');

-- ======================================
-- 4. IMPERSONATION LOGS (Security Audit)
-- ======================================
CREATE TABLE IF NOT EXISTS impersonation_logs (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  target_tenant_id TEXT NOT NULL,
  target_tenant_email TEXT NOT NULL,
  start_time INTEGER NOT NULL,
  end_time INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  actions_performed TEXT, -- JSON array of actions
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_impersonation_admin ON impersonation_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_impersonation_target ON impersonation_logs(target_tenant_id);
CREATE INDEX IF NOT EXISTS idx_impersonation_date ON impersonation_logs(start_time);

-- ======================================
-- 5. AI ERROR LOGS (Monitoring)
-- ======================================
CREATE TABLE IF NOT EXISTS ai_error_logs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT,
  error_type TEXT NOT NULL, -- 'openai_api', 'youtube_api', 'vision_processing', 'workout_generation'
  error_message TEXT NOT NULL,
  api_endpoint TEXT,
  request_payload TEXT, -- JSON
  response_status INTEGER,
  stack_trace TEXT,
  resolved INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_ai_errors_type ON ai_error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_ai_errors_tenant ON ai_error_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_errors_date ON ai_error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_errors_resolved ON ai_error_logs(resolved);

-- ======================================
-- 6. TENANT METRICS (Health Score)
-- ======================================
CREATE TABLE IF NOT EXISTS tenant_metrics (
  id TEXT PRIMARY KEY,
  tenant_id TEXT UNIQUE NOT NULL,
  total_students INTEGER DEFAULT 0,
  active_students INTEGER DEFAULT 0, -- Worked out in last 7 days
  total_workouts_created INTEGER DEFAULT 0,
  ai_workouts_generated INTEGER DEFAULT 0,
  vision_requests INTEGER DEFAULT 0,
  last_activity_date INTEGER,
  last_ai_usage INTEGER,
  last_vision_usage INTEGER,
  health_score REAL DEFAULT 0, -- 0-100 score
  health_status TEXT DEFAULT 'healthy', -- 'healthy', 'at_risk', 'inactive'
  calculated_at INTEGER DEFAULT (strftime('%s', 'now')),
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tenant_metrics_health ON tenant_metrics(health_status);
CREATE INDEX IF NOT EXISTS idx_tenant_metrics_score ON tenant_metrics(health_score);

-- ======================================
-- 7. PLATFORM STATS (Cached Aggregates)
-- ======================================
CREATE TABLE IF NOT EXISTS platform_stats (
  id TEXT PRIMARY KEY,
  stat_date INTEGER NOT NULL, -- Unix timestamp (day granularity)
  total_tenants INTEGER DEFAULT 0,
  active_tenants INTEGER DEFAULT 0,
  trial_tenants INTEGER DEFAULT 0,
  delinquent_tenants INTEGER DEFAULT 0,
  cancelled_tenants INTEGER DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  total_workouts INTEGER DEFAULT 0,
  ai_requests_count INTEGER DEFAULT 0,
  vision_requests_count INTEGER DEFAULT 0,
  mrr REAL DEFAULT 0, -- Total Monthly Recurring Revenue
  arr REAL DEFAULT 0, -- Total Annual Recurring Revenue
  churn_count INTEGER DEFAULT 0, -- Cancellations in last 30 days
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_platform_stats_date ON platform_stats(stat_date);
