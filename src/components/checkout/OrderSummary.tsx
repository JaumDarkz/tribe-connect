/**
 * OrderSummary Component
 * Displays order summary with pricing breakdown
 */

import { Plan } from '@/types/subscription';
import { AppliedCoupon } from '@/types/checkout';
import { Sparkles, Tag } from 'lucide-react';

interface OrderSummaryProps {
  plan: Plan;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  appliedCoupon?: AppliedCoupon;
}

export const OrderSummary = ({
  plan,
  originalPrice,
  discountAmount,
  finalPrice,
  appliedCoupon,
}: OrderSummaryProps) => {
  const tierColors = {
    silver: 'from-gray-400 to-gray-500',
    gold: 'from-yellow-400 to-amber-500',
    diamond: 'from-cyan-400 to-blue-500',
    free: 'from-gray-400 to-gray-500',
  };

  return (
    <div className="glassmorphism rounded-xl p-6 border border-border/50">
      <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        Your Power Boost
      </h3>

      {/* Plan info */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-border/30 mb-4">
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tierColors[plan.id]} flex items-center justify-center`}
        >
          <span className="text-white font-bold text-lg">
            {plan.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <p className="font-semibold">{plan.name} Tier</p>
          <p className="text-sm text-muted-foreground">
            Billed monthly
          </p>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="space-y-3 py-4 border-t border-border/30">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Plan price</span>
          <span>${originalPrice.toFixed(2)}/mo</span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between text-sm text-green-500">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {appliedCoupon.coupon.code}
              {appliedCoupon.coupon.discountType === 'percentage' && (
                <span className="text-xs">({appliedCoupon.coupon.discountValue}% off)</span>
              )}
            </span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-border/30">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total today</span>
          <div className="text-right">
            <span className="text-2xl font-bold gradient-text">
              ${finalPrice.toFixed(2)}
            </span>
            <span className="text-muted-foreground text-sm">/mo</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Then ${finalPrice.toFixed(2)}/month. Cancel anytime.
        </p>
      </div>
    </div>
  );
};
