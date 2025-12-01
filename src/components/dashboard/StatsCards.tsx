import { TrendingUp, Users, Trophy, Zap } from "lucide-react";

const stats = [
  {
    icon: Users,
    label: "Active Members",
    value: "1,284",
    change: "+12.5%",
    positive: true,
    color: "primary",
  },
  {
    icon: Zap,
    label: "Engagement Rate",
    value: "87.3%",
    change: "+5.2%",
    positive: true,
    color: "secondary",
  },
  {
    icon: Trophy,
    label: "Points Distributed",
    value: "45.2K",
    change: "+28.1%",
    positive: true,
    color: "accent",
  },
  {
    icon: TrendingUp,
    label: "Social Reach",
    value: "123K",
    change: "+156%",
    positive: true,
    color: "primary",
  },
];

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="glassmorphism p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                <Icon className={`w-6 h-6 text-${stat.color}`} />
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.positive
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-display font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};
