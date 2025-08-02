# RMA Shqip Community - Udhëzime të Plota për Setup

## ✅ Çfarë është bërë tashmë

1. **Hequr të gjitha referencat Loveable** nga projekti
2. **Konfiguruar Supabase** me credentials tuaja
3. **Krijuar API services** për të gjitha funksionalitetet
4. **Përditësuar useAuth hook** për të përdorur API-n e reale
5. **Krijuar SQL scripts** për database setup

## 🔧 Hapat e Radhës për të Plotësuar Setup-in

### 1. Krijoni .env file

Krijoni një file `.env` në root të projektit me këtë përmbajtje:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://mgimmfdoiehoabpkdygx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1naW1tZmRvaWVob2FicGtkeWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTM4MzAsImV4cCI6MjA2OTYyOTgzMH0.R79xiKwxWQxMDuFcnRLKSHdkGkLLYnEYVNQWR0mrTW8

# Environment
NODE_ENV=development
```

### 2. Ekzekutoni SQL Scripts në Supabase

1. **Hyni në Supabase Dashboard**: https://supabase.com/dashboard
2. **Zgjidhni projektin tuaj**
3. **Shkoni te SQL Editor**
4. **Kopjoni dhe ekzekutoni** të gjithë përmbajtjen e file `database-setup.sql`

### 3. Konfiguroni Authentication

1. **Shkoni te Authentication > Settings** në Supabase Dashboard
2. **Aktivizoni Email auth** nëse nuk është aktivizuar
3. **Konfiguroni redirect URLs**:
   - `http://localhost:8080`
   - `http://localhost:8080/auth/callback`

### 4. Konfiguroni Storage (për imazhe)

1. **Shkoni te Storage** në Supabase Dashboard
2. **Krijoni një bucket të ri** me emrin `images`
3. **Vendosni policies** për bucket-in:
   ```sql
   -- Allow public read access
   CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
   
   -- Allow authenticated users to upload
   CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
   
   -- Allow users to update their own files
   CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
   
   -- Allow users to delete their own files
   CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

### 5. Testoni Aplikacionin

```bash
# Ekzekutoni aplikacionin
npm run dev

# Hapni http://localhost:8080 në browser
```

### 6. Krijoni Admin User

Pasi të regjistroheni, përditësoni rolin e përdoruesit në admin:

```sql
-- Në SQL Editor të Supabase
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## 🚀 Funksionalitetet e Gatshme

### Authentication
- ✅ Regjistrim me email
- ✅ Hyrje me email
- ✅ Hyrje me Google
- ✅ Hyrje me Facebook
- ✅ Reset password
- ✅ Auto-profile creation

### Posts
- ✅ Krijo postime
- ✅ Like/unlike postime
- ✅ Komento postime
- ✅ Trending posts
- ✅ Real-time updates

### User Management
- ✅ User profiles
- ✅ Follow/unfollow users
- ✅ User roles (admin, moderator, user)
- ✅ Profile updates

### Events
- ✅ Krijo ngjarje (admin/moderator)
- ✅ Lista e ngjarjeve
- ✅ Upcoming events

### Matches
- ✅ Krijo ndeshje (admin/moderator)
- ✅ Orari i ndeshjeve
- ✅ Match results

### Notifications
- ✅ User notifications
- ✅ Mark as read
- ✅ Real-time notifications

## 🔧 Komandat e Dobishme

```bash
# Zhvillim
npm run dev

# Build për produksion
npm run build

# Preview build-in
npm run preview

# Lint kodin
npm run lint

# Instalo varësi të reja
npm install package-name

# Përditëso varësi
npm update
```

## 📁 Struktura e Projektit

```
src/
├── components/
│   ├── ui/          # shadcn/ui components
│   ├── auth/        # Authentication components
│   ├── admin/       # Admin panel components
│   └── shared/      # Shared components
├── pages/           # Route pages
├── hooks/           # Custom React hooks
├── lib/             # Utilities and configs
│   ├── supabase.ts  # Supabase client
│   └── api.ts       # API services
├── types/           # TypeScript types
└── assets/          # Static assets
```

## 🎯 Hapat e Radhës për Përmirësim

### Frontend Përmirësime
- [ ] Implementoni real-time updates me Supabase subscriptions
- [ ] Shtoni dark mode
- [ ] Përmirësoni UI/UX me animacione
- [ ] Shtoni infinite scroll për postimet
- [ ] Implementoni search functionality
- [ ] Shtoni image upload me drag & drop

### Backend Përmirësime
- [ ] Shtoni email notifications
- [ ] Implementoni push notifications
- [ ] Shtoni analytics tracking
- [ ] Implementoni content moderation
- [ ] Shtoni backup system

### Performance
- [ ] Implementoni lazy loading
- [ ] Optimizoni imazhet
- [ ] Shtoni caching
- [ ] Implementoni CDN

## 🐛 Troubleshooting

### Problemet e Zakonshme

1. **Supabase connection error**
   - Kontrolloni credentials në .env file
   - Sigurohuni që Supabase është aktiv

2. **Authentication nuk funksionon**
   - Kontrolloni redirect URLs në Supabase
   - Sigurohuni që email auth është aktivizuar

3. **Database tables nuk u krijuan**
   - Ekzekutoni SQL scripts në Supabase SQL Editor
   - Kontrolloni për errors në console

4. **Image upload nuk funksionon**
   - Kontrolloni storage bucket policies
   - Sigurohuni që bucket-i `images` ekziston

## 📞 Kontakti

Për pyetje ose probleme:
- Hapni një issue në repository
- Kontrolloni Supabase logs
- Shikoni browser console për errors

---

**Hala Madrid y nada más!** ⚽🤍 