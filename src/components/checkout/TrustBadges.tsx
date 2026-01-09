/**
 * TrustBadges Component
 * Displays security and trust indicators for checkout
 */

import { Shield, Lock, Zap, Users, RefreshCw } from 'lucide-react';

interface TrustBadge {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const badges: TrustBadge[] = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: '30-Day Money-Back',
    description: 'Full refund, no questions asked',
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: 'Secure Payment',
    description: '256-bit SSL encryption',
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    title: 'Cancel Anytime',
    description: 'No long-term contracts',
  },
];

export const TrustBadges = () => {
  return (
    <div className="glassmorphism rounded-xl p-6 border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <span className="text-sm text-muted-foreground">
          Join <span className="text-primary font-semibold">500K+</span> members
        </span>
      </div>

      <div className="space-y-4">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30 transition-all duration-300 hover:border-primary/30"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {badge.icon}
            </div>
            <div>
              <p className="font-medium text-sm">{badge.title}</p>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border/30">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Zap className="w-4 h-4 text-primary" />
          <span>Instant activation after payment</span>
        </div>
      </div>
    </div>
  );
};
