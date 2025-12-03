/**
 * Feature Gates Configuration
 * Defines which features require which subscription plans
 */

import { FeatureKey, PlanTier } from '@/types/subscription';

/**
 * Feature gate definitions
 * Maps each feature to the minimum required plan tier
 */
export const FEATURE_GATES: Record<FeatureKey, PlanTier> = {
  // Silver features
  multipleServers: 'silver',
  captchaFree: 'silver',
  premiumGiveaways: 'silver',
  raffleBoost: 'silver',

  // Gold features
  autoFarm: 'gold',
  pointTransfer: 'gold',
  apiAccess: 'gold',
  priorityProcessing: 'gold',
  xpBoost: 'gold',
};

/**
 * Plan hierarchy for comparison
 */
const PLAN_HIERARCHY: PlanTier[] = ['free', 'silver', 'gold', 'diamond'];

/**
 * Get the index of a plan in the hierarchy
 */
const getPlanIndex = (plan: PlanTier): number => {
  return PLAN_HIERARCHY.indexOf(plan);
};

/**
 * Check if a user's plan has access to a specific feature
 * @param userPlan - The user's current plan
 * @param feature - The feature to check access for
 * @returns true if the user has access, false otherwise
 */
export const planHasFeature = (
  userPlan: PlanTier,
  feature: FeatureKey
): boolean => {
  const requiredPlan = FEATURE_GATES[feature];
  const userPlanIndex = getPlanIndex(userPlan);
  const requiredPlanIndex = getPlanIndex(requiredPlan);

  return userPlanIndex >= requiredPlanIndex;
};

/**
 * Get the required plan for a feature
 * @param feature - The feature key
 * @returns The minimum required plan tier
 */
export const getRequiredPlan = (feature: FeatureKey): PlanTier => {
  return FEATURE_GATES[feature];
};

/**
 * Get all features available for a plan
 * @param plan - The plan tier
 * @returns Array of feature keys available for this plan
 */
export const getFeaturesForPlan = (plan: PlanTier): FeatureKey[] => {
  return (Object.keys(FEATURE_GATES) as FeatureKey[]).filter((feature) =>
    planHasFeature(plan, feature)
  );
};

/**
 * Get features that are locked for a plan
 * @param plan - The plan tier
 * @returns Array of feature keys that are locked for this plan
 */
export const getLockedFeatures = (plan: PlanTier): FeatureKey[] => {
  return (Object.keys(FEATURE_GATES) as FeatureKey[]).filter(
    (feature) => !planHasFeature(plan, feature)
  );
};

/**
 * Get user-friendly feature names
 */
export const FEATURE_NAMES: Record<FeatureKey, string> = {
  multipleServers: 'Multiple Servers',
  captchaFree: 'Captcha-Free Participation',
  premiumGiveaways: 'Premium Giveaways',
  raffleBoost: 'Raffle Entry Boost',
  autoFarm: 'Auto Farm',
  pointTransfer: 'Point Transfers',
  apiAccess: 'API Access',
  priorityProcessing: 'Priority Processing',
  xpBoost: 'XP Boost',
};

/**
 * Get user-friendly feature descriptions
 */
export const FEATURE_DESCRIPTIONS: Record<FeatureKey, string> = {
  multipleServers: 'Connect and manage multiple Discord servers',
  captchaFree: 'Skip captcha verification for faster participation',
  premiumGiveaways: 'Access exclusive premium-only giveaways',
  raffleBoost: 'Get extra raffle entries every month',
  autoFarm: 'Automatically farm points while you sleep',
  pointTransfer: 'Transfer points between servers with reduced fees',
  apiAccess: 'Access our API for custom integrations',
  priorityProcessing: 'Get priority in queues and faster processing',
  xpBoost: 'Earn bonus XP on all activities',
};
