import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export type UserRole = 'admin' | 'moderator' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
}