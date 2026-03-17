-- Seed data for 3 user profiles: Admin, Personal, and Student

-- 1. ADMIN USER
-- Email: admin@fortetrain.app
-- Password: admin123
-- Hash SHA-256 de "admin123": 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
INSERT OR IGNORE INTO admin_users (id, name, email, password_hash, role, permissions, created_at) 
VALUES (
  'admin-super-001',
  'Administrador ForteTrain',
  'admin@fortetrain.app',
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
  'admin',
  '["view_all_tenants","view_all_students","manage_system","view_analytics"]',
  strftime('%s', 'now')
);

-- 2. PERSONAL TRAINER USER (já existe, mas vamos atualizar com role)
-- Email: andre@fortetrain.app
-- Password: demo123
-- Hash SHA-256 de "demo123": d3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791
UPDATE tenants 
SET role = 'personal' 
WHERE email = 'andre@fortetrain.app';

-- 3. STUDENT USER
-- Email: joao.santos@email.com
-- Password: aluno123
-- Hash SHA-256 de "aluno123": 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
UPDATE students 
SET 
  email = 'joao.santos@email.com',
  password_hash = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
WHERE id = 'student-1';

-- Create additional student accounts
UPDATE students 
SET 
  email = 'maria.oliveira@email.com',
  password_hash = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
WHERE id = 'student-2';

UPDATE students 
SET 
  email = 'carlos.mendes@email.com',
  password_hash = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
WHERE id = 'student-3';
