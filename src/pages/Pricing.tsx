/**
 * Standalone Pricing Page
 * Dedicated page for viewing and comparing subscription plans
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { PricingCard } from '@/components/pricing/PricingCard';
import { PricingFAQ } from '@/components/pricing/PricingFAQ';
import { Check, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { getAllPlans } from '@/config/plans';
import { useToast } from '@/hooks/use-toast';
import type { PlanTier } from '@/types/subscription';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Pricing = () => {
  const { user, loading: authLoading } = useAuth();
  const { currentPlan, upgradeToPlan, loading: subscriptionLoading } = useSubscription();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<{ priceId: string; tier: PlanTier } | null>(null);
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<PlanTier | null>(null);

  const plans = getAllPlans();

  // Authentication is ready when not loading
  const isAuthReady = !authLoading;

  const handleSelectPlan = async (priceId: string, planTier: PlanTier) => {
    try {
      console.log('[Pricing] handleSelectPlan called:', { priceId, planTier, user: !!user });

      // Handle downgrade to free
      if (planTier === 'free') {
        setShowDowngradeDialog(true);
        return;
      }

      if (!user) {
        console.error('[Pricing] User not authenticated, cannot upgrade');
        toast({
          title: 'Not logged in',
          description: 'Please log in to upgrade your plan.',
          variant: 'destructive',
        });
        return;
      }

      setProcessingPlan(planTier);
      console.log('[Pricing] Starting checkout flow for', planTier);

      // Trigger checkout
      await upgradeToPlan(priceId, planTier);

      console.log('[Pricing] Checkout flow completed successfully');
    } catch (error: any) {
      console.error('[Pricing] Upgrade failed:', error);
      toast({
        title: 'Upgrade failed',
        description: error.message || 'Failed to start checkout. Please try again.',
        variant: 'destructive',
      });
      setProcessingPlan(null);
    }
  };

  const handleDowngrade = () => {
    // Handle downgrade logic
    toast({
      title: 'Downgrade scheduled',
      description: 'Your plan will downgrade to Free at the end of your billing period.',
    });
    setShowDowngradeDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Simple, Transparent Pricing</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
              Choose Your
              <span className="gradient-primary bg-clip-text text-transparent">
                {' '}
                Power Level
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Start free forever. Upgrade anytime for automation and multiplied earnings.
            </p>

            {user && currentPlan && (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glassmorphism border border-primary/30">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                <span className="text-sm">
                  Current Plan:{' '}
                  <span className="font-bold text-primary capitalize">{currentPlan}</span>
                </span>
              </div>
            )}
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
            {!isAuthReady ? (
              // Show loading skeletons while auth loads
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="glassmorphism rounded-2xl p-8 border border-border/50 h-[600px] flex items-center justify-center"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ))
            ) : (
              plans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  currentPlan={currentPlan}
                  isAuthenticated={!!user}
                  onSelectPlan={handleSelectPlan}
                  loading={processingPlan === plan.id}
                />
              ))
            )}
          </div>

          {/* Trust indicators */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold mb-1">No Setup Fees</h3>
                <p className="text-sm text-muted-foreground">
                  Start using premium features immediately
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold mb-1">Cancel Anytime</h3>
                <p className="text-sm text-muted-foreground">
                  No contracts, no commitments required
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold mb-1">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">
                  Always here to help when you need us
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Section */}
      <section className="py-24 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                All Plans Include
              </h2>
              <p className="text-xl text-muted-foreground">
                Premium features that scale with your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                'Unlimited core features',
                'Discord server integration',
                'Real-time analytics',
                'Community giveaways',
                'Point earning system',
                'Raffle participation',
                'Member leaderboards',
                'Secure authentication',
                'Regular updates',
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 glassmorphism rounded-lg border border-border/50"
                >
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <PricingFAQ />

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-secondary/5"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to{' '}
              <span className="gradient-primary bg-clip-text text-transparent">
                Power Up
              </span>
              ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of Discord communities already using ENGAGE IO
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link to="/dashboard">
                  <button className="px-8 py-4 rounded-lg gradient-primary font-display font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <button className="px-8 py-4 rounded-lg gradient-primary font-display font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2">
                      Get Started Free
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                  <Link to="/login">
                    <button className="px-8 py-4 rounded-lg glassmorphism border border-border/50 font-display font-bold text-lg hover:border-primary/50 transition-colors">
                      Sign In
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Downgrade Confirmation Dialog */}
      <AlertDialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Downgrade to Free Plan?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll lose access to premium features at the end of your current billing period.
              Your data will be preserved, but features like auto-farm, XP boosts, and API access
              will be disabled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDowngrade}>
              Confirm Downgrade
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Pricing;
