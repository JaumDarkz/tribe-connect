/**
 * Checkout Type Definitions
 * Types for payment processing, checkout sessions, and crypto payments
 */

import { PlanTier } from './subscription';

/**
 * Payment method types
 */
export type PaymentMethodType = 'card' | 'crypto';

/**
 * Supported cryptocurrencies
 */
export type CryptoCurrency = 'SOL' | 'ETH' | 'BTC';

/**
 * Checkout wizard steps
 */
export type CheckoutStep = 'review' | 'payment' | 'confirm';

/**
 * Checkout session status
 */
export type CheckoutSessionStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'expired';

/**
 * Card payment details
 */
export interface CardPaymentDetails {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  cardholderName: string;
  billingZip?: string;
}

/**
 * Crypto payment details
 */
export interface CryptoPaymentDetails {
  currency: CryptoCurrency;
  walletAddress: string;
  transactionHash?: string;
  network?: string;
}

/**
 * Coupon data
 */
export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiresAt?: Date;
  minPurchase?: number;
  maxUses?: number;
  currentUses?: number;
}

/**
 * Applied coupon result
 */
export interface AppliedCoupon {
  coupon: Coupon;
  discountAmount: number;
  originalPrice: number;
  finalPrice: number;
}

/**
 * Checkout session
 */
export interface CheckoutSession {
  id: string;
  userId: string;
  planTier: PlanTier;
  paymentMethod: PaymentMethodType;
  status: CheckoutSessionStatus;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  currency: string;
  appliedCoupon?: AppliedCoupon;
  cryptoDetails?: CryptoPaymentDetails;
  createdAt: Date;
  expiresAt: Date;
  completedAt?: Date;
}

/**
 * Create checkout session params
 */
export interface CreateCheckoutSessionParams {
  userId: string;
  userEmail: string;
  planTier: PlanTier;
  paymentMethod: PaymentMethodType;
  couponCode?: string;
}

/**
 * Verify payment params
 */
export interface VerifyPaymentParams {
  sessionId: string;
  paymentMethod: PaymentMethodType;
  cardDetails?: CardPaymentDetails;
  cryptoDetails?: CryptoPaymentDetails;
}

/**
 * Checkout state for wizard
 */
export interface CheckoutState {
  currentStep: CheckoutStep;
  selectedPlan: PlanTier;
  paymentMethod: PaymentMethodType;
  selectedCrypto?: CryptoCurrency;
  couponCode: string;
  appliedCoupon?: AppliedCoupon;
  session?: CheckoutSession;
  loading: boolean;
  error: string | null;
}

/**
 * Testimonial data
 */
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  content: string;
  rating: number;
  planTier: PlanTier;
}

/**
 * Crypto wallet connection state
 */
export interface CryptoWalletState {
  connected: boolean;
  address?: string;
  currency?: CryptoCurrency;
  balance?: number;
  network?: string;
}

/**
 * Crypto payment info from API
 */
export interface CryptoPaymentInfo {
  address: string;
  network: string;
  amount: number;
  currency: CryptoCurrency;
  expiresAt: Date;
}
