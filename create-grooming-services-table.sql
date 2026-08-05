-- ============================================
-- CREATE GROOMING SERVICES TABLE
-- ============================================
-- This creates a table for grooming services that can be managed by admin

CREATE TABLE IF NOT EXISTS grooming_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  duration VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for grooming_services table
ALTER TABLE grooming_services ENABLE ROW LEVEL SECURITY;

-- Drop policy if exists
DROP POLICY IF EXISTS "Allow all access to grooming_services" ON grooming_services;

-- Create policy
CREATE POLICY "Allow all access to grooming_services" ON grooming_services FOR ALL USING (true) WITH CHECK (true);

-- Verify table
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'grooming_services';
