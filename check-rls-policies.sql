-- RMA Shqip Community - Check RLS Policies
-- Ekzekutoni këto komanda për të verifikuar RLS

-- 1. Kontrolloni që RLS është aktiv në tabelat
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'posts', 'comments', 'events', 'matches');

-- 2. Kontrolloni policies ekzistuese
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. Testoni aksesin e përdoruesit
-- Kjo do të tregojë nëse RLS po funksionon
SELECT 
    'user_profiles' as table_name,
    count(*) as total_records
FROM user_profiles;

-- 4. Kontrolloni rolin aktual të përdoruesit
SELECT 
    id,
    email,
    role,
    created_at
FROM user_profiles 
WHERE email = 'onurkj19@gmail.com'; 