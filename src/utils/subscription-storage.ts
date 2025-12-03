/**
 * Subscription Local Storage Utilities
 * Manages subscription data in localStorage (temporary MVP solution)
 * TODO: Replace with backend API calls when NestJS backend is implemented
 */

import { UserSubscription, PlanTier } from '@/types/subscription';

/**
 * LocalStorage key for subscription data
 */
const STORAGE_KEY = 'engageio_subscription';

/**
 * Save subscription to localStorage
 * @param userId - User ID
 * @param subscription - Subscription data
 */
export const saveSubscription = (
  userId: string,
  subscription: UserSubscription
): void => {
  try {
    const data = {
      ...subscription,
      currentPeriodStart: subscription.currentPeriodStart?.toISOString() || null,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString(),
    };
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save subscription to localStorage:', error);
  }
};

/**
 * Load subscription from localStorage
 * @param userId - User ID
 * @returns Subscription data or null if not found
 */
export const loadSubscription = (userId: string): UserSubscription | null => {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    if (!data) return null;

    const parsed = JSON.parse(data);
    return {
      ...parsed,
      currentPeriodStart: parsed.currentPeriodStart
        ? new Date(parsed.currentPeriodStart)
        : null,
      currentPeriodEnd: parsed.currentPeriodEnd
        ? new Date(parsed.currentPeriodEnd)
        : null,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
    };
  } catch (error) {
    console.error('Failed to load subscription from localStorage:', error);
    return null;
  }
};

/**
 * Clear subscription from localStorage
 * @param userId - User ID (optional, clears all if not provided)
 */
export const clearSubscription = (userId?: string): void => {
  try {
    if (userId) {
      localStorage.removeItem(`${STORAGE_KEY}_${userId}`);
    } else {
      // Clear all subscription data
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_KEY)) {
          localStorage.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.error('Failed to clear subscription from localStorage:', error);
  }
};

/**
 * Update subscription field
 * @param userId - User ID
 * @param field - Field to update
 * @param value - New value
 */
export const updateSubscriptionField = (
  userId: string,
  field: keyof UserSubscription,
  value: any
): void => {
  try {
    const subscription = loadSubscription(userId);
    if (!subscription) return;

    const updated: UserSubscription = {
      ...subscription,
      [field]: value,
      updatedAt: new Date(),
    };

    saveSubscription(userId, updated);
  } catch (error) {
    console.error('Failed to update subscription field:', error);
  }
};

/**
 * Create default subscription for new user
 * @param userId - User ID
 * @returns Default free subscription
 */
export const createDefaultSubscription = (userId: string): UserSubscription => {
  const now = new Date();
  const subscription: UserSubscription = {
    userId,
    plan: 'free',
    status: 'active',
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripePriceId: null,
    currentPeriodStart: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    createdAt: now,
    updatedAt: now,
  };

  saveSubscription(userId, subscription);
  return subscription;
};

/**
 * Update subscription plan
 * @param userId - User ID
 * @param plan - New plan tier
 * @param stripeData - Optional Stripe data
 */
export const updateSubscriptionPlan = (
  userId: string,
  plan: PlanTier,
  stripeData?: {
    stripeSubscriptionId?: string;
    stripePriceId?: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
  }
): void => {
  try {
    const subscription = loadSubscription(userId) || createDefaultSubscription(userId);

    const updated: UserSubscription = {
      ...subscription,
      plan,
      status: 'active',
      stripeSubscriptionId: stripeData?.stripeSubscriptionId || subscription.stripeSubscriptionId,
      stripePriceId: stripeData?.stripePriceId || subscription.stripePriceId,
      currentPeriodStart: stripeData?.currentPeriodStart || subscription.currentPeriodStart,
      currentPeriodEnd: stripeData?.currentPeriodEnd || subscription.currentPeriodEnd,
      cancelAtPeriodEnd: false,
      updatedAt: new Date(),
    };

    saveSubscription(userId, updated);
  } catch (error) {
    console.error('Failed to update subscription plan:', error);
  }
};
