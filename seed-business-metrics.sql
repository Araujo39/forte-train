-- Seed Business Metrics for Super Admin Dashboard Demo
-- Populates subscriptions, payments, tenant metrics, and platform stats

-- ======================================
-- 0. CREATE DEMO TENANTS FIRST
-- ======================================
-- Create additional demo tenants (simulate marketplace)
INSERT OR IGNORE INTO tenants (id, name, email, password_hash, subdomain, plan_type, role, created_at) VALUES
  ('tenant-demo-2', 'Carla Lima', 'carla.lima@fortetrain.app', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'carla-lima', 'start', 'personal', strftime('%s', 'now', '-5 days')),
  ('tenant-demo-3', 'Bruno Costa', 'bruno.costa@fortetrain.app', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'bruno-costa', 'pro', 'personal', strftime('%s', 'now', '-90 days')),
  ('tenant-demo-4', 'Fernanda Souza', 'fernanda.souza@fortetrain.app', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'fernanda-souza', 'start', 'personal', strftime('%s', 'now', '-120 days')),
  ('tenant-demo-5', 'Ricardo Mendes', 'ricardo.mendes@fortetrain.app', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'ricardo-mendes', 'enterprise', 'personal', strftime('%s', 'now', '-180 days'));

-- ======================================
-- 1. SUBSCRIPTIONS (Associate tenants with plans)
-- ======================================
INSERT OR REPLACE INTO subscriptions (id, tenant_id, plan_type, status, mrr, billing_cycle, start_date, trial_ends_at) VALUES
  ('sub-demo-1', 'tenant-demo-1', 'pro', 'active', 199.90, 'monthly', strftime('%s', 'now', '-60 days'), NULL);

-- Add more demo subscriptions (simulating real data)
INSERT OR REPLACE INTO subscriptions (id, tenant_id, plan_type, status, mrr, billing_cycle, start_date, trial_ends_at) VALUES
  ('sub-demo-2', 'tenant-demo-2', 'start', 'trial', 99.90, 'monthly', strftime('%s', 'now', '-5 days'), strftime('%s', 'now', '+9 days')),
  ('sub-demo-3', 'tenant-demo-3', 'pro', 'active', 199.90, 'monthly', strftime('%s', 'now', '-90 days'), NULL),
  ('sub-demo-4', 'tenant-demo-4', 'start', 'delinquent', 99.90, 'monthly', strftime('%s', 'now', '-120 days'), NULL),
  ('sub-demo-5', 'tenant-demo-5', 'enterprise', 'active', 499.90, 'monthly', strftime('%s', 'now', '-180 days'), NULL);

-- ======================================
-- 2. PAYMENTS (Transaction history)
-- ======================================
INSERT OR REPLACE INTO payments (id, tenant_id, subscription_id, amount, status, payment_method, reference, paid_at, created_at) VALUES
  ('pay-1', 'tenant-demo-1', 'sub-demo-1', 199.90, 'completed', 'credit_card', 'INV-2026-001', strftime('%s', 'now', '-30 days'), strftime('%s', 'now', '-30 days')),
  ('pay-2', 'tenant-demo-1', 'sub-demo-1', 199.90, 'completed', 'credit_card', 'INV-2026-002', strftime('%s', 'now', '-60 days'), strftime('%s', 'now', '-60 days')),
  ('pay-3', 'tenant-demo-3', 'sub-demo-3', 199.90, 'completed', 'pix', 'INV-2026-003', strftime('%s', 'now', '-30 days'), strftime('%s', 'now', '-30 days')),
  ('pay-4', 'tenant-demo-3', 'sub-demo-3', 199.90, 'completed', 'pix', 'INV-2026-004', strftime('%s', 'now', '-60 days'), strftime('%s', 'now', '-60 days')),
  ('pay-5', 'tenant-demo-5', 'sub-demo-5', 499.90, 'completed', 'credit_card', 'INV-2026-005', strftime('%s', 'now', '-30 days'), strftime('%s', 'now', '-30 days')),
  ('pay-6', 'tenant-demo-4', 'sub-demo-4', 99.90, 'failed', 'credit_card', 'INV-2026-006', NULL, strftime('%s', 'now', '-5 days'));

