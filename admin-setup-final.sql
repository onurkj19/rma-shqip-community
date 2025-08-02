-- RMA Shqip Community - Final Admin Setup
-- Ekzekutoni këto komanda në Supabase SQL Editor

-- 1. Përditësoni rolin e përdoruesit në admin
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'onurkj19@gmail.com';

-- 2. Verifikoni që përditësimi u bë
SELECT id, email, full_name, role, created_at 
FROM user_profiles 
WHERE email = 'onurkj19@gmail.com';

-- 3. Krijoni një përdorues admin nëse nuk ekziston
INSERT INTO user_profiles (id, email, full_name, username, role, is_banned)
VALUES (
    gen_random_uuid(),
    'onurkj19@gmail.com',
    'Onur Admin',
    'onurkj19',
    'admin',
    false
)
ON CONFLICT (email) DO UPDATE SET
    role = 'admin',
    full_name = COALESCE(user_profiles.full_name, 'Onur Admin'),
    username = COALESCE(user_profiles.username, 'onurkj19');

-- 4. Verifikoni të gjithë admin users
SELECT id, email, full_name, username, role, created_at 
FROM user_profiles 
WHERE role = 'admin'
ORDER BY created_at DESC;

-- 5. Testoni Supabase connection
SELECT 'Admin setup completed successfully!' as status; 