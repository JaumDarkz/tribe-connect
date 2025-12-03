/**
 * Checkout Success Page
 * Displayed after successful payment completion
 */

import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import * as stripeService from '@/services/stripe.service';
import { getPlanByTier } from '@/config/plans';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { refreshSubscription, currentPlan } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const processedRef = useRef(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const processCheckout = async () => {
      // Prevent processing the same session multiple times
      if (processedRef.current) {
        console.log('[CheckoutSuccess] Already processed, skipping');
        return;
      }

      console.log('[CheckoutSuccess] Processing checkout:', { sessionId, user: !!user, authLoading });

      // If no session ID, redirect to pricing
      if (!sessionId) {
        console.error('[CheckoutSuccess] No session ID found');
        setError('No checkout session found');
        setLoading(false);
        setTimeout(() => navigate('/pricing'), 2000);
        return;
      }

      // Wait for auth to load before checking user
      if (authLoading) {
        console.log('[CheckoutSuccess] Waiting for auth to load...');
        return; // Don't process yet, wait for auth to finish loading
      }

      // If auth is loaded but no user, redirect to login
      if (!user) {
        console.error('[CheckoutSuccess] No user found after auth loaded');
        setError('Please log in to complete your purchase');
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      try {
        console.log('[CheckoutSuccess] Processing checkout for user:', user.uid);

        // Mark as processed to prevent duplicate processing
        processedRef.current = true;

        // Process the successful checkout
        await stripeService.handleCheckoutSuccess(sessionId, user.uid);

        // Refresh subscription data
        await refreshSubscription();

        console.log('[CheckoutSuccess] Checkout processed successfully');
        setLoading(false);
      } catch (err: any) {
        console.error('[CheckoutSuccess] Failed to process checkout:', err);
        setError(err.message || 'Failed to process payment');
        setLoading(false);
        processedRef.current = false; // Reset on error to allow retry
      }
    };

    processCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, sessionId, navigate]);
  // Note: Intentionally not including refreshSubscription to prevent re-processing

  const plan = currentPlan ? getPlanByTier(currentPlan) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background/95 to-background">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">
            Processing your payment...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we confirm your subscription
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    const isRedirecting = error.includes('No checkout session') || error.includes('log in');

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background/95 to-background p-4">
        <div className="max-w-md w-full glassmorphism rounded-2xl p-8 border border-destructive/50 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">
            {isRedirecting ? 'Redirecting...' : 'Payment Processing Error'}
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          {isRedirecting ? (
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate('/pricing')}
                className="w-full gradient-primary"
              >
                Back to Pricing
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background/95 to-background p-4">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-success/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Success card */}
        <div className="glassmorphism rounded-2xl p-8 md:p-12 border border-success/30 text-center">
          {/* Success icon with animation */}
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-success/20 rounded-full animate-ping"></div>
            <div className="relative w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
          </div>

          {/* Success message */}
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Welcome to{' '}
            <span className="gradient-primary bg-clip-text text-transparent">
              {plan?.name} Tier!
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8">
            Your payment was successful and your account has been upgraded.
          </p>

          {/* Plan details */}
          {plan && (
            <div className="glassmorphism rounded-xl p-6 mb-8 border border-primary/30">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-lg">
                  Your New Features
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                {plan.features.slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>{feature.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/dashboard')}
              size="lg"
              className="gradient-primary font-display font-bold group"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => navigate('/dashboard/billing')}
              size="lg"
              variant="outline"
            >
              View Billing Settings
            </Button>
          </div>

          {/* Receipt info */}
          <p className="text-sm text-muted-foreground mt-8">
            A receipt has been sent to your email address.
          </p>
        </div>

        {/* Next steps */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="glassmorphism rounded-lg p-4 border border-border/50">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold mb-1 text-sm">Explore Features</h4>
            <p className="text-xs text-muted-foreground">
              Check out your new premium features
            </p>
          </div>
          <div className="glassmorphism rounded-lg p-4 border border-border/50">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold mb-1 text-sm">Start Earning</h4>
            <p className="text-xs text-muted-foreground">
              Boost your points and XP earnings
            </p>
          </div>
          <div className="glassmorphism rounded-lg p-4 border border-border/50">
            <div className="text-2xl mb-2">💎</div>
            <h4 className="font-semibold mb-1 text-sm">Join VIP</h4>
            <p className="text-xs text-muted-foreground">
              Access exclusive community perks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
