/**
 * Subscription Context
 * Provides subscription state and methods to the entire application
 */

import { createContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type {
  UserSubscription,
  SubscriptionContextType,
  PlanTier,
  FeatureKey,
} from '@/types/subscription';
import { planHasFeature } from '@/config/feature-gates';
import * as paymentService from '@/services/payment.service';

/**
 * Subscription Context
 * Use useSubscription() hook to access this context
 */
export const SubscriptionContext = createContext<
  SubscriptionContextType | undefined
>(undefined);

/**
 * Subscription Provider Props
 */
interface SubscriptionProviderProps {
  children: ReactNode;
}

/**
 * Subscription Provider Component
 * Wraps the app and provides subscription state to all children
 */
export const SubscriptionProvider = ({
  children,
}: SubscriptionProviderProps) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load subscription when user changes
  useEffect(() => {
    if (user) {
      loadSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  /**
   * Load subscription from storage
   */
  const loadSubscription = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Initialize or load subscription
      const sub = await paymentService.initializeSubscription(user.uid);
      setSubscription(sub);
    } catch (err) {
      console.error('Failed to load subscription:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get current plan tier
   */
  const currentPlan: PlanTier = subscription?.plan || 'free';

  /**
   * Check if user has access to a feature
   */
  const hasFeature = (feature: FeatureKey): boolean => {
    return planHasFeature(currentPlan, feature);
  };

  /**
   * Upgrade to a new plan
   * Navigates to checkout page
   */
  const upgradeToPlan = async (
    _priceId: string,
    planTier: PlanTier
  ): Promise<void> => {
    if (!user) {
      throw new Error('User must be logged in to upgrade');
    }

    // Navigate to checkout page with selected plan
    window.location.href = `/checkout?plan=${planTier}`;
  };

  /**
   * Cancel subscription
   */
  const cancelSubscription = async (): Promise<void> => {
    if (!user) {
      throw new Error('User must be logged in to cancel subscription');
    }

    try {
      setError(null);
      await paymentService.cancelSubscription(user.uid);

      // Reload subscription
      await loadSubscription();
    } catch (err) {
      console.error('Failed to cancel subscription:', err);
      setError(err as Error);
      throw err;
    }
  };

  /**
   * Reactivate canceled subscription
   */
  const reactivateSubscription = async (): Promise<void> => {
    if (!user) {
      throw new Error('User must be logged in to reactivate subscription');
    }

    try {
      setError(null);
      await paymentService.reactivateSubscription(user.uid);

      // Reload subscription
      await loadSubscription();
    } catch (err) {
      console.error('Failed to reactivate subscription:', err);
      setError(err as Error);
      throw err;
    }
  };

  /**
   * Refresh subscription data
   */
  const refreshSubscription = async (): Promise<void> => {
    await loadSubscription();
  };

  // Context value
  const value: SubscriptionContextType = {
    subscription,
    loading,
    error,
    currentPlan,
    hasFeature,
    upgradeToPlan,
    cancelSubscription,
    reactivateSubscription,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
