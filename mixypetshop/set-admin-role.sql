-- ============================================
-- SET USER ROLE TO ADMIN
-- ============================================
-- This updates your user role to admin

-- Update your user role to admin (replace with your actual user ID)
UPDATE users
SET role = 'admin'
WHERE email = 'fasyaalghoniyyu47@gmail.com';

-- Verify the update
SELECT id, email, role, name
FROM users
WHERE email = 'fasyaalghoniyyu47@gmail.com';
