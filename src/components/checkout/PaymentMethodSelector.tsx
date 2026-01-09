/**
 * PaymentMethodSelector Component
 * Toggle between card and crypto payment methods
 */

import { PaymentMethodType } from '@/types/checkout';
import { CreditCard, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentMethodSelectorProps {
  selected: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
}

export const PaymentMethodSelector = ({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) => {
  const methods: { type: PaymentMethodType; label: string; icon: React.ReactNode; description: string }[] = [
    {
      type: 'card',
      label: 'Card',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Credit or Debit',
    },
    {
      type: 'crypto',
      label: 'Crypto',
      icon: <Coins className="w-5 h-5" />,
      description: 'SOL, ETH, BTC',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {methods.map((method) => {
        const isSelected = selected === method.type;

        return (
          <button
            key={method.type}
            onClick={() => onSelect(method.type)}
            className={cn(
              'relative flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all duration-300',
              isSelected
                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                : 'border-border/50 bg-background/50 hover:border-primary/50 hover:bg-background/80'
            )}
          >
            {/* Selection indicator */}
            <div
              className={cn(
                'absolute top-3 right-3 w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center',
                isSelected
                  ? 'border-primary bg-primary'
                  : 'border-muted-foreground/30'
              )}
            >
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
              )}
            </div>

            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {method.icon}
            </div>

            <div className="text-center">
              <p className={cn(
                'font-semibold',
                isSelected && 'text-primary'
              )}>
                {method.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {method.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
