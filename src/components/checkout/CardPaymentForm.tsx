/**
 * CardPaymentForm Component
 * Credit card input form with validation
 */

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardPaymentDetails } from '@/types/checkout';
import { CreditCard, Lock } from 'lucide-react';

interface CardPaymentFormProps {
  onCardDetailsChange: (details: CardPaymentDetails | null) => void;
}

// Format card number with spaces
const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

// Format expiry date
const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 2) {
    return digits.slice(0, 2) + '/' + digits.slice(2);
  }
  return digits;
};

// Detect card type
const getCardType = (number: string): string | null => {
  const digits = number.replace(/\D/g, '');
  if (digits.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard';
  if (digits.startsWith('34') || digits.startsWith('37')) return 'amex';
  return null;
};

export const CardPaymentForm = ({ onCardDetailsChange }: CardPaymentFormProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cardType = getCardType(cardNumber);

  const validateAndUpdate = useCallback(() => {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    const [expiryMonth, expiryYear] = expiry.split('/');
    const newErrors: Record<string, string> = {};

    // Validate card number
    if (cleanNumber.length > 0 && cleanNumber.length < 15) {
      newErrors.cardNumber = 'Card number is incomplete';
    }

    // Validate expiry
    if (expiry.length > 0) {
      const month = parseInt(expiryMonth);
      if (month < 1 || month > 12) {
        newErrors.expiry = 'Invalid month';
      }
    }

    // Validate CVC
    if (cvc.length > 0 && cvc.length < 3) {
      newErrors.cvc = 'CVC is incomplete';
    }

    setErrors(newErrors);

    // Check if form is complete and valid
    if (
      cleanNumber.length >= 15 &&
      expiry.length === 5 &&
      cvc.length >= 3 &&
      name.trim().length > 0 &&
      Object.keys(newErrors).length === 0
    ) {
      onCardDetailsChange({
        cardNumber: cleanNumber,
        expiryMonth: expiryMonth || '',
        expiryYear: expiryYear ? '20' + expiryYear : '',
        cvc,
        cardholderName: name,
      });
    } else {
      onCardDetailsChange(null);
    }
  }, [cardNumber, expiry, cvc, name, onCardDetailsChange]);

  return (
    <div className="space-y-4">
      {/* Card Number */}
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => {
              setCardNumber(formatCardNumber(e.target.value));
              setTimeout(validateAndUpdate, 0);
            }}
            onBlur={validateAndUpdate}
            placeholder="1234 5678 9012 3456"
            className="pl-11 pr-12 font-mono tracking-wider"
          />
          {cardType && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-xs font-medium uppercase text-muted-foreground">
                {cardType}
              </span>
            </div>
          )}
        </div>
        {errors.cardNumber && (
          <p className="text-xs text-destructive">{errors.cardNumber}</p>
        )}
      </div>

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Expiry Date</Label>
          <Input
            id="expiry"
            value={expiry}
            onChange={(e) => {
              setExpiry(formatExpiry(e.target.value));
              setTimeout(validateAndUpdate, 0);
            }}
            onBlur={validateAndUpdate}
            placeholder="MM/YY"
            className="font-mono"
          />
          {errors.expiry && (
            <p className="text-xs text-destructive">{errors.expiry}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvc">CVC</Label>
          <div className="relative">
            <Input
              id="cvc"
              value={cvc}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                setCvc(digits);
                setTimeout(validateAndUpdate, 0);
              }}
              onBlur={validateAndUpdate}
              placeholder="123"
              className="font-mono pr-10"
              type="password"
            />
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          {errors.cvc && (
            <p className="text-xs text-destructive">{errors.cvc}</p>
          )}
        </div>
      </div>

      {/* Cardholder Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Cardholder Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setTimeout(validateAndUpdate, 0);
          }}
          onBlur={validateAndUpdate}
          placeholder="John Doe"
        />
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
        <Lock className="w-3 h-3" />
        <span>Your payment info is encrypted and secure</span>
      </div>
    </div>
  );
};
