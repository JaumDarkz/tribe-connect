/**
 * useFeatureGate Hook
 * Check if user has access to a specific feature
 */

import { useSubscription } from './useSubscription';
import { getRequiredPlan, FEATURE_NAMES, FEATURE_DESCRIPTIONS } from '@/config/feature-gates';
import type { FeatureKey, PlanTier } from '@/types/subscription';

/**
 * Feature gate hook result
 */
export interface UseFeatureGateResult {
  hasAccess: boolean;
  requiredPlan: PlanTier;
  currentPlan: PlanTier;
  featureName: string;
  featureDescription: string;
  isLoading: boolean;
}

/**
 * Hook to check feature access
 * @param feature - Feature key to check
 * @returns Feature gate information
 */
export const useFeatureGate = (feature: FeatureKey): UseFeatureGateResult => {
  const { hasFeature, currentPlan, loading } = useSubscription();

  return {
    hasAccess: hasFeature(feature),
    requiredPlan: getRequiredPlan(feature),
    currentPlan,
    featureName: FEATURE_NAMES[feature],
    featureDescription: FEATURE_DESCRIPTIONS[feature],
    isLoading: loading,
  };
};
