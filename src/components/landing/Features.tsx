import { Twitter, Youtube, MessageSquare, Wallet, TrendingUp, Gift, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Twitter,
    title: "Social Media Integration",
    description: "Connect Twitter, YouTube, and TikTok. Boost tweet activity up to 200% with automated engagement tracking and rewards.",
    color: "primary",
  },
  {
    icon: Gift,
    title: "Reward System",
    description: "Raffles, auctions, marketplace, and daily claims. Cryptographically secure distribution with unlimited campaigns.",
    color: "secondary",
  },
  {
    icon: Wallet,
    title: "Web3 Native",
    description: "Support for SOL, BTC, and ETH wallets. Token-gated access, NFT rewards, and secure OAuth connections.",
    color: "accent",
  },
  {
    icon: TrendingUp,
    title: "Advanced Analytics",
    description: "Real-time engagement metrics, member tracking, campaign performance, and Google Sheets integration.",
    color: "primary",
  },
  {
    icon: MessageSquare,
    title: "Multi-Channel Rewards",
    description: "Earn points through messages, voice, reactions, social tasks, invites, and mini-games. Fully customizable rates.",
    color: "secondary",
  },
  {
    icon: Shield,
    title: "Anti-Fraud Protection",
    description: "Official API verification, anti-spam cooldowns, and transparent tracking prevent fake entries.",
    color: "accent",
  },
  {
    icon: Zap,
    title: "24/7 Automation",
    description: "Set it and forget it. Automated point distribution, role assignments, and event management.",
    color: "primary",
  },
  {
    icon: Youtube,
    title: "Cross-Platform",
    description: "Unified dashboard for Discord, social media, and blockchain. Manage everything from one place.",
    color: "secondary",
  },
];

export const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="features">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Everything You Need to
            <span className="gradient-primary bg-clip-text text-transparent"> Connect & Grow</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Comprehensive tools for community engagement, social amplification, and member rewards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glassmorphism p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-all group hover:scale-105 duration-300"
              >
                <div className={`w-12 h-12 rounded-lg bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 text-${feature.color}`} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Additional feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-2">
            <div className="text-5xl font-display font-bold text-primary">∞</div>
            <h4 className="font-display font-bold">Unlimited Campaigns</h4>
            <p className="text-sm text-muted-foreground">Run as many social quests and events as you need</p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-5xl font-display font-bold text-secondary">4.94/5</div>
            <h4 className="font-display font-bold">Exceptional Rating</h4>
            <p className="text-sm text-muted-foreground">Based on 140+ reviews on Top.gg</p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-5xl font-display font-bold text-accent">24/7</div>
            <h4 className="font-display font-bold">Always Active</h4>
            <p className="text-sm text-muted-foreground">Automated operation with zero downtime</p>
          </div>
        </div>
      </div>
    </section>
  );
};
