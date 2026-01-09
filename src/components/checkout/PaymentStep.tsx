/**
 * PaymentStep Component
 * Step 2: Select payment method and enter details
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PaymentMethodType, CryptoCurrency, CardPaymentDetails } from '@/types/checkout';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { CardPaymentForm } from './CardPaymentForm';
import { CryptoPayment } from './CryptoPayment';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaymentStepProps {
  paymentMethod: PaymentMethodType;
  selectedCrypto?: CryptoCurrency;
  sessionId?: string;
  amount: number;
  onSelectPaymentMethod: (method: PaymentMethodType) => void;
  onSelectCrypto: (crypto: CryptoCurrency) => void;
  onCardDetailsChange: (details: CardPaymentDetails | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PaymentStep = ({
  paymentMethod,
  selectedCrypto,
  sessionId,
  amount,
  onSelectPaymentMethod,
  onSelectCrypto,
  onCardDetailsChange,
  onNext,
  onBack,
}: PaymentStepProps) => {
  const [cardDetails, setCardDetails] = useState<CardPaymentDetails | null>(null);

  const handleCardChange = (details: CardPaymentDetails | null) => {
    setCardDetails(details);
    onCardDetailsChange(details);
  };

  const canProceed = paymentMethod === 'card'
    ? cardDetails !== null
    : selectedCrypto !== undefined;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold mb-2">
          Select <span className="gradient-text">Payment Method</span>
        </h2>
        <p className="text-muted-foreground">
          Choose how you want to power up
        </p>
      </div>

      {/* Payment method selector */}
      <PaymentMethodSelector
        selected={paymentMethod}
        onSelect={onSelectPaymentMethod}
      />

      {/* Payment details */}
      <div className="min-h-[300px]">
        {paymentMethod === 'card' ? (
          <div className="p-6 rounded-xl glassmorphism border border-border/50">
            <CardPaymentForm onCardDetailsChange={handleCardChange} />
          </div>
        ) : (
          <div className="p-6 rounded-xl glassmorphism border border-border/50">
            <CryptoPayment
              selectedCrypto={selectedCrypto}
              onSelectCrypto={onSelectCrypto}
              sessionId={sessionId}
              amount={amount}
            />
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          className="flex-1 gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Go Back
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 gradient-primary gap-2"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
