import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, UserProfile } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Early return if Supabase is not configured
    if (!supabase) {
      console.warn('Supabase not configured. Authentication features will be disabled.');
      setLoading(false);
      return;
    }
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        setLoading(false);
        return;
      }

      if (!data) {
        // Create profile if it doesn't exist
        await createUserProfile(userId);
      } else {
        setUserProfile(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setLoading(false);
    }
  };

  const createUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: userId,
            email: user?.email || '',
            full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0],
            avatar_url: user?.user_metadata?.avatar_url,
            role: 'user',
            is_banned: false,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  };

  const signInWithGoogle = async () => {
    if (!supabase) {
      toast({
        variant: "destructive",
        title: "Gabim",
        description: "Supabase nuk është konfiguruar. Ju lutem kontaktoni administratorin."
      });
      return;
    }
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gabim",
        description: "Nuk u arrit lidhja me Google"
      });
    }
  };

  const signInWithFacebook = async () => {
    if (!supabase) {
      toast({
        variant: "destructive",
        title: "Gabim", 
        description: "Supabase nuk është konfiguruar. Ju lutem kontaktoni administratorin."
      });
      return;
    }
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gabim",
        description: "Nuk u arrit lidhja me Facebook"
      });
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) {
      toast({
        variant: "destructive",
        title: "Gabim",
        description: "Supabase nuk është konfiguruar. Ju lutem kontaktoni administratorin."
      });
      return;
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      toast({
        title: "Mirësevini!",
        description: "Jeni kyçur me sukses"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gabim",
        description: error.message
      });
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    if (!supabase) {
      toast({
        variant: "destructive", 
        title: "Gabim",
        description: "Supabase nuk është konfiguruar. Ju lutem kontaktoni administratorin."
      });
      return;
    }
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      if (error) throw error;
      
      toast({
        title: "Llogaria u krijua!",
        description: "Kontrolloni email-in tuaj për konfirmim"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gabim",
        description: error.message
      });
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Dilni",
        description: "Jeni shkëputur me sukses"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gabim",
        description: error.message
      });
    }
  };

  const isAdmin = () => {
    return userProfile?.role === 'admin';
  };

  const isModerator = () => {
    return userProfile?.role === 'moderator' || userProfile?.role === 'admin';
  };

  return {
    user,
    userProfile,
    session,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    isAdmin,
    isModerator,
  };
};