/**
 * Payment Type Definitions
 * Types for Stripe payments, checkout sessions, and invoices
 */

/**
 * Stripe Checkout session
 */
export interface CheckoutSession {
  sessionId: string;
  url: string;
}

/**
 * Payment method (card)
 */
export interface PaymentMethod {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
}

/**
 * Invoice status
 */
export type InvoiceStatus = 'paid' | 'open' | 'void' | 'uncollectible' | 'draft';

/**
 * Invoice data
 */
export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  createdAt: Date;
  paidAt: Date | null;
  hostedInvoiceUrl: string | null;
  invoicePdf: string | null;
  description: string | null;
}

/**
 * Checkout session create params
 */
export interface CreateCheckoutSessionParams {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Payment intent status
 */
export type PaymentIntentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'requires_capture'
  | 'canceled'
  | 'succeeded';
