import { Home, TrendingUp, Trophy, Wallet, Users, Settings, Zap, BarChart3, Gift, CreditCard, BadgeDollarSign } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionBadge } from "@/components/subscription/SubscriptionBadge";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: BadgeDollarSign, label: "Affiliate Program", path: "/dashboard/affiliate", highlight: true },
  // ============================================================================
  // COMING SOON - Pages not yet implemented
  // Uncomment when pages are ready
  // ============================================================================
  // { icon: TrendingUp, label: "Social Campaigns", path: "/dashboard/campaigns" },
  // { icon: Trophy, label: "Rewards", path: "/dashboard/rewards" },
  // { icon: Gift, label: "Raffles & Auctions", path: "/dashboard/raffles" },
  // { icon: Users, label: "Leaderboard", path: "/dashboard/leaderboard" },
  // { icon: Wallet, label: "Web3 Integration", path: "/dashboard/web3" },
  // { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  // ============================================================================
  // { icon: CreditCard, label: "Billing", path: "/dashboard/billing" }, // Billing moved to Settings page
  // { icon: Settings, label: "Settings", path: "/dashboard/settings" }, // Settings moved to UserMenu dropdown
];

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { currentPlan } = useSubscription();

  // Get user initials
  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <aside className="w-64 bg-card border-r border-border/50 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-border/50 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="font-display font-bold text-lg">
          TRIBE <span className="text-primary">CONNECT</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isHighlight = 'highlight' in item && item.highlight;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative",
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : isHighlight
                  ? "text-foreground hover:bg-muted border border-primary/30 bg-primary/5 hover:border-primary/50"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isHighlight && !isActive && "text-primary")} />
              <span className="text-sm">{item.label}</span>
              {isHighlight && !isActive && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border/50 flex-shrink-0">
        <div className="glassmorphism p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {user?.displayName || user?.email || "User"}
              </p>
              <SubscriptionBadge plan={currentPlan} showIcon={false} className="text-xs mt-1" />
            </div>
          </div>
          {currentPlan === 'free' && (
            <Link to="/pricing">
              <button className="w-full py-2 px-3 rounded-lg gradient-primary text-xs font-medium hover:opacity-90 transition-opacity">
                Upgrade to Premium
              </button>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
};
