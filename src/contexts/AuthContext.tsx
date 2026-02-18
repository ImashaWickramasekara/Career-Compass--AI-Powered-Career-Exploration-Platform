import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, userProfile?: {
    fullName: string;
    email: string;
    phoneNumber: string;
    location: string;
    bio: string;
    createdAt: string;
  }) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userProfile?: {
    fullName: string;
    email: string;
    phoneNumber: string;
    location: string;
    bio: string;
    createdAt: string;
  }) => {
    try {
      // First, create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userProfile?.fullName || '',
            phone_number: userProfile?.phoneNumber || '',
            location: userProfile?.location || '',
            bio: userProfile?.bio || '',
          }
        }
      });
      
      if (error) {
        console.error('Auth signup error:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('User creation failed - no user data returned');
      }

      // Create the profile after user is created
      // The profiles table uses user_id (foreign key) not id (primary key)
      if (userProfile) {
        // Wait a moment for the user to be fully created
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Build profile data with user_id (not id)
        const profileData = {
          user_id: data.user.id, // This is the foreign key to auth.users
          full_name: userProfile.fullName,
          email: userProfile.email,
          phone_number: userProfile.phoneNumber || null,
          location: userProfile.location || null,
          bio: userProfile.bio || null,
        };

        // Upsert using user_id as the conflict target (since it has a unique constraint)
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([profileData], { 
            onConflict: 'user_id' // Use user_id for conflict resolution
          });

        if (profileError) {
          console.error('Error storing user profile:', profileError);
          console.error('Profile error details:', JSON.stringify(profileError, null, 2));
          // Don't throw - user account was created successfully
          // Profile can be created/updated later when user logs in or visits profile page
        } else {
          console.log('Profile successfully created/updated');
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 