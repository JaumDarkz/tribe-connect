/**
 * CryptoPayment Component
 * Cryptocurrency payment selection and wallet address display
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CryptoCurrency, CryptoPaymentInfo } from '@/types/checkout';
import { Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCryptoPaymentInfo } from '@/services/payment.service';

interface CryptoPaymentProps {
  selectedCrypto?: CryptoCurrency;
  onSelectCrypto: (crypto: CryptoCurrency) => void;
  sessionId?: string;
  amount: number;
}

const cryptoOptions: { currency: CryptoCurrency; name: string; color: string; icon: string }[] = [
  { currency: 'SOL', name: 'Solana', color: 'from-purple-500 to-green-400', icon: '◎' },
  { currency: 'ETH', name: 'Ethereum', color: 'from-blue-500 to-purple-500', icon: 'Ξ' },
  { currency: 'BTC', name: 'Bitcoin', color: 'from-orange-500 to-yellow-500', icon: '₿' },
];

export const CryptoPayment = ({
  selectedCrypto,
  onSelectCrypto,
  sessionId,
  amount,
}: CryptoPaymentProps) => {
  const [paymentInfo, setPaymentInfo] = useState<CryptoPaymentInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedCrypto && sessionId) {
      setLoading(true);
      getCryptoPaymentInfo(sessionId, selectedCrypto)
        .then(setPaymentInfo)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedCrypto, sessionId]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedOption = cryptoOptions.find((o) => o.currency === selectedCrypto);

  return (
    <div className="space-y-6">
      {/* Crypto selection */}
      <div className="grid grid-cols-3 gap-3">
        {cryptoOptions.map((option) => {
          const isSelected = selectedCrypto === option.currency;

          return (
            <button
              key={option.currency}
              onClick={() => onSelectCrypto(option.currency)}
              className={cn(
                'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300',
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border/50 bg-background/50 hover:border-primary/50'
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xl font-bold',
                  option.color
                )}
              >
                {option.icon}
              </div>
              <div className="text-center">
                <p className={cn('font-semibold text-sm', isSelected && 'text-primary')}>
                  {option.currency}
                </p>
                <p className="text-xs text-muted-foreground">{option.name}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Payment details */}
      {selectedCrypto && (
        <div className="space-y-4 p-4 rounded-xl bg-background/50 border border-border/30">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : paymentInfo ? (
            <>
              {/* Amount to send */}
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-1">Send exactly</p>
                <p className="text-3xl font-bold font-display">
                  <span className="gradient-text">${amount.toFixed(2)}</span>
                  <span className="text-lg text-muted-foreground ml-2">
                    in {selectedCrypto}
                  </span>
                </p>
              </div>

              {/* Wallet address */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  To this {selectedOption?.name} address:
                </p>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/30">
                  <code className="flex-1 text-xs font-mono break-all">
                    {paymentInfo.address}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(paymentInfo.address)}
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Network info */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Network</span>
                <span className="font-medium">{paymentInfo.network}</span>
              </div>

              {/* Instructions */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  Send the exact amount to the address above. Your subscription will activate automatically once the transaction is confirmed.
                </p>
              </div>

              {/* External link */}
              <Button variant="outline" className="w-full gap-2" asChild>
                <a
                  href={`https://explorer.solana.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Explorer
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Select a cryptocurrency to see payment details</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
