
  -- ============================================
  -- EventHub Supabase Setup
  -- Safe to re-run (uses IF NOT EXISTS / IF EXISTS)
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

  -- Add email column if table already exists without it
  ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS email VARCHAR(100) UNIQUE;

  -- Default admin: admin / admin123
  INSERT INTO admin_users (username, password)
  VALUES ('admin', '$2a$10$XQxBj8JETH0Xq8KdFgSO.uZAqFvHkhMpJy5hXcGv8KPT5qaV5zKhK')
  ON CONFLICT (username) DO NOTHING;

  -- Enable RLS
  ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

  -- Grants
  GRANT ALL ON registrations TO service_role;
  GRANT ALL ON admin_users TO service_role;
  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
  GRANT SELECT, INSERT ON registrations TO anon;
  GRANT SELECT, INSERT ON registrations TO authenticated;
  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

  -- RLS Policies (drop first if they exist, then recreate)
  DROP POLICY IF EXISTS "Allow public inserts" ON registrations;
  CREATE POLICY "Allow public inserts" ON registrations
      FOR INSERT TO anon, authenticated
      WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow public select" ON registrations;
  CREATE POLICY "Allow public select" ON registrations
      FOR SELECT TO anon, authenticated
      USING (true);

  -- ============================================
  -- Storage: Create a bucket for ID proof uploads
  -- Go to Supabase Dashboard → Storage → Create bucket
  -- Name: id-proofs
  -- Public: Yes
  -- ============================================

  ALTER TABLE registrations ADD COLUMN IF NOT EXISTS register_number VARCHAR(30) NOT NULL DEFAULT '';