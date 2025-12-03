/**
 * Stripe Client Initialization
 * Initializes and exports the Stripe.js client
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { stripeConfig } from './stripe-config';

/**
 * Stripe client instance (singleton)
 * This promise resolves to the Stripe instance
 */
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get Stripe instance
 * Uses singleton pattern to ensure only one instance is created
 * @returns Promise that resolves to Stripe instance or null
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripeConfig.publishableKey);
  }
  return stripePromise;
};

/**
 * Initialize Stripe (call this on app startup if needed)
 * This is optional - getStripe() will initialize on first call
 */
export const initializeStripe = async (): Promise<Stripe | null> => {
  return getStripe();
};
