/**
 * Locked Feature Overlay Component
 * Blurs content and shows upgrade prompt overlay
 */

import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import type { FeatureKey } from '@/types/subscription';
import { getPlanByTier } from '@/config/plans';
import { type ReactNode } from 'react';

export interface LockedFeatureOverlayProps {
  feature: FeatureKey;
  children: ReactNode;
  blurAmount?: 'sm' | 'md' | 'lg';
}

export const LockedFeatureOverlay = ({
  feature,
  children,
  blurAmount = 'md',
}: LockedFeatureOverlayProps) => {
  const navigate = useNavigate();
  const { hasAccess, requiredPlan, featureName, featureDescription } = useFeatureGate(feature);
  const plan = getPlanByTier(requiredPlan);

  const getBlurClass = () => {
    switch (blurAmount) {
      case 'sm':
        return 'blur-sm';
      case 'lg':
        return 'blur-lg';
      case 'md':
      default:
        return 'blur-md';
    }
  };

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content */}
      <div className={`pointer-events-none select-none ${getBlurClass()}`}>
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="max-w-md w-full mx-4 glassmorphism rounded-2xl p-8 border border-primary/30 text-center">
          {/* Lock icon */}
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>

          {/* Content */}
          <h3 className="text-2xl font-display font-bold mb-2">
            {featureName} Locked
          </h3>
          <p className="text-muted-foreground mb-6">
            {featureDescription}
          </p>

          {/* Plan info */}
          <div className="glassmorphism rounded-lg p-4 mb-6 border border-primary/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-lg capitalize">{plan.name} Plan</span>
            </div>
            <div className="text-3xl font-display font-bold mb-1">
              ${plan.price}
              {plan.interval && (
                <span className="text-lg text-muted-foreground">/{plan.interval}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
          </div>

          {/* CTA */}
          <Button
            onClick={() => navigate('/pricing')}
            size="lg"
            className="w-full gradient-primary font-display font-bold group"
          >
            Upgrade Now
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Cancel anytime • No setup fees
          </p>
        </div>
      </div>
    </div>
  );
};
