import { BarChart3 } from "lucide-react";

export const EngagementChart = () => {
  const data = [
    { day: "Mon", value: 65 },
    { day: "Tue", value: 78 },
    { day: "Wed", value: 82 },
    { day: "Thu", value: 71 },
    { day: "Fri", value: 88 },
    { day: "Sat", value: 92 },
    { day: "Sun", value: 85 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="glassmorphism p-6 rounded-xl border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold mb-1">Weekly Engagement</h3>
          <p className="text-sm text-muted-foreground">Activity across all channels</p>
        </div>
        <BarChart3 className="w-5 h-5 text-primary" />
      </div>

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

      <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-display font-bold text-primary">4.2K</p>
          <p className="text-xs text-muted-foreground">Messages</p>
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-secondary">1.8K</p>
          <p className="text-xs text-muted-foreground">Voice Minutes</p>
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-accent">892</p>
          <p className="text-xs text-muted-foreground">Reactions</p>
        </div>
      </div>
    </div>
  );
};
