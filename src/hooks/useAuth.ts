import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, UserProfile } from '@/lib/supabase';
import { authAPI, userAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useAuth useEffect started');
    
    // Early return if Supabase is not configured
    if (!supabase) {
      console.warn('Supabase not configured. Authentication features will be disabled.');
      setLoading(false);
      return;
    }
    
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('Auth loading timeout - forcing loading to false');
      setLoading(false);
    }, 5000); // Increased timeout to 5 seconds

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Initial session check:', { session, error });
        
        if (error) {
          console.error('Error getting initial session:', error);
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User found in session, fetching profile...');
          await fetchUserProfile(session.user.id);
        } else {
          console.log('No user in session');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', { event, session, user: session?.user });
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User authenticated, fetching profile...');
          await fetchUserProfile(session.user.id);
        } else {
          console.log('User signed out, clearing profile');
          setUserProfile(null);
          // Clear avatar from localStorage
          localStorage.removeItem('user-avatar');
          setLoading(false);
        }
      }
    );

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    console.log('Fetching user profile for:', userId);
    try {
      const { data, error } = await userAPI.getProfile(userId);
      console.log('User profile data:', data);
      console.log('User profile error:', error);

      if (error) {
        console.error('Error fetching user profile:', error);
        // Create a mock profile to avoid infinite loading
        const mockProfile = {
          id: userId,
          email: user?.email || '',
          full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
          avatar_url: user?.user_metadata?.avatar_url,
          role: 'user' as const,
          is_banned: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        console.log('Setting mock profile:', mockProfile);
        setUserProfile(mockProfile);
        
        // Save avatar to localStorage if it exists
        if (mockProfile.avatar_url) {
          localStorage.setItem('user-avatar', mockProfile.avatar_url);
        }
        
        setLoading(false);
        return;
      }

      if (!data) {
        console.log('No user profile found, creating new one');
        // Create profile if it doesn't exist
        await createUserProfile(userId);
      } else {
        console.log('Setting user profile:', data);
        setUserProfile(data);
        
        // Save avatar to localStorage if it exists
        if (data.avatar_url) {
          localStorage.setItem('user-avatar', data.avatar_url);
        }
        
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      // Create a mock profile to avoid infinite loading
      const mockProfile = {
        id: userId,
        email: user?.email || '',
        full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
        avatar_url: user?.user_metadata?.avatar_url,
        role: 'user' as const,
        is_banned: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('Setting mock profile due to error:', mockProfile);
      setUserProfile(mockProfile);
      
      // Save avatar to localStorage if it exists
      if (mockProfile.avatar_url) {
        localStorage.setItem('user-avatar', mockProfile.avatar_url);
      }
      
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
        // Create a mock profile instead
        const mockProfile = {
          id: userId,
          email: user?.email || '',
          full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
          avatar_url: user?.user_metadata?.avatar_url,
          role: 'user' as const,
          is_banned: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        console.log('Setting mock profile due to creation error:', mockProfile);
        setUserProfile(mockProfile);
        
        // Save avatar to localStorage if it exists
        if (mockProfile.avatar_url) {
          localStorage.setItem('user-avatar', mockProfile.avatar_url);
        }
        
        setLoading(false);
        return;
      }

      console.log('User profile created successfully:', data);
      setUserProfile(data);
      
      // Save avatar to localStorage if it exists
      if (data.avatar_url) {
        localStorage.setItem('user-avatar', data.avatar_url);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      // Create a mock profile instead
      const mockProfile = {
        id: userId,
        email: user?.email || '',
        full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
        avatar_url: user?.user_metadata?.avatar_url,
        role: 'user' as const,
        is_banned: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('Setting mock profile due to creation error:', mockProfile);
      setUserProfile(mockProfile);
      
      // Save avatar to localStorage if it exists
      if (mockProfile.avatar_url) {
        localStorage.setItem('user-avatar', mockProfile.avatar_url);
      }
      
      setLoading(false);
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
    console.log('SignInWithEmail called with:', email); // Added for debugging
    if (!supabase) {
      console.error('Supabase not configured'); // Added for debugging
      toast({
        variant: "destructive",
        title: "Gabim",
        description: "Supabase nuk është konfiguruar. Ju lutem kontaktoni administratorin."
      });
      return;
    }
    
    try {
      console.log('Calling authAPI.signIn...'); // Added for debugging
      const { data, error } = await authAPI.signIn(email, password);
      console.log('SignIn result:', { data, error }); // Added for debugging
      
      if (error) throw error;
      
      console.log('Login successful, showing toast...'); // Added for debugging
      toast({
        title: "Mirësevini!",
        description: "Jeni kyçur me sukses"
      });
      
      console.log('Toast shown, login process complete'); // Added for debugging
      
      // Force session refresh
      const { data: { session: newSession } } = await supabase.auth.getSession();
      console.log('New session after login:', newSession);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        await fetchUserProfile(newSession.user.id);
      }
    } catch (error: any) {
      console.error('Login error:', error); // Added for debugging
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
      const { data, error } = await authAPI.signUp(email, password, fullName);
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
    console.log('SignOut called');
    if (!supabase) {
      console.error('Supabase not configured for signOut');
      return;
    }
    
    try {
      console.log('Calling authAPI.signOut...');
      const { error } = await authAPI.signOut();
      console.log('SignOut result:', { error });
      
      if (error) throw error;
      
      // Clear all local state
      setUser(null);
      setUserProfile(null);
      setSession(null);
      
      // Clear avatar from localStorage
      localStorage.removeItem('user-avatar');
      
      console.log('SignOut successful, showing toast...');
      toast({
        title: "Dilni",
        description: "Jeni shkëputur me sukses"
      });
      
      console.log('SignOut process complete');
    } catch (error: any) {
      console.error('SignOut error:', error);
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