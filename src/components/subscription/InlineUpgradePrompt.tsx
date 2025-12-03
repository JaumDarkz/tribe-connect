/**
 * Inline Upgrade Prompt Component
 * Small inline prompt to upgrade for a specific feature
 */

import { ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import type { FeatureKey } from '@/types/subscription';
import { getPlanByTier } from '@/config/plans';

export interface InlineUpgradePromptProps {
  feature: FeatureKey;
  className?: string;
}

export const InlineUpgradePrompt = ({
  feature,
  className = '',
}: InlineUpgradePromptProps) => {
  const navigate = useNavigate();
  const { requiredPlan, featureName } = useFeatureGate(feature);
  const plan = getPlanByTier(requiredPlan);

  return (
    <div
      className={`glassmorphism rounded-lg p-4 border border-primary/30 bg-primary/5 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Lock className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{featureName} - Premium Feature</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Upgrade to{' '}
            <span className="text-primary font-semibold capitalize">{plan.name}</span> to
            unlock this feature
          </p>
          <Button
            onClick={() => navigate('/pricing')}
            size="sm"
            className="gradient-primary group"
          >
            View Plans
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};
