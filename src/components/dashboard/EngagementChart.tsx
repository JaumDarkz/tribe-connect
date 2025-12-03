import { BarChart3 } from "lucide-react";

interface DailyEngagement {
  day: string;
  value: number;
}

interface EngagementStats {
  messages: number | null;
  voiceMinutes: number | null;
  reactions: number | null;
}

interface EngagementChartProps {
  weeklyData?: DailyEngagement[] | null;
  stats?: EngagementStats | null;
}

export const EngagementChart = ({ weeklyData, stats }: EngagementChartProps) => {
  const data = weeklyData || [];
  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value)) : 100;

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return "0";
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="glassmorphism p-6 rounded-xl border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold mb-1">Weekly Engagement</h3>
          <p className="text-sm text-muted-foreground">Activity across all channels</p>
        </div>
        <BarChart3 className="w-5 h-5 text-primary" />
      </div>

      {data.length > 0 ? (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.day}</span>
                <span className="text-muted-foreground">{item.value}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full gradient-primary rounded-full transition-all duration-500"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          <p className="text-sm">No engagement data available</p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-display font-bold text-primary">
            {formatNumber(stats?.messages)}
          </p>
          <p className="text-xs text-muted-foreground">Messages</p>
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-secondary">
            {formatNumber(stats?.voiceMinutes)}
          </p>
          <p className="text-xs text-muted-foreground">Voice Minutes</p>
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-accent">
            {formatNumber(stats?.reactions)}
          </p>
          <p className="text-xs text-muted-foreground">Reactions</p>
        </div>
      </div>
    </div>
  );
};
