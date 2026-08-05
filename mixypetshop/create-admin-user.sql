-- ============================================
-- CREATE ADMIN USER
-- ============================================
-- This script creates an admin user and sets their role

-- Step 1: Create user through Supabase Auth Dashboard first
-- Go to Authentication → Users → Add user
-- Fill in email and password, then click "Create user"

-- Step 2: After user is created, get their UUID from the dashboard
-- Then run this query to set their role as admin:

-- REPLACE 'YOUR_USER_UUID_HERE' with the actual UUID from the dashboard
UPDATE public.users
SET role = 'admin'
WHERE id = 'YOUR_USER_UUID_HERE';

-- Step 3: Verify the role
SELECT id, email, name, role
FROM public.users
WHERE role = 'admin';
