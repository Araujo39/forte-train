-- Seed data for student photos, measurements and goals

-- Student Photos (progress tracking)
INSERT OR IGNORE INTO student_photos (id, student_id, tenant_id, photo_url, photo_type, description, tags, taken_at, created_at)
VALUES 
  ('photo-1', 'student-1', 'tenant-demo-1', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400', 'before', 'Foto inicial do programa', '["frente", "inicio"]', strftime('%s', 'now', '-90 days'), strftime('%s', 'now', '-90 days')),
  ('photo-2', 'student-1', 'tenant-demo-1', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400', 'progress', 'Progresso após 30 dias', '["frente", "progresso"]', strftime('%s', 'now', '-60 days'), strftime('%s', 'now', '-60 days')),
  ('photo-3', 'student-1', 'tenant-demo-1', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', 'progress', 'Progresso após 60 dias', '["lateral", "progresso"]', strftime('%s', 'now', '-30 days'), strftime('%s', 'now', '-30 days')),
  ('photo-4', 'student-1', 'tenant-demo-1', 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400', 'after', 'Resultado final', '["frente", "resultado"]', strftime('%s', 'now', '-7 days'), strftime('%s', 'now', '-7 days')),
  
  ('photo-5', 'student-2', 'tenant-demo-1', 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400', 'before', 'Início do treino', '["frente"]', strftime('%s', 'now', '-60 days'), strftime('%s', 'now', '-60 days')),
  ('photo-6', 'student-2', 'tenant-demo-1', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400', 'progress', 'Evolução visível', '["lateral"]', strftime('%s', 'now', '-30 days'), strftime('%s', 'now', '-30 days')),
  
  ('photo-7', 'student-3', 'tenant-demo-1', 'https://images.unsplash.com/photo-1521805103424-d8f8430e8933?w=400', 'before', 'Foto inicial', '["frente"]', strftime('%s', 'now', '-45 days'), strftime('%s', 'now', '-45 days'));

-- Student Measurements (body metrics tracking)
INSERT OR IGNORE INTO student_measurements (
  id, student_id, tenant_id, weight, height, body_fat_percentage, muscle_mass, bmi,
  chest, waist, hips, thigh_left, thigh_right, bicep_left, bicep_right, 
  neck, shoulders, notes, measured_by, measured_at, created_at
)
VALUES 
  -- João Santos - Initial measurement
  ('measurement-1', 'student-1', 'tenant-demo-1', 85.5, 175, 22.5, 58.2, 27.9,
   98, 86, 95, 58, 58, 34, 34, 38, 112, 'Medição inicial do programa', 'trainer', 
   strftime('%s', 'now', '-90 days'), strftime('%s', 'now', '-90 days')),
   
  -- João Santos - 30 days
  ('measurement-2', 'student-1', 'tenant-demo-1', 83.2, 175, 20.8, 59.5, 27.1,
   100, 84, 94, 59, 59, 35, 35, 37, 114, 'Boa evolução, perdendo gordura', 'trainer',
   strftime('%s', 'now', '-60 days'), strftime('%s', 'now', '-60 days')),
   
  -- João Santos - 60 days
  ('measurement-3', 'student-1', 'tenant-demo-1', 80.8, 175, 18.5, 61.0, 26.4,
   102, 82, 93, 60, 60, 36, 36, 37, 115, 'Excelente progresso!', 'trainer',
   strftime('%s', 'now', '-30 days'), strftime('%s', 'now', '-30 days')),
   
  -- João Santos - Current
  ('measurement-4', 'student-1', 'tenant-demo-1', 78.5, 175, 16.2, 62.5, 25.6,
   104, 80, 92, 61, 61, 37, 37, 36, 117, 'Meta alcançada! Resultados incríveis', 'trainer',
   strftime('%s', 'now', '-7 days'), strftime('%s', 'now', '-7 days')),

  -- Maria Oliveira - Initial
  ('measurement-5', 'student-2', 'tenant-demo-1', 68.0, 165, 28.5, 44.2, 25.0,
   92, 78, 98, 56, 56, 28, 28, 32, 95, 'Início do programa de emagrecimento', 'trainer',
   strftime('%s', 'now', '-60 days'), strftime('%s', 'now', '-60 days')),
   
  -- Maria Oliveira - 30 days
  ('measurement-6', 'student-2', 'tenant-demo-1', 65.5, 165, 26.2, 45.0, 24.1,
   90, 75, 96, 55, 55, 28, 28, 31, 94, 'Progresso consistente', 'trainer',
   strftime('%s', 'now', '-30 days'), strftime('%s', 'now', '-30 days')),
   
  -- Maria Oliveira - Current
  ('measurement-7', 'student-2', 'tenant-demo-1', 63.2, 165, 24.0, 45.8, 23.2,
   88, 72, 94, 54, 54, 29, 29, 30, 93, 'Ótima evolução!', 'trainer',
   strftime('%s', 'now', '-7 days'), strftime('%s', 'now', '-7 days')),

  -- Carlos Pereira - Initial
  ('measurement-8', 'student-3', 'tenant-demo-1', 92.5, 180, 25.8, 62.0, 28.5,
   105, 95, 100, 62, 62, 36, 36, 40, 120, 'Foco em hipertrofia', 'trainer',
   strftime('%s', 'now', '-45 days'), strftime('%s', 'now', '-45 days')),
   
  -- Carlos Pereira - Current
  ('measurement-9', 'student-3', 'tenant-demo-1', 94.8, 180, 24.5, 65.5, 29.2,
   108, 94, 101, 64, 64, 38, 38, 41, 123, 'Ganho de massa muscular excelente', 'trainer',
   strftime('%s', 'now', '-15 days'), strftime('%s', 'now', '-15 days'));

-- Student Goals
INSERT OR IGNORE INTO student_goals (
  id, student_id, tenant_id, goal_type, target_weight, target_body_fat, 
  target_date, description, status, created_at, updated_at, completed_at
)
VALUES 
  -- João Santos - Completed goal
  ('goal-1', 'student-1', 'tenant-demo-1', 'weight_loss', 78.0, 16.0,
   strftime('%s', 'now', '-7 days'), 'Perder 7kg e reduzir gordura corporal para competição', 'completed',
   strftime('%s', 'now', '-90 days'), strftime('%s', 'now', '-7 days'), strftime('%s', 'now', '-7 days')),
   
  -- João Santos - New active goal
  ('goal-2', 'student-1', 'tenant-demo-1', 'muscle_gain', 82.0, 15.0,
   strftime('%s', 'now', '+90 days'), 'Ganhar 3-4kg de massa muscular magra mantendo BF baixo', 'active',
   strftime('%s', 'now', '-5 days'), strftime('%s', 'now', '-5 days'), NULL),

  -- Maria Oliveira - Active weight loss
  ('goal-3', 'student-2', 'tenant-demo-1', 'weight_loss', 60.0, 20.0,
   strftime('%s', 'now', '+60 days'), 'Perder mais 3kg e atingir 20% de gordura corporal', 'active',
   strftime('%s', 'now', '-60 days'), strftime('%s', 'now', '-7 days'), NULL),
   
  -- Maria Oliveira - Endurance goal
  ('goal-4', 'student-2', 'tenant-demo-1', 'endurance', NULL, NULL,
   strftime('%s', 'now', '+120 days'), 'Correr 5km em menos de 30 minutos', 'active',
   strftime('%s', 'now', '-30 days'), strftime('%s', 'now', '-30 days'), NULL),

  -- Carlos Pereira - Muscle gain
  ('goal-5', 'student-3', 'tenant-demo-1', 'muscle_gain', 100.0, 22.0,
   strftime('%s', 'now', '+180 days'), 'Ganhar 5-7kg de massa muscular em 6 meses', 'active',
   strftime('%s', 'now', '-45 days'), strftime('%s', 'now', '-15 days'), NULL),
   
  -- Carlos Pereira - Strength goal
  ('goal-6', 'student-3', 'tenant-demo-1', 'strength', NULL, NULL,
   strftime('%s', 'now', '+90 days'), 'Supino 120kg, Agachamento 150kg, Levantamento Terra 180kg', 'active',
   strftime('%s', 'now', '-45 days'), strftime('%s', 'now', '-45 days'), NULL);
