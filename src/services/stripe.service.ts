/**
 * Stripe Service Layer
 * Handles all Stripe-related operations
 *
 * IMPORTANT: This is a frontend-only MVP implementation.
 * In production, checkout session creation and subscription management
 * should be handled by a backend API (NestJS) with proper security.
 */

import { getStripe } from '@/lib/stripe';
import { getCheckoutUrls } from '@/lib/stripe-config';
import { CheckoutSession } from '@/types/payment';
import { PlanTier, UserSubscription } from '@/types/subscription';
import {
  loadSubscription,
  saveSubscription,
  updateSubscriptionPlan,
  createDefaultSubscription,
} from '@/utils/subscription-storage';
import { getStripeErrorMessage, logStripeError } from '@/utils/stripe-errors';

/**
 * Create Stripe Checkout Session
 *
 * NOTE: This is a simplified frontend-only version.
 * In production, this should call a backend API endpoint that creates
 * the session server-side and returns the session ID.
 *
 * For MVP, we redirect directly to Stripe with test data.
 *
 * @param priceId - Stripe price ID
 * @param userId - User ID
 * @param userEmail - User email
 * @param planTier - Plan tier being purchased
 * @returns Checkout session data
 */
export const createCheckoutSession = async (
  priceId: string,
  userId: string,
  userEmail: string,
  planTier: PlanTier
): Promise<CheckoutSession> => {
  try {
    const { successUrl, cancelUrl } = getCheckoutUrls();

    // TODO: Backend Implementation
    // const response = await fetch('/api/subscriptions/checkout', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     priceId,
    //     userId,
    //     userEmail,
    //     successUrl,
    //     cancelUrl,
    //   }),
    // });
    // const { sessionId } = await response.json();

    // TEMPORARY: For MVP, we'll use Stripe's client-side checkout
    // This is for demonstration only - production must use backend
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // Store the intended plan in sessionStorage for post-checkout processing
    sessionStorage.setItem('pending_plan_upgrade', JSON.stringify({
      planTier,
      priceId,
      userId,
      timestamp: Date.now(),
    }));

    // For MVP, we'll create a mock session ID and use Stripe's redirect
    // In production, the backend creates the real session
    const mockSessionId = `mock_session_${Date.now()}_${userId}`;

    // Return mock session data
    // In production, this would be real session data from backend
    return {
      sessionId: mockSessionId,
      url: successUrl.replace('{CHECKOUT_SESSION_ID}', mockSessionId),
    };
  } catch (error) {
    logStripeError(error, 'createCheckoutSession');
    throw new Error(getStripeErrorMessage(error));
  }
};

/**
 * Redirect to Stripe Checkout
 *
 * @param sessionId - Checkout session ID
 */
export const redirectToCheckout = async (sessionId: string): Promise<void> => {
  try {
    // For MVP demo, we'll simulate checkout success
    // In production, this would redirect to actual Stripe Checkout:
    // const stripe = await getStripe();
    // if (!stripe) throw new Error('Stripe failed to load');
    // const { error } = await stripe.redirectToCheckout({ sessionId });
    // if (error) throw error;

    // For MVP, we'll redirect to success page immediately
    // This simulates a successful payment
    const { successUrl } = getCheckoutUrls();
    const url = successUrl.replace('{CHECKOUT_SESSION_ID}', sessionId);
    window.location.href = url;
  } catch (error) {
    logStripeError(error, 'redirectToCheckout');
    throw new Error(getStripeErrorMessage(error));
  }
};

/**
 * Handle successful checkout
 * Called when user returns from Stripe checkout success page
 *
 * @param sessionId - Checkout session ID
 * @param userId - User ID
 */
