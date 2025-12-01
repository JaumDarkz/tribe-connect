import { Twitter, Trophy, Users, Wallet } from "lucide-react";

const activities = [
  {
    icon: Twitter,
    title: "New Twitter Campaign",
    description: "100 members engaged with your latest tweet",
    time: "5 minutes ago",
    color: "primary",
  },
  {
    icon: Trophy,
    title: "Raffle Winner Announced",
    description: "CryptoKing won the Premium Role raffle",
    time: "23 minutes ago",
    color: "secondary",
  },
  {
    icon: Users,
    title: "Level Milestone Reached",
    description: "15 members reached Level 10 this week",
    time: "1 hour ago",
    color: "accent",
  },
  {
    icon: Wallet,
    title: "Web3 Integration Active",
    description: "42 wallets connected in the last 24h",
    time: "2 hours ago",
    color: "primary",
  },
  {
    icon: Trophy,
    title: "Points Milestone",
    description: "Community reached 1M total points distributed",
    time: "5 hours ago",
    color: "secondary",
  },
];

export const RecentActivity = () => {
  return (
    <div className="glassmorphism p-6 rounded-xl border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold mb-1">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest updates from your community</p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg bg-background/50 hover:bg-muted/50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg bg-${activity.color}/10 flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 text-${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm mb-1">{activity.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
        View All Activity →
      </button>
    </div>
  );
};
