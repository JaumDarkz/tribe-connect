/**
 * Payment Service Layer
 * Handles all payment-related operations with API integration
 *
 * NOTE: This contains MVP frontend implementation with localStorage.
 * In production, all payment processing is handled by backend API.
 */

import {
  CheckoutSession,
  CreateCheckoutSessionParams,
  VerifyPaymentParams,
  AppliedCoupon,
  CryptoCurrency,
  CryptoPaymentInfo,
} from '@/types/checkout';
import { PlanTier } from '@/types/subscription';
import {
  loadSubscription,
  saveSubscription,
  updateSubscriptionPlan,
  createDefaultSubscription,
} from '@/utils/subscription-storage';

// API Base URL (configure in env)
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// Plan prices mapping
const PLAN_PRICES: Record<PlanTier, number> = {
  free: 0,
  silver: 5.99,
  gold: 11.99,
  diamond: 17.99,
};

/**
 * Create a new checkout session
 * POST /checkout/create-session
 */
export const createCheckoutSession = async (
  params: CreateCheckoutSessionParams
): Promise<CheckoutSession> => {
  try {
    if (API_BASE) {
      const response = await fetch(`${API_BASE}/checkout/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('Failed to create checkout session');
      return await response.json();
    }

    // MVP: Generate mock session
    const sessionId = `session_${Date.now()}_${params.userId.slice(0, 8)}`;

    const session: CheckoutSession = {
      id: sessionId,
      userId: params.userId,
      planTier: params.planTier,
      paymentMethod: params.paymentMethod,
      status: 'pending',
      originalAmount: PLAN_PRICES[params.planTier],
      discountAmount: 0,
      finalAmount: PLAN_PRICES[params.planTier],
      currency: 'USD',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    };

    // Store session
    sessionStorage.setItem('checkout_session', JSON.stringify(session));

    return session;
  } catch (error) {
    console.error('[PaymentService] createCheckoutSession error:', error);
    throw new Error('Failed to create checkout session');
  }
};

/**
 * Get checkout session by ID
 * GET /checkout/session/:id
 */
export const getCheckoutSession = async (
  sessionId: string
): Promise<CheckoutSession | null> => {
  try {
    if (API_BASE) {
      const response = await fetch(`${API_BASE}/checkout/session/${sessionId}`);
      if (!response.ok) return null;
      return await response.json();
    }

    // MVP: Load from sessionStorage
    const stored = sessionStorage.getItem('checkout_session');
    if (!stored) return null;

    const session = JSON.parse(stored);
    if (session.id !== sessionId) return null;

    return {
      ...session,
      createdAt: new Date(session.createdAt),
      expiresAt: new Date(session.expiresAt),
      completedAt: session.completedAt ? new Date(session.completedAt) : undefined,
    };
  } catch (error) {
    console.error('[PaymentService] getCheckoutSession error:', error);
    return null;
  }
};

/**
 * Verify and process payment
 * POST /checkout/verify-payment
 */
export const verifyPayment = async (
  params: VerifyPaymentParams
): Promise<{ success: boolean; session: CheckoutSession }> => {
  try {
    if (API_BASE) {
      const response = await fetch(`${API_BASE}/checkout/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('Payment verification failed');
      return await response.json();
    }

    // MVP: Simulate payment verification
    const stored = sessionStorage.getItem('checkout_session');
    if (!stored) throw new Error('Session not found');

    const session: CheckoutSession = JSON.parse(stored);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update session status
    session.status = 'completed';
    session.completedAt = new Date();

    if (params.cryptoDetails) {
      session.cryptoDetails = params.cryptoDetails;
    }

    sessionStorage.setItem('checkout_session', JSON.stringify(session));

    return { success: true, session };
  } catch (error) {
    console.error('[PaymentService] verifyPayment error:', error);
    throw new Error('Payment verification failed');
  }
};

/**
 * Apply coupon code
 * POST /checkout/apply-coupon
 */
export const applyCoupon = async (
  sessionId: string,
  couponCode: string
): Promise<AppliedCoupon | null> => {
  try {
    if (API_BASE) {
      const response = await fetch(`${API_BASE}/checkout/apply-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, couponCode }),
      });
      if (!response.ok) return null;
      return await response.json();
    }

    // MVP: Mock coupon validation
    const validCoupons: Record<string, { type: 'percentage' | 'fixed'; value: number }> = {
      POWER10: { type: 'percentage', value: 10 },
      FIRST20: { type: 'percentage', value: 20 },
      SAVE5: { type: 'fixed', value: 5 },
      WELCOME: { type: 'percentage', value: 15 },
    };

    const couponData = validCoupons[couponCode.toUpperCase()];
    if (!couponData) return null;

    const stored = sessionStorage.getItem('checkout_session');
    if (!stored) return null;

    const session: CheckoutSession = JSON.parse(stored);

    let discountAmount: number;
    if (couponData.type === 'percentage') {
      discountAmount = session.originalAmount * (couponData.value / 100);
    } else {
      discountAmount = Math.min(couponData.value, session.originalAmount);
    }

    // Round to 2 decimal places
    discountAmount = Math.round(discountAmount * 100) / 100;

    const applied: AppliedCoupon = {
      coupon: {
        code: couponCode.toUpperCase(),
        discountType: couponData.type,
        discountValue: couponData.value,
      },
      discountAmount,
      originalPrice: session.originalAmount,
      finalPrice: Math.round((session.originalAmount - discountAmount) * 100) / 100,
    };

    // Update session
    session.discountAmount = discountAmount;
    session.finalAmount = applied.finalPrice;
    session.appliedCoupon = applied;
    sessionStorage.setItem('checkout_session', JSON.stringify(session));

    return applied;
  } catch (error) {
    console.error('[PaymentService] applyCoupon error:', error);
    return null;
  }
};

/**
 * Remove applied coupon
 */
export const removeCoupon = async (sessionId: string): Promise<boolean> => {
  try {
    if (API_BASE) {
      const response = await fetch(`${API_BASE}/checkout/remove-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      return response.ok;
    }

    // MVP: Remove from session
    const stored = sessionStorage.getItem('checkout_session');
    if (!stored) return false;

    const session: CheckoutSession = JSON.parse(stored);
    session.discountAmount = 0;
    session.finalAmount = session.originalAmount;
    session.appliedCoupon = undefined;
    sessionStorage.setItem('checkout_session', JSON.stringify(session));

    return true;
  } catch (error) {
    console.error('[PaymentService] removeCoupon error:', error);
    return false;
  }
};

/**
 * Get crypto payment info
 */
export const getCryptoPaymentInfo = async (
  sessionId: string,
  currency: CryptoCurrency
): Promise<CryptoPaymentInfo> => {
  try {
    if (API_BASE) {
      const response = await fetch(
        `${API_BASE}/checkout/crypto-address?sessionId=${sessionId}&currency=${currency}`
      );
      if (!response.ok) throw new Error('Failed to get crypto address');
      return await response.json();
    }

    // MVP: Return mock addresses
    const addresses: Record<CryptoCurrency, { address: string; network: string }> = {
      SOL: {
        address: 'So11111111111111111111111111111111111111112',
        network: 'Solana Mainnet',
      },
      ETH: {
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f00000',
        network: 'Ethereum Mainnet',
      },
      BTC: {
        address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
        network: 'Bitcoin Mainnet',
      },
    };

    const stored = sessionStorage.getItem('checkout_session');
    const session: CheckoutSession = stored ? JSON.parse(stored) : null;

    return {
      ...addresses[currency],
      amount: session?.finalAmount || 0,
      currency,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    };
  } catch (error) {
    console.error('[PaymentService] getCryptoPaymentInfo error:', error);
    throw new Error('Failed to get crypto payment info');
  }
};

/**
 * Handle successful checkout - update subscription
 */
export const handleCheckoutComplete = async (
  userId: string,
  planTier: PlanTier
): Promise<void> => {
  const now = new Date();
  const periodEnd = new Date();
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  updateSubscriptionPlan(userId, planTier, {
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
  });

  // Clear checkout session
  sessionStorage.removeItem('checkout_session');
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (userId: string): Promise<void> => {
  try {
    if (API_BASE) {
      const response = await fetch(`${API_BASE}/subscriptions/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to cancel subscription');
      return;
    }

    // MVP: Update local storage
    const subscription = loadSubscription(userId);
    if (subscription) {
      saveSubscription(userId, {
        ...subscription,
        cancelAtPeriodEnd: true,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error('[PaymentService] cancelSubscription error:', error);
    throw new Error('Failed to cancel subscription');
  }
};

/**
 * Reactivate subscription
 */
export const reactivateSubscription = async (userId: string): Promise<void> => {
  try {
    if (API_BASE) {
      const response = await fetch(`${API_BASE}/subscriptions/reactivate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to reactivate subscription');
      return;
    }

    // MVP: Update local storage
    const subscription = loadSubscription(userId);
    if (subscription) {
      saveSubscription(userId, {
        ...subscription,
        cancelAtPeriodEnd: false,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error('[PaymentService] reactivateSubscription error:', error);
    throw new Error('Failed to reactivate subscription');
  }
};

/**
 * Downgrade to free plan
 */
export const downgradeToFree = async (userId: string): Promise<void> => {
  try {
    if (API_BASE) {
      const response = await fetch(`${API_BASE}/subscriptions/downgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to downgrade subscription');
      return;
    }

    // MVP: Update local storage
    updateSubscriptionPlan(userId, 'free');
  } catch (error) {
    console.error('[PaymentService] downgradeToFree error:', error);
    throw new Error('Failed to downgrade subscription');
  }
};

/**
 * Initialize subscription for user
 */
export const initializeSubscription = async (userId: string) => {
  const existing = loadSubscription(userId);
  if (existing) return existing;
  return createDefaultSubscription(userId);
};

/**
 * Get subscription status
 */
export const getSubscriptionStatus = async (userId: string) => {
  if (API_BASE) {
    try {
      const response = await fetch(`${API_BASE}/subscriptions/status/${userId}`);
      if (response.ok) return await response.json();
    } catch (error) {
      console.error('[PaymentService] getSubscriptionStatus error:', error);
    }
  }
  return loadSubscription(userId);
};

// Re-export subscription utilities
export {
  loadSubscription,
  saveSubscription,
  createDefaultSubscription,
  updateSubscriptionPlan,
};
