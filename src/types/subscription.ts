/**
 * Subscription Type Definitions
 * Types for subscription plans, user subscriptions, and feature gates
 */

/**
 * Plan tier levels
 */
export type PlanTier = 'free' | 'silver' | 'gold' | 'diamond';

/**
 * Subscription status from Stripe
 */
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'incomplete'
  | 'trialing'
  | 'incomplete_expired'
  | 'unpaid';

/**
 * Billing interval
 */
export type BillingInterval = 'month' | 'year';

/**
 * Plan feature definition
 */
export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: number | string;
  description?: string;
}

/**
 * Plan definition
 */
export interface Plan {
  id: PlanTier;
  name: string;
  price: number;
  interval: BillingInterval | null;
  description: string;
  features: PlanFeature[];
  stripeProductId: string | null;
  stripePriceId: string | null;
  popular?: boolean;
  cta: string;
}

/**
 * User subscription data
 */
export interface UserSubscription {
  userId: string;
  plan: PlanTier;
  status: SubscriptionStatus;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Feature keys that can be gated by plan
 */
export type FeatureKey =
  | 'autoFarm'
  | 'multipleServers'
  | 'captchaFree'
  | 'apiAccess'
  | 'priorityProcessing'
  | 'pointTransfer'
  | 'premiumGiveaways'
  | 'raffleBoost'
  | 'xpBoost';

/**
 * Feature gate definition
 */
export interface FeatureGate {
  key: FeatureKey;
  requiredPlan: PlanTier;
  enabled: boolean;
  description?: string;
}

/**
 * Subscription context type
 */
export interface SubscriptionContextType {
  subscription: UserSubscription | null;
  loading: boolean;
  error: Error | null;
  currentPlan: PlanTier;
  hasFeature: (feature: FeatureKey) => boolean;
  upgradeToPlan: (priceId: string, planTier: PlanTier) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  reactivateSubscription: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}
