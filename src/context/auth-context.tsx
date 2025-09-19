
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { initialApplications } from '@/lib/data';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session error:', error);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          setUser(session.user);
          // Check if user profile exists, if not create initial data
          const { data: profile, error: profileError } = await supabase
            .from('user_applications')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (profileError && profileError.code === 'PGRST116') {
            // User doesn't exist, create initial data
            await supabase
              .from('user_applications')
              .insert({ 
                user_id: session.user.id, 
                applications: initialApplications 
              });
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          // Check if user profile exists, if not create initial data
          const { data: profile, error } = await supabase
            .from('user_applications')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (error && error.code === 'PGRST116') {
            // User doesn't exist, create initial data
            await supabase
              .from('user_applications')
              .insert({ 
                user_id: session.user.id, 
                applications: initialApplications 
              });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
