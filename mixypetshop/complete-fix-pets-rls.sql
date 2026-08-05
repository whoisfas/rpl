-- ============================================
-- COMPLETE FIX FOR PETS TABLE RLS
-- ============================================

-- 1. Disable RLS temporarily
ALTER TABLE public.pets DISABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies on pets
DROP POLICY IF EXISTS "Users can view own pets" ON public.pets;
DROP POLICY IF EXISTS "Admins can view all pets" ON public.pets;
DROP POLICY IF EXISTS "Users can insert own pets" ON public.pets;
DROP POLICY IF EXISTS "Users can update own pets" ON public.pets;
DROP POLICY IF EXISTS "Users can delete own pets" ON public.pets;
DROP POLICY IF EXISTS "Admins can delete all pets" ON public.pets;

-- 3. Re-enable RLS
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- 4. Create new policies with correct column names
CREATE POLICY "Users can view own pets" ON public.pets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pets" ON public.pets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pets" ON public.pets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pets" ON public.pets
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'pets'
ORDER BY policyname;
