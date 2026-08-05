-- ============================================
-- DISABLE RLS FOR STORAGE BUCKETS
-- ============================================
-- This disables RLS for storage buckets to allow file uploads

-- Disable RLS for storage.objects table
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Disable RLS for storage.buckets table
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Verify RLS status
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname IN ('objects', 'buckets')
AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'storage');
