/**
 * Stripe Error Handling Utilities
 * Maps Stripe errors to user-friendly messages
 */

import { StripeError } from '@stripe/stripe-js';

/**
 * Get user-friendly error message from Stripe error
 * @param error - Stripe error or generic error
 * @returns User-friendly error message
 */
export const getStripeErrorMessage = (error: any): string => {
  // Handle Stripe-specific errors
  if (error && typeof error === 'object' && 'type' in error) {
    const stripeError = error as StripeError;

    switch (stripeError.type) {
      case 'card_error':
        return stripeError.message || 'Your card was declined. Please try another payment method.';

      case 'validation_error':
        return stripeError.message || 'Invalid payment information. Please check your details.';

      case 'invalid_request_error':
        return 'There was an error processing your request. Please try again.';

      case 'api_error':
        return 'Our payment system is temporarily unavailable. Please try again in a few moments.';

      case 'api_connection_error':
        return 'Unable to connect to payment system. Please check your internet connection.';

      case 'authentication_error':
        return 'Payment authentication failed. Please contact support.';

      case 'rate_limit_error':
        return 'Too many requests. Please wait a moment and try again.';

      default:
        return stripeError.message || 'An unexpected error occurred. Please try again.';
    }
  }

  // Handle generic errors
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Check if error is a card decline
 * @param error - Error object
 * @returns true if card was declined
 */
export const isCardDeclineError = (error: any): boolean => {
  return error?.type === 'card_error' && error?.decline_code !== undefined;
};

/**
 * Check if error requires user action
 * @param error - Error object
 * @returns true if user action is required
 */
export const requiresUserAction = (error: any): boolean => {
  return error?.type === 'card_error' || error?.type === 'validation_error';
};

/**
 * Get decline code details
 * @param declineCode - Stripe decline code
 * @returns User-friendly message for decline code
 */
export const getDeclineCodeMessage = (declineCode?: string): string => {
  if (!declineCode) return 'Your card was declined.';

  const messages: Record<string, string> = {
    insufficient_funds: 'Your card has insufficient funds.',
    lost_card: 'This card has been reported as lost.',
    stolen_card: 'This card has been reported as stolen.',
    expired_card: 'Your card has expired.',
    incorrect_cvc: 'The CVC code is incorrect.',
    processing_error: 'An error occurred while processing your card.',
    incorrect_number: 'The card number is incorrect.',
    invalid_expiry_year: 'The expiration year is invalid.',
    invalid_expiry_month: 'The expiration month is invalid.',
    card_not_supported: 'This type of card is not supported.',
    currency_not_supported: 'This currency is not supported by your card.',
    duplicate_transaction: 'This transaction appears to be a duplicate.',
    fraudulent: 'This transaction has been flagged as potentially fraudulent.',
    generic_decline: 'Your card was declined. Please try another payment method.',
    invalid_account: 'The card account is invalid.',
    invalid_amount: 'The payment amount is invalid.',
    card_velocity_exceeded: 'You have exceeded the balance or credit limit on your card.',
    merchant_blacklist: 'Your card has been declined.',
    pickup_card: 'Your card cannot be used. Please contact your bank.',
    restricted_card: 'Your card has restrictions on it.',
    security_violation: 'Your card has been declined due to a security violation.',
    service_not_allowed: 'Your card does not support this type of purchase.',
    transaction_not_allowed: 'This transaction is not allowed on your card.',
  };

  return messages[declineCode] || 'Your card was declined. Please try another payment method.';
};

/**
 * Log Stripe error for debugging (in development)
 * @param error - Error object
 * @param context - Additional context
 */
export const logStripeError = (error: any, context?: string): void => {
  if (import.meta.env.DEV) {
    console.error('[Stripe Error]', context || 'Payment error:', error);
  }
};
