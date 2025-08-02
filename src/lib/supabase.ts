import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase environment variables are available
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key exists:', !!supabaseAnonKey);
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Please ensure Supabase integration is properly configured.');
}

// Create Supabase client with session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable session persistence
    persistSession: true,
    // Store session in localStorage
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    // Auto refresh session
    autoRefreshToken: true,
    // Detect session in URL
    detectSessionInUrl: true,
  },
});

// Utility function to check session persistence
export const checkSessionPersistence = () => {
  if (typeof window === 'undefined') return false;
  
  const sessionKey = `sb-${supabaseUrl?.split('//')[1]?.split('.')[0]}-auth-token`;
  const sessionData = localStorage.getItem(sessionKey);
  
  console.log('Session persistence check:', {
    sessionKey,
    hasSessionData: !!sessionData,
    sessionData: sessionData ? JSON.parse(sessionData) : null
  });
  
  return !!sessionData;
};

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.auth.getSession();
    console.log('Supabase connection test result:', { data, error });
    return { success: !error, data, error };
  } catch (err) {
    console.error('Supabase connection test failed:', err);
    return { success: false, error: err };
  }
};

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