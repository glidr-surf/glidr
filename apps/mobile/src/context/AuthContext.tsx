import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { User } from '@glidr/data';
import { getProfile } from '@glidr/data';
import { supabase } from '../lib/supabase';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalVisible: boolean;
  showAuthModal: () => void;
  hideAuthModal: () => void;
  sendCode: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<boolean>; // returns needsUsername
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
  requireAuth: (action: () => void) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);

  const loadProfile = async (userId: string): Promise<User | null> => {
    const profile = await getProfile(supabase, userId);
    setUser(profile);
    return profile;
  };

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (active && data.session) await loadProfile(data.session.user.id);
      if (active) setIsLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) await loadProfile(session.user.id);
      else setUser(null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const showAuthModal = () => setIsAuthModalVisible(true);
  const hideAuthModal = () => setIsAuthModalVisible(false);

  const sendCode = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) throw error;
  };

  const verifyCode = async (email: string, code: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    if (error) throw error;
    const profile = data.session ? await loadProfile(data.session.user.id) : null;
    return profile === null; // needsUsername
  };

  const refreshUser = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) await loadProfile(data.session.user.id);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const requireAuth = (action: () => void) => {
    if (user !== null) {
      action();
    } else {
      pendingAction.current = action;
      setIsAuthModalVisible(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        isAuthModalVisible,
        showAuthModal,
        hideAuthModal,
        sendCode,
        verifyCode,
        refreshUser,
        signOut,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
