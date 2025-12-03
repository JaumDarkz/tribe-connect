/**
 * Checkout Cancel Page
 * Displayed when user cancels the payment process
 */

import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CheckoutCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background/95 to-background p-4">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-muted/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Cancel card */}
        <div className="glassmorphism rounded-2xl p-8 border border-border/50 text-center">
          {/* Cancel icon */}
          <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-muted-foreground" />
          </div>

          {/* Cancel message */}
          <h1 className="text-3xl font-display font-bold mb-3">
            Payment Canceled
          </h1>

          <p className="text-muted-foreground mb-8">
            You canceled the payment process. No charges were made to your account.
          </p>

          {/* Reassurance message */}
          <div className="glassmorphism rounded-lg p-4 mb-8 border border-border/50 text-left">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              What happened?
            </h3>
            <p className="text-sm text-muted-foreground">
              The payment process was interrupted before completion. Your payment method was not
              charged, and no subscription was created. You can try again whenever you're ready.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate('/pricing')}
              size="lg"
              className="w-full gradient-primary font-display font-bold"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Pricing
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              size="lg"
              variant="outline"
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>

        {/* Help section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Had trouble completing your purchase?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a
              href="mailto:support@tribeconnect.com"
              className="text-primary hover:underline"
            >
              Contact Support
            </a>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/pricing');
              }}
              className="text-primary hover:underline"
            >
              View Pricing Again
            </a>
          </div>
        </div>

        {/* Common reasons */}
        <div className="mt-8 glassmorphism rounded-lg p-6 border border-border/50">
          <h3 className="font-semibold mb-4 text-center">Common Reasons for Cancellation</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Changed your mind about the plan</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Need to update payment information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Want to review features before purchasing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Accidentally started checkout process</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancel;
