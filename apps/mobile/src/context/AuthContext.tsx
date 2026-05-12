import React, { createContext, useContext, useState, useRef } from 'react';
import type { User } from '../types';
import { mockCurrentUser } from '../data/mock';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAuthModalVisible: boolean;
  showAuthModal: () => void;
  hideAuthModal: () => void;
  signIn: () => void;
  signOut: () => void;
  requireAuth: (action: () => void) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(mockCurrentUser);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);

  const showAuthModal = () => setIsAuthModalVisible(true);
  const hideAuthModal = () => setIsAuthModalVisible(false);

  const signIn = () => {
    setUser(mockCurrentUser);
    setIsAuthModalVisible(false);
    if (pendingAction.current) {
      pendingAction.current();
      pendingAction.current = null;
    }
  };

  const signOut = () => {
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
