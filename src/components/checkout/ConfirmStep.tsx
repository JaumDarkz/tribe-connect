/**
 * ConfirmStep Component
 * Step 3: Review order and confirm payment
 */

import { Button } from '@/components/ui/button';
import { Plan } from '@/types/subscription';
import { AppliedCoupon, PaymentMethodType, CryptoCurrency, CardPaymentDetails } from '@/types/checkout';
import { CouponInput } from './CouponInput';
import { OrderSummary } from './OrderSummary';
import {
  ChevronLeft,
  Loader2,
  CreditCard,
  Coins,
  Shield,
  Check,
} from 'lucide-react';

interface ConfirmStepProps {
  plan: Plan;
  paymentMethod: PaymentMethodType;
  selectedCrypto?: CryptoCurrency;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  appliedCoupon?: AppliedCoupon;
  loading: boolean;
  cardDetails?: CardPaymentDetails | null;
  onApplyCoupon: (code: string) => Promise<boolean>;
  onRemoveCoupon: () => void;
  onConfirm: () => void;
  onBack: () => void;
}

export const ConfirmStep = ({
  plan,
  paymentMethod,
  selectedCrypto,
  originalPrice,
  discountAmount,
  finalPrice,
  appliedCoupon,
  loading,
  cardDetails,
  onApplyCoupon,
  onRemoveCoupon,
  onConfirm,
  onBack,
}: ConfirmStepProps) => {
  const tierColors = {
    silver: 'text-gray-300',
    gold: 'text-yellow-400',
    diamond: 'text-cyan-400',
    free: 'text-muted-foreground',
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold mb-2">
          Confirm Your <span className="gradient-text">Power Boost</span>
        </h2>
        <p className="text-muted-foreground">
          Review your order before activation
        </p>
      </div>

      {/* Order summary */}
      <OrderSummary
        plan={plan}
        originalPrice={originalPrice}
        discountAmount={discountAmount}
        finalPrice={finalPrice}
        appliedCoupon={appliedCoupon}
      />

      {/* Coupon input */}
      <div className="p-4 rounded-xl glassmorphism border border-border/50">
        <CouponInput
          appliedCoupon={appliedCoupon}
          loading={loading}
          onApply={onApplyCoupon}
          onRemove={onRemoveCoupon}
        />
      </div>

      {/* Payment method summary */}
      <div className="p-4 rounded-xl glassmorphism border border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {paymentMethod === 'card' ? (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-primary" />
              </div>
            )}
            <div>
              <p className="font-medium">
                {paymentMethod === 'card' ? 'Credit Card' : `${selectedCrypto} Payment`}
              </p>
              <p className="text-sm text-muted-foreground">
                {paymentMethod === 'card' && cardDetails
                  ? `•••• ${cardDetails.cardNumber.slice(-4)}`
                  : paymentMethod === 'crypto'
                  ? 'Send to wallet address'
                  : 'Payment details entered'}
              </p>
            </div>
          </div>
          <Check className="w-5 h-5 text-green-500" />
        </div>
      </div>

      {/* What you get */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          What you're unlocking
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {plan.features.slice(0, 6).map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Check className={`w-4 h-4 ${tierColors[plan.id]}`} />
              <span className="text-muted-foreground">{feature.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={loading}
          className="flex-1 gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Go Back
        </Button>
        <Button
          size="lg"
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 gradient-primary animate-glow gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Activate {plan.name} Tier
            </>
          )}
        </Button>
      </div>

      {/* Guarantee note */}
      <p className="text-center text-xs text-muted-foreground">
        30-day money-back guarantee. Cancel anytime.
      </p>
    </div>
  );
};
