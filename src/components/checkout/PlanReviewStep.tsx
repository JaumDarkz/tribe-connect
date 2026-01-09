/**
 * PlanReviewStep Component
 * Step 1: Review and confirm selected plan
 */

import { Button } from '@/components/ui/button';
import { Plan, PlanTier } from '@/types/subscription';
import { PLANS } from '@/config/plans';
import { Check, Zap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanReviewStepProps {
  selectedPlan: PlanTier;
  onSelectPlan: (plan: PlanTier) => void;
  onNext: () => void;
}

const tierColors = {
  silver: {
    bg: 'from-gray-400/20 to-gray-500/20',
    border: 'border-gray-400/50',
    text: 'text-gray-300',
    glow: 'hover:shadow-gray-400/20',
  },
  gold: {
    bg: 'from-yellow-400/20 to-amber-500/20',
    border: 'border-yellow-400/50',
    text: 'text-yellow-400',
    glow: 'hover:shadow-yellow-400/20',
  },
  diamond: {
    bg: 'from-cyan-400/20 to-blue-500/20',
    border: 'border-cyan-400/50',
    text: 'text-cyan-400',
    glow: 'hover:shadow-cyan-400/20',
  },
};

const PlanCard = ({
  plan,
  isSelected,
  onSelect,
}: {
  plan: Plan;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const colors = tierColors[plan.id as keyof typeof tierColors];

  return (
    <button
      onClick={onSelect}
      className={cn(
        'relative w-full p-5 rounded-xl border-2 text-left transition-all duration-300',
        isSelected
          ? `bg-gradient-to-br ${colors.bg} ${colors.border} shadow-lg ${colors.glow}`
          : 'border-border/50 bg-background/50 hover:border-primary/50'
      )}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
          Most Popular
        </div>
      )}

      {/* Selection indicator */}
      <div
        className={cn(
          'absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
          isSelected
            ? 'border-primary bg-primary'
            : 'border-muted-foreground/30'
        )}
      >
        {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
      </div>

      <div className="pr-10">
        {/* Plan name and price */}
        <div className="flex items-baseline gap-2 mb-2">
          <h3 className={cn('text-xl font-display font-bold', isSelected && colors.text)}>
            {plan.name}
          </h3>
          <span className="text-2xl font-bold">${plan.price}</span>
          <span className="text-sm text-muted-foreground">/mo</span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

        {/* Features preview */}
        <div className="space-y-2">
          {plan.features.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Check className={cn('w-4 h-4', isSelected ? colors.text : 'text-primary')} />
              <span>{feature.name}</span>
            </div>
          ))}
          {plan.features.length > 4 && (
            <p className="text-xs text-muted-foreground pl-6">
              +{plan.features.length - 4} more features
            </p>
          )}
        </div>
      </div>
    </button>
  );
};

export const PlanReviewStep = ({
  selectedPlan,
  onSelectPlan,
  onNext,
}: PlanReviewStepProps) => {
  const paidPlans = Object.values(PLANS).filter((p) => p.id !== 'free');
  const currentPlan = PLANS[selectedPlan];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold mb-2">
          Choose Your <span className="gradient-text">Power Level</span>
        </h2>
        <p className="text-muted-foreground">
          Select the tier that matches your goals
        </p>
      </div>

      {/* Plan cards */}
      <div className="space-y-4">
        {paidPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan === plan.id}
            onSelect={() => onSelectPlan(plan.id)}
          />
        ))}
      </div>

      {/* Selected plan summary */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-semibold">You selected {currentPlan.name} Tier</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {currentPlan.features.length} abilities unlocked at ${currentPlan.price}/month
        </p>
      </div>

      {/* Next button */}
      <Button
        onClick={onNext}
        size="lg"
        className="w-full gradient-primary animate-glow gap-2"
      >
        Power Up
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};
