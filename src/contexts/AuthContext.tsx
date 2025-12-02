/**
 * Authentication Context
 * Provides authentication state and methods to the entire application
 */

import { createContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User, AuthContextType } from '@/types/auth';
import * as authService from '@/services/auth.service';

/**
 * Authentication Context
 * Use useAuth() hook to access this context
 */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

/**
 * Authentication Provider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * Wraps the app and provides auth state to all children
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser as User | null);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Auth state change error:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // ========================================================================
  // Authentication Methods (wrapped with error handling)
  // ========================================================================

  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<User> => {
    setError(null);
    try {
      const user = await authService.signInWithEmail(email, password);
      return user;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<User> => {
    setError(null);
    try {
      const user = await authService.signUpWithEmail(
        email,
        password,
        displayName
      );
      return user;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const signInWithGoogle = async (): Promise<User> => {
    setError(null);
    try {
      const user = await authService.signInWithGoogle();
      return user;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const sendSignInLinkToEmail = async (email: string): Promise<void> => {
    setError(null);
    try {
      await authService.sendSignInLinkToEmail(email);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const signInWithEmailLink = async (
    email: string,
    emailLink: string
  ): Promise<User> => {
    setError(null);
    try {
      const user = await authService.signInWithEmailLink(email, emailLink);
      return user;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    setError(null);
    try {
      await authService.resetPassword(email);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateUserProfile = async (
    displayName: string,
    photoURL?: string
  ): Promise<void> => {
    setError(null);
    try {
      await authService.updateUserProfile(displayName, photoURL);
      // Refresh user state after profile update
      if (auth.currentUser) {
        setUser({ ...auth.currentUser } as User);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const sendEmailVerification = async (): Promise<void> => {
    setError(null);
    try {
      await authService.sendEmailVerification();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const signOut = async (): Promise<void> => {
    setError(null);
    try {
      await authService.signOut();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  // ========================================================================
  // Context Value
  // ========================================================================

  const value: AuthContextType = {
    user,
    loading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    sendSignInLinkToEmail,
    signInWithEmailLink,
    resetPassword,
    updateUserProfile,
    sendEmailVerification,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
