/**
 * CouponInput Component
 * Input field for applying coupon codes
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppliedCoupon } from '@/types/checkout';
import { Tag, X, Loader2, Check } from 'lucide-react';

interface CouponInputProps {
  appliedCoupon?: AppliedCoupon;
  loading: boolean;
  onApply: (code: string) => Promise<boolean>;
  onRemove: () => void;
}

export const CouponInput = ({
  appliedCoupon,
  loading,
  onApply,
  onRemove,
}: CouponInputProps) => {
  const [code, setCode] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    const success = await onApply(code);
    if (success) {
      setCode('');
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    }
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/30">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-green-500">
            {appliedCoupon.coupon.code}
          </span>
          <span className="text-xs text-green-500/70">
            (-${appliedCoupon.discountAmount.toFixed(2)})
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-6 w-6 p-0 text-green-500 hover:text-red-500 hover:bg-red-500/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <Tag className="w-4 h-4" />
        Have a coupon code?
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder="Enter code"
          className="pl-9 uppercase"
          disabled={loading}
        />
      </div>
      <Button
        onClick={handleApply}
        disabled={loading || !code.trim()}
        size="default"
        className="min-w-[80px]"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          'Apply'
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setIsExpanded(false);
          setCode('');
        }}
        disabled={loading}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};
