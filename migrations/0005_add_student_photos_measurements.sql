-- Migration 0005: Student Photos and Measurements Tracking
-- Enables personal trainers to track student progress photos and body measurements

-- Student Progress Photos
-- Stores photos uploaded by students or trainers (before/after, progress tracking)
CREATE TABLE IF NOT EXISTS student_photos (
  id TEXT PRIMARY KEY DEFAULT ('photo-' || lower(hex(randomblob(8)))),
  student_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  photo_type TEXT DEFAULT 'progress', -- 'before', 'after', 'progress', 'equipment'
  description TEXT,
  tags TEXT, -- JSON array of tags: ['front', 'side', 'back']
  taken_at INTEGER DEFAULT (strftime('%s', 'now')),
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Student Body Measurements
-- Tracks body metrics over time (weight, body fat, muscle mass, circumferences)
CREATE TABLE IF NOT EXISTS student_measurements (
  id TEXT PRIMARY KEY DEFAULT ('measurement-' || lower(hex(randomblob(8)))),
  student_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  
  -- Basic metrics
  weight REAL, -- kg
  height REAL, -- cm
  body_fat_percentage REAL, -- %
  muscle_mass REAL, -- kg
  bmi REAL, -- calculated
  
  -- Circumferences (cm)
  chest REAL,
  waist REAL,
  hips REAL,
  thigh_left REAL,
  thigh_right REAL,
  calf_left REAL,
  calf_right REAL,
  bicep_left REAL,
  bicep_right REAL,
  forearm_left REAL,
  forearm_right REAL,
  neck REAL,
  shoulders REAL,
  
  -- Additional data
  notes TEXT,
  measured_by TEXT, -- 'student' or 'trainer'
  measured_at INTEGER DEFAULT (strftime('%s', 'now')),
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Student Goals
-- Stores student goals and target metrics
CREATE TABLE IF NOT EXISTS student_goals (
  id TEXT PRIMARY KEY DEFAULT ('goal-' || lower(hex(randomblob(8)))),
  student_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  
  goal_type TEXT NOT NULL, -- 'weight_loss', 'muscle_gain', 'endurance', 'strength', 'custom'
  target_weight REAL,
  target_body_fat REAL,
  target_date INTEGER, -- unix timestamp
  description TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  completed_at INTEGER,
  
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_photos_student ON student_photos(student_id);
CREATE INDEX IF NOT EXISTS idx_student_photos_tenant ON student_photos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_student_photos_taken_at ON student_photos(taken_at);

CREATE INDEX IF NOT EXISTS idx_student_measurements_student ON student_measurements(student_id);
CREATE INDEX IF NOT EXISTS idx_student_measurements_tenant ON student_measurements(tenant_id);
CREATE INDEX IF NOT EXISTS idx_student_measurements_date ON student_measurements(measured_at);

CREATE INDEX IF NOT EXISTS idx_student_goals_student ON student_goals(student_id);
CREATE INDEX IF NOT EXISTS idx_student_goals_tenant ON student_goals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_student_goals_status ON student_goals(status);
