/**
 * useAuth Hook
 * Provides access to authentication context
 */

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Hook to access authentication context
 * Must be used within AuthProvider
 *
 * @throws Error if used outside of AuthProvider
 *
 * @example
 * ```tsx
 * const { user, signIn, signOut } = useAuth();
 *
 * if (user) {
 *   return <div>Welcome, {user.displayName}</div>
 * }
 * ```
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Make sure your component is wrapped with <AuthProvider>.'
    );
  }

  return context;
};
