import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { isSupabaseConfigured, supabase } from '../utils/supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  session: null,
  user: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const setAuthState = useCallback((newSession: Session | null) => {
    setSession(newSession);
    setUser(newSession?.user ?? null);
    setIsAuthenticated(!!newSession);
    setIsLoading(false); // Auth is resolved immediately
  }, []);

  useEffect(() => {
    // 1. Check initial session
    const checkSession = async () => {
      if (!isSupabaseConfigured) {
        setAuthState(null);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      setAuthState(session);
    };

    checkSession();

    if (!isSupabaseConfigured) {
      return;
    }

    // 2. Listen to Auth State changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setAuthState(newSession);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setAuthState]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, session, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
