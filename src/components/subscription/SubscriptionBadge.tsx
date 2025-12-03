/**
 * Subscription Badge Component
 * Displays user's current plan tier as a badge
 */

import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap } from 'lucide-react';
import type { PlanTier } from '@/types/subscription';

export interface SubscriptionBadgeProps {
  plan: PlanTier;
  showIcon?: boolean;
  className?: string;
}

export const SubscriptionBadge = ({
  plan,
  showIcon = true,
  className = '',
}: SubscriptionBadgeProps) => {
  const getBadgeStyles = () => {
    switch (plan) {
      case 'diamond':
        return 'gradient-primary text-white border-0';
      case 'gold':
        return 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-white border-0';
      case 'silver':
        return 'bg-gradient-to-r from-gray-400 to-gray-300 text-gray-900 border-0';
      case 'free':
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getIcon = () => {
    if (!showIcon) return null;

    switch (plan) {
      case 'diamond':
        return <Sparkles className="w-3 h-3" />;
      case 'gold':
      case 'silver':
        return <Zap className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <Badge className={`${getBadgeStyles()} ${className}`}>
      {getIcon()}
      <span className="capitalize">{plan}</span>
    </Badge>
  );
};
