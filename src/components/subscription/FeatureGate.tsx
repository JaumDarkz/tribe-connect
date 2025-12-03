/**
 * Feature Gate Component
 * Controls access to features based on subscription plan
 */

import { type ReactNode } from 'react';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import type { FeatureKey } from '@/types/subscription';

export interface FeatureGateProps {
  feature: FeatureKey;
  children: ReactNode;
  fallback?: ReactNode;
  showFallbackWhenLocked?: boolean;
}

/**
 * Feature Gate Component
 * Renders children if user has access, otherwise renders fallback
 *
 * @param feature - Feature to check access for
 * @param children - Content to render when user has access
 * @param fallback - Content to render when user doesn't have access
 * @param showFallbackWhenLocked - Whether to show fallback or hide content entirely
 */
export const FeatureGate = ({
  feature,
  children,
  fallback,
  showFallbackWhenLocked = true,
}: FeatureGateProps) => {
  const { hasAccess, isLoading } = useFeatureGate(feature);

  // Show loading state
  if (isLoading) {
    return null;
  }

  // User has access - show children
  if (hasAccess) {
    return <>{children}</>;
  }

  // User doesn't have access
  if (showFallbackWhenLocked && fallback) {
    return <>{fallback}</>;
  }

  // Hide content entirely
  return null;
};
