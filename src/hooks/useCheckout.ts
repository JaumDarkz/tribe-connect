/**
 * useCheckout Hook
 * Manages checkout wizard state and operations
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import {
  CheckoutState,
  CheckoutStep,
  PaymentMethodType,
  CryptoCurrency,
  CardPaymentDetails,
  CryptoPaymentDetails,
} from '@/types/checkout';
import { PlanTier } from '@/types/subscription';
import { getPlanByTier } from '@/config/plans';
import * as paymentService from '@/services/payment.service';

const STEPS: CheckoutStep[] = ['review', 'payment', 'confirm'];

const INITIAL_STATE: CheckoutState = {
  currentStep: 'review',
  selectedPlan: 'silver',
  paymentMethod: 'card',
  couponCode: '',
  loading: false,
  error: null,
};

export const useCheckout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const [state, setState] = useState<CheckoutState>(INITIAL_STATE);

  // Initialize from URL params
  useEffect(() => {
    const plan = searchParams.get('plan') as PlanTier | null;
    if (plan && ['silver', 'gold', 'diamond'].includes(plan)) {
      setState((prev) => ({ ...prev, selectedPlan: plan }));
    }
  }, [searchParams]);

  // Get plan details
  const planDetails = getPlanByTier(state.selectedPlan);

  // Calculate pricing
  const originalPrice = planDetails.price;
  const discountAmount = state.appliedCoupon?.discountAmount || 0;
  const finalPrice = Math.round((originalPrice - discountAmount) * 100) / 100;

  // Get current step index
  const currentStepIndex = STEPS.indexOf(state.currentStep);

  // Navigation
  const goToStep = useCallback((step: CheckoutStep) => {
    setState((prev) => ({ ...prev, currentStep: step, error: null }));
  }, []);

  const nextStep = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      goToStep(STEPS[nextIndex]);
    }
  }, [currentStepIndex, goToStep]);

  const prevStep = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      goToStep(STEPS[prevIndex]);
    }
  }, [currentStepIndex, goToStep]);

  // Check if can go to next step
  const canGoNext = useCallback(() => {
    if (state.currentStep === 'payment' && state.paymentMethod === 'crypto' && !state.selectedCrypto) {
      return false;
    }
    return true;
  }, [state.currentStep, state.paymentMethod, state.selectedCrypto]);

  // Select plan
  const selectPlan = useCallback((plan: PlanTier) => {
    setState((prev) => ({
      ...prev,
      selectedPlan: plan,
      appliedCoupon: undefined, // Reset coupon on plan change
      session: undefined,
    }));
  }, []);

  // Select payment method
  const selectPaymentMethod = useCallback((method: PaymentMethodType) => {
    setState((prev) => ({
      ...prev,
      paymentMethod: method,
      selectedCrypto: method === 'card' ? undefined : prev.selectedCrypto,
    }));
  }, []);

  // Select crypto currency
  const selectCrypto = useCallback((crypto: CryptoCurrency) => {
    setState((prev) => ({ ...prev, selectedCrypto: crypto }));
  }, []);

  // Create or get session
  const ensureSession = useCallback(async () => {
    if (state.session) return state.session;

    if (!user) {
      throw new Error('User must be authenticated');
    }

    const session = await paymentService.createCheckoutSession({
      userId: user.uid,
      userEmail: user.email || '',
      planTier: state.selectedPlan,
      paymentMethod: state.paymentMethod,
    });

    setState((prev) => ({ ...prev, session }));
    return session;
  }, [state.session, state.selectedPlan, state.paymentMethod, user]);

  // Apply coupon
  const applyCoupon = useCallback(
    async (code: string): Promise<boolean> => {
      if (!code.trim()) return false;

      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const session = await ensureSession();

        const applied = await paymentService.applyCoupon(session.id, code);

        if (applied) {
          setState((prev) => ({
            ...prev,
            couponCode: code,
            appliedCoupon: applied,
            loading: false,
          }));
          toast({
            title: 'Coupon Applied!',
            description: `You saved $${applied.discountAmount.toFixed(2)}`,
          });
          return true;
        } else {
          setState((prev) => ({ ...prev, loading: false }));
          toast({
            title: 'Invalid Coupon',
            description: 'This coupon code is not valid or has expired.',
            variant: 'destructive',
          });
          return false;
        }
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false }));
        toast({
          title: 'Error',
          description: 'Failed to apply coupon. Please try again.',
          variant: 'destructive',
        });
        return false;
      }
    },
    [ensureSession, toast]
  );

  // Remove coupon
  const removeCoupon = useCallback(async () => {
    if (state.session) {
      await paymentService.removeCoupon(state.session.id);
    }
    setState((prev) => ({
      ...prev,
      couponCode: '',
      appliedCoupon: undefined,
    }));
  }, [state.session]);

  // Process payment
  const processPayment = useCallback(
    async (
      cardDetails?: CardPaymentDetails,
      cryptoDetails?: CryptoPaymentDetails
    ): Promise<boolean> => {
      if (!user) {
        navigate('/login?redirect=/checkout');
        return false;
      }

      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Ensure session exists
        const session = await ensureSession();

        // Verify payment
        const result = await paymentService.verifyPayment({
          sessionId: session.id,
          paymentMethod: state.paymentMethod,
          cardDetails,
          cryptoDetails,
        });

        if (result.success) {
          // Update subscription
          await paymentService.handleCheckoutComplete(user.uid, state.selectedPlan);

          toast({
            title: 'Payment Successful!',
            description: `Welcome to ${planDetails.name} Tier!`,
          });

          // Navigate to success page
          navigate('/checkout/success?plan=' + state.selectedPlan);
          return true;
        } else {
          throw new Error('Payment failed');
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Payment failed';
        setState((prev) => ({
          ...prev,
          loading: false,
          error: message,
        }));
        toast({
          title: 'Payment Failed',
          description: message || 'Please try again.',
          variant: 'destructive',
        });
        return false;
      }
    },
    [user, state.paymentMethod, state.selectedPlan, planDetails.name, navigate, toast, ensureSession]
  );

  // Cancel checkout
  const cancelCheckout = useCallback(() => {
    sessionStorage.removeItem('checkout_session');
    navigate('/pricing');
  }, [navigate]);

  // Reset checkout
  const resetCheckout = useCallback(() => {
    sessionStorage.removeItem('checkout_session');
    setState(INITIAL_STATE);
  }, []);

  return {
    // State
    ...state,
    planDetails,
    originalPrice,
    discountAmount,
    finalPrice,
    currentStepIndex,
    totalSteps: STEPS.length,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === STEPS.length - 1,

    // Actions
    goToStep,
    nextStep,
    prevStep,
    canGoNext,
    selectPlan,
    selectPaymentMethod,
    selectCrypto,
    applyCoupon,
    removeCoupon,
    processPayment,
    cancelCheckout,
    resetCheckout,
  };
};
