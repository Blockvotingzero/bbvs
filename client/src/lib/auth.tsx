import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'wouter';

interface AuthState {
  isAuthenticated: boolean;
  nin: string | null;
  livenessVerified: boolean;
  hasVoted: boolean;
}

interface AuthContextType extends AuthState {
  login: (nin: string) => void;
  logout: () => void;
  setLivenessVerified: (verified: boolean) => void;
  setHasVoted: (voted: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'blockvote_auth_state';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<AuthState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      isAuthenticated: false,
      nin: null,
      livenessVerified: false,
      hasVoted: false,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const login = (nin: string) => {
    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      nin,
    }));
  };

  const logout = () => {
    setState({
      isAuthenticated: false,
      nin: null,
      livenessVerified: false,
      hasVoted: false,
    });
    localStorage.removeItem(STORAGE_KEY);
    setLocation('/login');
  };

  const setLivenessVerified = (verified: boolean) => {
    setState(prev => ({
      ...prev,
      livenessVerified: verified,
    }));
  };

  const setHasVoted = (voted: boolean) => {
    setState(prev => ({
      ...prev,
      hasVoted: voted,
    }));
  };

  return (
    <AuthContext.Provider 
      value={{
        ...state,
        login,
        logout,
        setLivenessVerified,
        setHasVoted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
