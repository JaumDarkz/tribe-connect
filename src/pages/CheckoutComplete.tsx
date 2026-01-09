/**
 * CheckoutComplete Page
 * Success page after successful checkout
 */

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { PlanTier } from '@/types/subscription';
import { PLANS } from '@/config/plans';
import {
  CheckCircle,
  Sparkles,
  Zap,
  ArrowRight,
  Crown,
  Rocket,
  Shield,
} from 'lucide-react';
import Confetti from 'react-confetti';

const CheckoutComplete = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { subscription, refreshSubscription } = useSubscription();
  const [showConfetti, setShowConfetti] = useState(true);

  const planId = (searchParams.get('plan') as PlanTier) || subscription?.plan || 'silver';
  const plan = PLANS[planId] || PLANS.silver;

  // Refresh subscription on mount
  useEffect(() => {
    if (user) {
      refreshSubscription();
    }
  }, [user, refreshSubscription]);

  // Stop confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const tierIcons = {
    silver: Shield,
    gold: Crown,
    diamond: Sparkles,
    free: Zap,
  };

  const tierColors = {
    silver: 'from-gray-400 to-gray-500',
    gold: 'from-yellow-400 to-amber-500',
    diamond: 'from-cyan-400 to-blue-500',
    free: 'from-gray-400 to-gray-500',
  };

  const TierIcon = tierIcons[planId] || Zap;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          colors={['#0ea5e9', '#8b5cf6', '#22c55e', '#eab308', '#ef4444']}
        />
      )}

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success icon */}
          <div className="mb-8 relative inline-block">
            <div
              className={`w-24 h-24 rounded-full bg-gradient-to-br ${tierColors[planId]} flex items-center justify-center mx-auto animate-bounce`}
              style={{ animationDuration: '2s' }}
            >
              <TierIcon className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Welcome to{' '}
            <span className="gradient-text">{plan.name} Tier!</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8">
            Your account has been upgraded successfully. Time to power up!
          </p>

          {/* Features unlocked */}
          <div className="glassmorphism rounded-2xl p-8 border border-border/50 mb-8">
            <h2 className="font-display font-semibold text-lg mb-6 flex items-center justify-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              Your New Abilities
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {plan.features.slice(0, 6).map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-left">{feature.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next steps */}
          <div className="space-y-4">
            <Button size="lg" className="gradient-primary animate-glow gap-2" asChild>
              <Link to="/dashboard">
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="outline" asChild>
                <Link to="/dashboard/settings?tab=billing">
                  Manage Subscription
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/support">
                  Need Help?
                </Link>
              </Button>
            </div>
          </div>

          {/* Receipt note */}
          <p className="text-sm text-muted-foreground mt-8">
            A receipt has been sent to {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutComplete;
