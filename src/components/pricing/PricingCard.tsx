/**
 * Pricing Card Component
 * Displays a single pricing plan with features and CTA
 */

import { Check, Zap, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Plan, PlanTier } from '@/types/subscription';

export interface PricingCardProps {
  plan: Plan;
  currentPlan?: PlanTier;
  isAuthenticated: boolean;
  onSelectPlan: (priceId: string, planTier: PlanTier) => void;
  loading?: boolean;
  className?: string;
}

export const PricingCard = ({
  plan,
  currentPlan,
  isAuthenticated,
  onSelectPlan,
  loading = false,
  className = '',
}: PricingCardProps) => {
  const isCurrentPlan = currentPlan === plan.id;
  const isHigherPlan = currentPlan && plan.id !== 'free' && currentPlan !== 'free' &&
    ['free', 'silver', 'gold', 'diamond'].indexOf(plan.id) >
    ['free', 'silver', 'gold', 'diamond'].indexOf(currentPlan);

  const getButtonText = (): string => {
    if (loading) return 'Processing...';
    if (isCurrentPlan) return 'Current Plan';
    if (!isAuthenticated && plan.id === 'free') return 'Get Started';
    if (!isAuthenticated) return plan.cta;
    if (plan.id === 'free') return 'Downgrade';
    if (isHigherPlan) return plan.cta;
    return 'Choose Plan';
  };

  const navigate = useNavigate();

  const handleClick = () => {
    if (isCurrentPlan || loading) return;

    if (plan.id === 'free') {
      // For free plan, just navigate to signup or show downgrade confirmation
      if (!isAuthenticated) {
        navigate('/signup');
      } else {
        // Show downgrade confirmation (handled by parent)
        onSelectPlan('', 'free');
      }
    } else if (!isAuthenticated) {
      // Not authenticated, go to signup with plan preselected
      navigate(`/signup?plan=${plan.id}`);
    } else {
      // Authenticated, navigate to checkout
      navigate(`/checkout?plan=${plan.id}`);
    }
  };

  return (
    <div
      className={`relative glassmorphism rounded-2xl p-8 border transition-all duration-300 hover:scale-105 ${
        plan.popular
          ? 'border-primary shadow-[0_0_50px_rgba(29,161,242,0.3)] scale-105'
          : 'border-border/50 hover:border-primary/50'
      } ${isCurrentPlan ? 'ring-2 ring-primary' : ''} ${className}`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-primary text-sm font-display font-bold flex items-center gap-1">
          <Zap className="w-4 h-4" />
          Most Popular
        </div>
      )}

      {/* Current plan badge */}
      {isCurrentPlan && (
        <div className="absolute top-4 right-4">
          <Badge className="gradient-primary">Active</Badge>
        </div>
      )}

      <div className="space-y-6">
        {/* Plan header */}
        <div>
          <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-display font-bold">
            ${plan.price}
          </span>
          {plan.interval && (
            <span className="text-muted-foreground">/{plan.interval}</span>
          )}
        </div>

        {/* Features list */}
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>{feature.name}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          className={`w-full ${
            plan.popular
              ? 'gradient-primary animate-glow'
              : isCurrentPlan
              ? 'bg-muted text-muted-foreground'
              : 'bg-card hover:bg-muted'
          }`}
          size="lg"
          disabled={isCurrentPlan || loading}
          onClick={handleClick}
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};
