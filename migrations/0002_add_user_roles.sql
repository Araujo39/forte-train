-- Migration 0002: Add User Roles System
-- Adds role-based access control (RBAC) for Admin, Personal, and Student users

-- Add role column to tenants table (for Admin and Personal users)
ALTER TABLE tenants ADD COLUMN role TEXT DEFAULT 'personal';

-- Add password column to students table (for student login)
ALTER TABLE students ADD COLUMN password_hash TEXT;

-- Create unified users view for authentication
CREATE VIEW IF NOT EXISTS users_unified AS
  SELECT 
    id,
    name as full_name,
    email,
    password_hash,
    role,
    NULL as tenant_id,
    'tenant' as user_type,
    created_at
  FROM tenants
  UNION ALL
  SELECT 
    id,
    full_name,
    email,
    password_hash,
    'student' as role,
    tenant_id,
    'student' as user_type,
    created_at
  FROM students
  WHERE password_hash IS NOT NULL AND email IS NOT NULL;

-- Create admin users table (optional - for super admins)
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  permissions TEXT, -- JSON array of permissions
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  last_login INTEGER
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
