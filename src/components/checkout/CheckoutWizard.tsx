/**
 * CheckoutWizard Component
 * Main container for multi-step checkout flow
 */

import { useState } from 'react';
import { useCheckout } from '@/hooks/useCheckout';
import { StepIndicator } from './StepIndicator';
import { PlanReviewStep } from './PlanReviewStep';
import { PaymentStep } from './PaymentStep';
import { ConfirmStep } from './ConfirmStep';
import { CardPaymentDetails } from '@/types/checkout';

export const CheckoutWizard = () => {
  const checkout = useCheckout();
  const [cardDetails, setCardDetails] = useState<CardPaymentDetails | null>(null);

  const handleConfirmPayment = async () => {
    if (checkout.paymentMethod === 'card' && cardDetails) {
      await checkout.processPayment(cardDetails);
    } else if (checkout.paymentMethod === 'crypto' && checkout.selectedCrypto) {
      await checkout.processPayment(undefined, {
        currency: checkout.selectedCrypto,
        walletAddress: '', // Will be provided by backend
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step indicator */}
      <StepIndicator
        currentStep={checkout.currentStep}
        currentStepIndex={checkout.currentStepIndex}
      />

      {/* Step content */}
      <div className="glassmorphism rounded-2xl p-6 md:p-8 border border-border/50">
        {checkout.currentStep === 'review' && (
          <PlanReviewStep
            selectedPlan={checkout.selectedPlan}
            onSelectPlan={checkout.selectPlan}
            onNext={checkout.nextStep}
          />
        )}

        {checkout.currentStep === 'payment' && (
          <PaymentStep
            paymentMethod={checkout.paymentMethod}
            selectedCrypto={checkout.selectedCrypto}
            sessionId={checkout.session?.id}
            amount={checkout.finalPrice}
            onSelectPaymentMethod={checkout.selectPaymentMethod}
            onSelectCrypto={checkout.selectCrypto}
            onCardDetailsChange={setCardDetails}
            onNext={checkout.nextStep}
            onBack={checkout.prevStep}
          />
        )}

        {checkout.currentStep === 'confirm' && (
          <ConfirmStep
            plan={checkout.planDetails}
            paymentMethod={checkout.paymentMethod}
            selectedCrypto={checkout.selectedCrypto}
            originalPrice={checkout.originalPrice}
            discountAmount={checkout.discountAmount}
            finalPrice={checkout.finalPrice}
            appliedCoupon={checkout.appliedCoupon}
            loading={checkout.loading}
            cardDetails={cardDetails}
            onApplyCoupon={checkout.applyCoupon}
            onRemoveCoupon={checkout.removeCoupon}
            onConfirm={handleConfirmPayment}
            onBack={checkout.prevStep}
          />
        )}
      </div>
    </div>
  );
};