export const handleCheckoutSuccess = async (
  sessionId: string,
  userId: string
): Promise<void> => {
  try {
    // Retrieve pending plan upgrade from sessionStorage
    const pendingUpgrade = sessionStorage.getItem('pending_plan_upgrade');
    if (!pendingUpgrade) {
      console.warn('No pending upgrade found in sessionStorage');
      return;
    }

    const { planTier, priceId } = JSON.parse(pendingUpgrade);

    // Calculate subscription dates
    const now = new Date();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    // Update subscription in localStorage
    updateSubscriptionPlan(userId, planTier, {
      stripeSubscriptionId: `sub_${sessionId}`,
      stripePriceId: priceId,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    });

    // Clear pending upgrade
    sessionStorage.removeItem('pending_plan_upgrade');

    // TODO: Backend Implementation
    // In production, this would verify the session with backend:
    // await fetch(`/api/subscriptions/verify/${sessionId}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId }),
    // });
  } catch (error) {
    logStripeError(error, 'handleCheckoutSuccess');
    throw new Error('Failed to process checkout success');
  }
};

/**
 * Get current subscription status
 *
 * @param userId - User ID
 * @returns User subscription or null
 */
export const getSubscriptionStatus = (userId: string): UserSubscription | null => {
  return loadSubscription(userId);
};

/**
 * Initialize subscription for new user
 *
 * @param userId - User ID
 * @returns Default free subscription
 */
export const initializeSubscription = (userId: string): UserSubscription => {
  let subscription = loadSubscription(userId);
  if (!subscription) {
    subscription = createDefaultSubscription(userId);
  }
  return subscription;
};

/**
 * Cancel subscription
 * Marks subscription for cancellation at period end
 *
 * @param userId - User ID
 */
export const cancelSubscription = async (userId: string): Promise<void> => {
  try {
    const subscription = loadSubscription(userId);
    if (!subscription) {
      throw new Error('No subscription found');
    }

    // Update subscription to cancel at period end
    const updated: UserSubscription = {
      ...subscription,
      cancelAtPeriodEnd: true,
      updatedAt: new Date(),
    };

    saveSubscription(userId, updated);

    // TODO: Backend Implementation
    // await fetch('/api/subscriptions/cancel', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId }),
    // });
  } catch (error) {
    logStripeError(error, 'cancelSubscription');
    throw new Error('Failed to cancel subscription');
  }
};

/**
 * Reactivate canceled subscription
 *
 * @param userId - User ID
 */
export const reactivateSubscription = async (userId: string): Promise<void> => {
  try {
    const subscription = loadSubscription(userId);
    if (!subscription) {
      throw new Error('No subscription found');
    }

    // Remove cancellation flag
    const updated: UserSubscription = {
      ...subscription,
      cancelAtPeriodEnd: false,
      updatedAt: new Date(),
    };

    saveSubscription(userId, updated);

    // TODO: Backend Implementation
    // await fetch('/api/subscriptions/reactivate', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId }),
    // });
  } catch (error) {
    logStripeError(error, 'reactivateSubscription');
    throw new Error('Failed to reactivate subscription');
  }
};

/**
 * Downgrade to free plan
 * Immediate downgrade to free plan
 *
 * @param userId - User ID
 */
export const downgradeToFree = async (userId: string): Promise<void> => {
  try {
    const subscription = loadSubscription(userId);
    if (!subscription) {
      throw new Error('No subscription found');
    }

    // Update to free plan
    const updated: UserSubscription = {
      ...subscription,
      plan: 'free',
      status: 'active',
      stripeSubscriptionId: null,
      stripePriceId: null,
      currentPeriodStart: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      updatedAt: new Date(),
    };

    saveSubscription(userId, updated);

    // TODO: Backend Implementation
    // await fetch('/api/subscriptions/downgrade', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId }),
    // });
  } catch (error) {
    logStripeError(error, 'downgradeToFree');
    throw new Error('Failed to downgrade subscription');
  }
};

/**
 * Get Stripe Customer Portal URL
 * (For future implementation with backend)
 *
 * @param userId - User ID
 * @returns Customer portal URL
 */
export const getCustomerPortalUrl = async (userId: string): Promise<string> => {
  try {
    // TODO: Backend Implementation
    // const response = await fetch('/api/billing/portal', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId }),
    // });
    // const { url } = await response.json();
    // return url;

    // For MVP, return placeholder
    throw new Error('Customer portal not yet implemented. Use billing settings page.');
  } catch (error) {
    logStripeError(error, 'getCustomerPortalUrl');
    throw new Error('Failed to get customer portal URL');
  }
};
