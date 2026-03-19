-- ============================================
-- EventHub Supabase Setup
-- Run this in Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query)
-- ============================================

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    department VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    event VARCHAR(100) NOT NULL,
    register_number VARCHAR(30) NOT NULL,
    id_proof TEXT DEFAULT NULL,
    registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default admin: admin / admin123
-- bcrypt hash of 'admin123'
INSERT INTO admin_users (username, password)
VALUES ('admin', '$2a$10$XQxBj8JETH0Xq8KdFgSO.uZAqFvHkhMpJy5hXcGv8KPT5qaV5zKhK')
ON CONFLICT (username) DO NOTHING;

-- Add columns if tables already exist
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS email VARCHAR(100) UNIQUE;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS register_number VARCHAR(30) NOT NULL DEFAULT '';

-- Grant permissions to Supabase roles
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access (bypasses RLS by default)
GRANT ALL ON registrations TO service_role;
GRANT ALL ON admin_users TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Allow anon/authenticated to insert registrations (for public form)
GRANT SELECT, INSERT ON registrations TO anon;
GRANT SELECT, INSERT ON registrations TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- RLS policy: allow public inserts
CREATE POLICY "Allow public inserts" ON registrations
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- RLS policy: allow public select (for duplicate check)
CREATE POLICY "Allow public select" ON registrations
    FOR SELECT TO anon, authenticated
    USING (true);

-- RLS policy: service_role bypasses RLS automatically

-- ============================================
-- Storage: Create a bucket for ID proof uploads
-- Go to Supabase Dashboard → Storage → Create bucket
-- Name: id-proofs
-- Public: Yes (so files can be viewed via URL)
-- ============================================