-- ======================================
-- 3. TENANT METRICS (Health Scores)
-- ======================================
INSERT OR REPLACE INTO tenant_metrics (id, tenant_id, total_students, active_students, total_workouts_created, ai_workouts_generated, vision_requests, last_activity_date, last_ai_usage, last_vision_usage, health_score, health_status) VALUES
  ('metric-1', 'tenant-demo-1', 3, 2, 12, 8, 5, strftime('%s', 'now', '-2 days'), strftime('%s', 'now', '-3 days'), strftime('%s', 'now', '-1 day'), 85, 'healthy'),
  ('metric-2', 'tenant-demo-2', 1, 0, 2, 1, 0, strftime('%s', 'now', '-5 days'), strftime('%s', 'now', '-5 days'), NULL, 45, 'at_risk'),
  ('metric-3', 'tenant-demo-3', 15, 12, 45, 30, 20, strftime('%s', 'now', '-1 day'), strftime('%s', 'now', '-2 days'), strftime('%s', 'now', '-1 day'), 95, 'healthy'),
  ('metric-4', 'tenant-demo-4', 5, 0, 8, 3, 1, strftime('%s', 'now', '-45 days'), strftime('%s', 'now', '-60 days'), strftime('%s', 'now', '-50 days'), 15, 'inactive'),
  ('metric-5', 'tenant-demo-5', 50, 40, 120, 80, 60, strftime('%s', 'now'), strftime('%s', 'now', '-1 day'), strftime('%s', 'now'), 98, 'healthy');

-- ======================================
-- 4. PLATFORM STATS (Today's snapshot)
-- ======================================
INSERT OR REPLACE INTO platform_stats (
  id, stat_date, total_tenants, active_tenants, trial_tenants, 
  delinquent_tenants, cancelled_tenants, total_students, 
  total_workouts, ai_requests_count, vision_requests_count, 
  mrr, arr, churn_count
) VALUES (
  'stats-today',
  strftime('%s', 'now', 'start of day'),
  5,  -- total_tenants
  3,  -- active_tenants (sub-demo-1, 3, 5)
  1,  -- trial_tenants (sub-demo-2)
  1,  -- delinquent_tenants (sub-demo-4)
  0,  -- cancelled_tenants (none yet)
  74, -- total_students (3+1+15+5+50)
  187, -- total_workouts (12+2+45+8+120)
  122, -- ai_requests_count (8+1+30+3+80)
  86,  -- vision_requests_count (5+0+20+1+60)
  999.60, -- MRR (199.90 + 99.90 + 199.90 + 99.90 + 499.90 - delinquent not counted)
  11995.20, -- ARR (MRR * 12)
  0   -- churn_count (no cancellations in last 30 days)
);

-- ======================================
-- 5. AI ERROR LOGS (Sample errors for monitoring)
-- ======================================
INSERT OR REPLACE INTO ai_error_logs (id, tenant_id, error_type, error_message, api_endpoint, request_payload, response_status, resolved, created_at) VALUES
  ('err-1', 'tenant-demo-2', 'openai_api', 'Rate limit exceeded: 429 Too Many Requests', '/v1/chat/completions', '{"model":"gpt-4o-mini","messages":[...]}', 429, 1, strftime('%s', 'now', '-10 days')),
  ('err-2', 'tenant-demo-3', 'youtube_api', 'Invalid API key', '/youtube/v3/search', '{"q":"arnold sports festival","part":"snippet"}', 403, 0, strftime('%s', 'now', '-3 days')),
  ('err-3', 'tenant-demo-4', 'vision_processing', 'Image analysis failed: timeout', '/v1/chat/completions', '{"model":"gpt-4o","messages":[{"role":"user","content":[{"type":"image_url"}]}]}', 504, 0, strftime('%s', 'now', '-1 day')),
  ('err-4', 'tenant-demo-1', 'workout_generation', 'OpenAI API timeout', '/v1/chat/completions', '{"model":"gpt-4o-mini"}', 504, 1, strftime('%s', 'now', '-5 days'));
