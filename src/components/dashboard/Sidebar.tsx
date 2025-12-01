import { Home, TrendingUp, Trophy, Wallet, Users, Settings, Zap, BarChart3, Gift } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: TrendingUp, label: "Social Campaigns", path: "/dashboard/campaigns" },
  { icon: Trophy, label: "Rewards", path: "/dashboard/rewards" },
  { icon: Gift, label: "Raffles & Auctions", path: "/dashboard/raffles" },
  { icon: Users, label: "Leaderboard", path: "/dashboard/leaderboard" },
  { icon: Wallet, label: "Web3 Integration", path: "/dashboard/web3" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border/50 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-border/50">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="font-display font-bold text-lg">
          ENGAGE <span className="text-primary">IO</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border/50">
        <div className="glassmorphism p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">John Doe</p>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
          </div>
          <Link to="/dashboard/upgrade">
            <button className="w-full py-2 px-3 rounded-lg gradient-primary text-xs font-medium hover:opacity-90 transition-opacity">
              Upgrade to Premium
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
};
