-- ============================================
-- CREATE NEWS TABLE
-- ============================================
-- This creates a table for news/articles that can be managed by admin

CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for news table
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Drop policy if exists
DROP POLICY IF EXISTS "Allow all access to news" ON news;

-- Create policy
CREATE POLICY "Allow all access to news" ON news FOR ALL USING (true) WITH CHECK (true);

-- Add is_premium column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;

-- Verify tables
SELECT table_name
FROM information_schema.tables
WHERE table_name IN ('news', 'products');
