import { Trophy, Medal } from "lucide-react";

const performers = [
  { rank: 1, name: "CryptoKing", points: 12450, avatar: "CK", color: "from-yellow-400 to-yellow-600" },
  { rank: 2, name: "NFTQueen", points: 11230, avatar: "NQ", color: "from-gray-300 to-gray-500" },
  { rank: 3, name: "Web3Warrior", points: 10890, avatar: "WW", color: "from-orange-400 to-orange-600" },
  { rank: 4, name: "TokenMaster", points: 9560, avatar: "TM", color: "from-primary to-secondary" },
  { rank: 5, name: "BlockchainBoss", points: 8920, avatar: "BB", color: "from-accent to-primary" },
];

export const TopPerformers = () => {
  return (
    <div className="glassmorphism p-6 rounded-xl border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold mb-1">Top Performers</h3>
          <p className="text-sm text-muted-foreground">This week's leaders</p>
        </div>
        <Trophy className="w-5 h-5 text-primary" />
      </div>

      <div className="space-y-4">
        {performers.map((performer) => (
          <div
            key={performer.rank}
            className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-muted/50 transition-colors"
          >
            <div className="flex-shrink-0 w-8 text-center">
              {performer.rank <= 3 ? (
                <Medal className={`w-6 h-6 ${
                  performer.rank === 1 ? "text-yellow-400" :
                  performer.rank === 2 ? "text-gray-400" :
                  "text-orange-400"
                }`} />
              ) : (
                <span className="text-sm font-bold text-muted-foreground">
                  #{performer.rank}
                </span>
              )}
            </div>

            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${performer.color} flex items-center justify-center text-white font-bold text-sm`}>
              {performer.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{performer.name}</p>
              <p className="text-xs text-muted-foreground">
                {performer.points.toLocaleString()} points
              </p>
            </div>

            <div className="text-xs font-medium text-primary">
              +{Math.floor(Math.random() * 500 + 100)}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
        View Full Leaderboard →
      </button>
    </div>
  );
};
