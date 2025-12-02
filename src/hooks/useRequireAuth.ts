/**
 * useRequireAuth Hook
 * Ensures component is only accessible to authenticated users
 * Redirects to login if not authenticated
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import type { User } from '@/types/auth';

/**
 * Hook that requires authentication
 * Redirects to login page if user is not authenticated
 * Passes returnUrl query parameter to redirect back after login
 *
 * @returns User object if authenticated, null during loading
 *
 * @example
 * ```tsx
 * const MyProtectedComponent = () => {
 *   const user = useRequireAuth();
 *
 *   if (!user) {
 *     return <LoadingSpinner />;
 *   }
 *
 *   return <div>Protected content for {user.email}</div>;
 * };
 * ```
 */
export const useRequireAuth = (): User | null => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Store the current location to redirect back after login
      const returnUrl = location.pathname + location.search;
      navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`, {
        replace: true,
      });
    }
  }, [user, loading, navigate, location]);

  return user;
};
