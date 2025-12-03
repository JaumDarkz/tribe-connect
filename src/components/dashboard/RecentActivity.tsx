import { Activity } from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'campaign' | 'raffle' | 'milestone' | 'web3' | 'points' | 'general';
}

interface RecentActivityProps {
  activities?: ActivityItem[] | null;
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <div className="glassmorphism p-6 rounded-xl border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold mb-1">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest updates from your community</p>
        </div>
      </div>

      {activities && activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-background/50 hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm mb-1">{activity.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No recent activity</p>
            <p className="text-xs mt-1">Activity will appear here once your community starts engaging</p>
          </div>
        </div>
      )}

      {activities && activities.length > 0 && (
        <button className="w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          View All Activity →
        </button>
      )}
    </div>
  );
};
