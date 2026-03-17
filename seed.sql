-- Seed Data for FitFlow SaaS Demo

-- Insert demo tenant (Personal Trainer)
INSERT OR IGNORE INTO tenants (id, name, email, password_hash, subdomain, plan_type, plan_status) 
VALUES 
  ('tenant-demo-1', 'André Silva', 'andre@fitflow.app', '$2a$10$demo.password.hash', 'andre', 'pro', 'active');

-- Insert demo students
INSERT OR IGNORE INTO students (id, tenant_id, full_name, email, whatsapp, goal, physical_data, status, last_workout_date)
VALUES 
  ('student-1', 'tenant-demo-1', 'João Santos', 'joao@example.com', '+5511999999999', 'Hipertrofia', '{"weight": 75, "height": 175, "bf": 15, "restrictions": "Nenhuma"}', 'active', strftime('%s', 'now', '-1 day')),
  ('student-2', 'tenant-demo-1', 'Maria Oliveira', 'maria@example.com', '+5511988888888', 'Emagrecimento', '{"weight": 65, "height": 165, "bf": 25, "restrictions": "Joelho"}', 'active', strftime('%s', 'now', '-4 day')),
  ('student-3', 'tenant-demo-1', 'Carlos Pereira', 'carlos@example.com', '+5511977777777', 'Condicionamento', '{"weight": 80, "height": 180, "bf": 18, "restrictions": "Lombar"}', 'inactive', strftime('%s', 'now', '-10 day'));

-- Insert demo workouts
INSERT OR IGNORE INTO workouts (id, student_id, tenant_id, title, description, exercises, ai_logic_used, is_active, workout_type, duration_minutes)
VALUES 
  (
    'workout-1', 
    'student-1', 
    'tenant-demo-1', 
    'Treino A - Peito e Tríceps',
    'Treino focado em hipertrofia de membros superiores',
    '[{"name":"Supino Reto","sets":4,"reps":"8-12","rest":90,"video":"https://youtube.com/watch?v=demo1"},{"name":"Supino Inclinado","sets":3,"reps":"10-12","rest":60,"video":"https://youtube.com/watch?v=demo2"},{"name":"Crucifixo","sets":3,"reps":"12-15","rest":60,"video":"https://youtube.com/watch?v=demo3"},{"name":"Tríceps Testa","sets":3,"reps":"10-12","rest":60,"video":"https://youtube.com/watch?v=demo4"}]',
    'GPT-4o-mini: Gerado para hipertrofia com foco em peitorais e tríceps',
    1,
    'hipertrofia',
    45
  ),
  (
    'workout-2',
    'student-2',
    'tenant-demo-1',
    'Treino B - Pernas e Glúteos',
    'Treino adaptado para restrição de joelho',
    '[{"name":"Leg Press 45°","sets":4,"reps":"12-15","rest":90,"video":"https://youtube.com/watch?v=demo5"},{"name":"Cadeira Extensora (leve)","sets":3,"reps":"15-20","rest":60,"video":"https://youtube.com/watch?v=demo6"},{"name":"Glúteo na Máquina","sets":4,"reps":"12-15","rest":60,"video":"https://youtube.com/watch?v=demo7"}]',
    'GPT-4o-mini: Adaptado para restrição de joelho',
    1,
    'emagrecimento',
    40
  );

-- Insert demo AI equipment cache
INSERT OR IGNORE INTO ai_equipment_cache (id, image_hash, equipment_name, muscle_groups, youtube_video_url, youtube_query, confidence_score)
VALUES 
  ('cache-1', 'hash-supino-reto', 'Supino Reto', 'Peitoral, Tríceps, Deltoides', 'https://youtube.com/watch?v=demo1', 'Como usar Supino Reto execução correta Cariani', 0.95),
  ('cache-2', 'hash-leg-press', 'Leg Press 45°', 'Quadríceps, Glúteos, Posterior', 'https://youtube.com/watch?v=demo5', 'Como usar Leg Press execução correta Leandro Twin', 0.92);

-- Insert demo notifications
INSERT OR IGNORE INTO notifications_log (id, student_id, tenant_id, channel, content, status, sent_at)
VALUES 
  ('notif-1', 'student-2', 'tenant-demo-1', 'whatsapp', 'Oi Maria! 👋 Percebi que você não treina há 4 dias. Que tal agendar um treino hoje? 💪', 'sent', strftime('%s', 'now')),
  ('notif-2', 'student-3', 'tenant-demo-1', 'whatsapp', 'E aí Carlos! Faz tempo que não te vejo na academia. Tudo bem? Vamos voltar a treinar? 🔥', 'pending', NULL);

-- Insert demo AI logs
INSERT OR IGNORE INTO ai_logs (id, tenant_id, token_usage, cost_usd, purpose, model, prompt_tokens, completion_tokens)
VALUES 
  ('log-1', 'tenant-demo-1', 1250, 0.0025, 'Geração de Treino', 'gpt-4o-mini', 450, 800),
  ('log-2', 'tenant-demo-1', 850, 0.0017, 'Análise de Evolução', 'gpt-4o-mini', 350, 500),
  ('log-3', 'tenant-demo-1', 2100, 0.0042, 'Vision - Identificação de Equipamento', 'gpt-4o-vision', 1500, 600);
