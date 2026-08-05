-- ============================================
-- DEBUG PETS RLS ISSUE
-- ============================================

-- 1. Check all policies on pets table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'pets'
ORDER BY policyname;

-- 2. Check if RLS is enabled
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'pets';

-- 3. Temporarily disable RLS for testing (ONLY FOR DEBUGGING)
ALTER TABLE public.pets DISABLE ROW LEVEL SECURITY;

-- After testing, re-enable RLS with this command:
-- ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
