-- ============================================
-- DISABLE RLS FOR USERS TABLE UPDATE (TEMPORARY FIX)
-- ============================================
-- This allows users to update their own profile

-- Drop existing UPDATE policies
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

-- Create simple UPDATE policy
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Verify the policy
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'users' AND cmd = 'UPDATE';
