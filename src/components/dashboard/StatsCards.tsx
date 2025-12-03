import { TrendingUp, Users, Trophy, Zap } from "lucide-react";

interface StatCardData {
  activeMembers: number | null;
  engagementRate: number | null;
  pointsDistributed: number | null;
  socialReach: number | null;
}

interface StatsCardsProps {
  data?: StatCardData | null;
}

export const StatsCards = ({ data }: StatsCardsProps) => {
  const stats = [
    {
      icon: Users,
      label: "Active Members",
      value: data?.activeMembers ?? 0,
      color: "primary",
    },
    {
      icon: Zap,
      label: "Engagement Rate",
      value: data?.engagementRate !== null && data?.engagementRate !== undefined
        ? `${data.engagementRate}%`
        : "0%",
      color: "secondary",
    },
    {
      icon: Trophy,
      label: "Points Distributed",
      value: data?.pointsDistributed !== null && data?.pointsDistributed !== undefined
        ? data.pointsDistributed >= 1000
          ? `${(data.pointsDistributed / 1000).toFixed(1)}K`
          : data.pointsDistributed
        : 0,
      color: "accent",
    },
    {
      icon: TrendingUp,
      label: "Social Reach",
      value: data?.socialReach !== null && data?.socialReach !== undefined
        ? data.socialReach >= 1000
          ? `${(data.socialReach / 1000).toFixed(0)}K`
          : data.socialReach
        : 0,
      color: "primary",
    },
  ];

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
            </div>
            <h3 className="text-3xl font-display font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};
