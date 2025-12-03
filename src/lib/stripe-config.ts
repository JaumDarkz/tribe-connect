/**
 * Stripe Configuration
 * Validates and exports Stripe configuration values
 */

/**
 * Get Stripe publishable key from environment
 * @throws {Error} If publishable key is not set
 */
const getStripePublishableKey = (): string => {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  if (!key) {
    throw new Error(
      'Missing VITE_STRIPE_PUBLISHABLE_KEY environment variable. ' +
        'Please add it to your .env file.'
    );
  }

  // Validate key format
  if (!key.startsWith('pk_')) {
    throw new Error(
      'Invalid Stripe publishable key format. ' +
        'Key should start with "pk_test_" or "pk_live_"'
    );
  }

  return key;
};

/**
 * Stripe Configuration Object
 */
export const stripeConfig = {
  publishableKey: getStripePublishableKey(),
  isTestMode: getStripePublishableKey().startsWith('pk_test_'),
} as const;

/**
 * Check if Stripe is in test mode
 */
export const isStripeTestMode = (): boolean => {
  return stripeConfig.isTestMode;
};

/**
 * Success and cancel URLs for Stripe Checkout
 */
export const getCheckoutUrls = () => {
  const baseUrl = window.location.origin;
  return {
    successUrl: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${baseUrl}/payment/cancel`,
  };
};
