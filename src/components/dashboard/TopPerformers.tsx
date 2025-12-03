import { Trophy, Medal, Users } from "lucide-react";

interface Performer {
  id: string;
  username: string;
  points: number;
  avatar?: string;
  weeklyIncrease?: number;
}

interface TopPerformersProps {
  performers?: Performer[] | null;
}

export const TopPerformers = ({ performers }: TopPerformersProps) => {
  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (rank: number) => {
    const colors = [
      "from-yellow-400 to-yellow-600",
      "from-gray-300 to-gray-500",
      "from-orange-400 to-orange-600",
      "from-primary to-secondary",
      "from-accent to-primary",
    ];
    return colors[rank - 1] || "from-primary to-secondary";
  };

  return (
    <div className="glassmorphism p-6 rounded-xl border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold mb-1">Top Performers</h3>
          <p className="text-sm text-muted-foreground">This week's leaders</p>
        </div>
        <Trophy className="w-5 h-5 text-primary" />
      </div>

      {performers && performers.length > 0 ? (
        <div className="space-y-4">
          {performers.slice(0, 5).map((performer, index) => {
            const rank = index + 1;
            return (
              <div
                key={performer.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0 w-8 text-center">
                  {rank <= 3 ? (
                    <Medal className={`w-6 h-6 ${
                      rank === 1 ? "text-yellow-400" :
                      rank === 2 ? "text-gray-400" :
                      "text-orange-400"
                    }`} />
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">
                      #{rank}
                    </span>
                  )}
                </div>

                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(rank)} flex items-center justify-center text-white font-bold text-sm`}>
                  {performer.avatar || getInitials(performer.username)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{performer.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {performer.points.toLocaleString()} points
                  </p>
                </div>

                {performer.weeklyIncrease !== undefined && performer.weeklyIncrease > 0 && (
                  <div className="text-xs font-medium text-primary">
                    +{performer.weeklyIncrease}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No performers yet</p>
            <p className="text-xs mt-1">Leaderboard will populate once members start earning points</p>
          </div>
        </div>
      )}

      {performers && performers.length > 0 && (
        <button className="w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          View Full Leaderboard →
        </button>
      )}
    </div>
  );
};
