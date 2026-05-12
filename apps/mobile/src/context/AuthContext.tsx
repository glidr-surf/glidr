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
  signIn: () => void;
  signOut: () => void;
  requireAuth: (action: () => void) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);

  // TODO: Wire Privy hooks here when configured
  // const { isReady, isAuthenticated: privyAuth, user: privyUser, login, logout } = usePrivy();

  useEffect(() => {
    // TODO: Replace with Privy auth state check
    // For now, mark as loaded with no user (signed out state)
    setIsLoading(false);
  }, []);

  const showAuthModal = () => setIsAuthModalVisible(true);
  const hideAuthModal = () => setIsAuthModalVisible(false);

  const signIn = () => {
    // TODO: Call Privy login()
    setIsAuthModalVisible(false);
    if (pendingAction.current) {
      pendingAction.current();
      pendingAction.current = null;
    }
  };

  const signOut = () => {
    // TODO: Call Privy logout()
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
        signIn,
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
