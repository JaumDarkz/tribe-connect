/**
 * Public Route Component
 * Wraps routes that should only be accessible when NOT authenticated
 * Redirects to dashboard if already authenticated (e.g., login, signup pages)
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Component for routes that should only be accessible to unauthenticated users
 * Redirects to dashboard (or specified route) if already authenticated
 * Useful for login and signup pages
 *
 * @example
 * ```tsx
 * <Route path="/login" element={
 *   <PublicRoute>
 *     <Login />
 *   </PublicRoute>
 * } />
 * ```
 */
export const PublicRoute = ({
  children,
  redirectTo = '/dashboard',
}: PublicRouteProps) => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render children if not authenticated
  return <>{children}</>;
};
