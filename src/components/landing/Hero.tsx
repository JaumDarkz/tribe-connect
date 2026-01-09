import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iaHNsKDIwMyA4OSUgNTMlIC8gMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism border border-primary/30 text-sm">
            <Zap className="w-4 h-4 text-primary" />
            <span>Trusted by 16,000+ Communities</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-display font-black leading-tight">
            Maximize Your
            <br />
            <span className="glow-text gradient-text">
              Discord Engagement
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            The leading community engagement platform combining social media automation, 
            gamification, and Web3 integration. Convert attention into real rewards.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 py-8">
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-primary">500K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-secondary">21.3K+</div>
              <div className="text-sm text-muted-foreground">Discord Servers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-accent">200%</div>
              <div className="text-sm text-muted-foreground">Engagement Boost</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 gradient-primary text-lg px-8 py-6 animate-glow">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 glassmorphism border-primary/30 hover:border-primary/60">
              View Demo
              <Users className="w-5 h-5" />
            </Button>
          </div>

          {/* Features highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="glassmorphism p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-all">
              <Zap className="w-8 h-8 text-primary mb-4 mx-auto" />
              <h3 className="font-display font-bold mb-2">Social Automation</h3>
              <p className="text-sm text-muted-foreground">
                Twitter, YouTube, TikTok integration with automated rewards
              </p>
            </div>
            
            <div className="glassmorphism p-6 rounded-xl border border-secondary/20 hover:border-secondary/40 transition-all">
              <Trophy className="w-8 h-8 text-secondary mb-4 mx-auto" />
              <h3 className="font-display font-bold mb-2">Gamification</h3>
              <p className="text-sm text-muted-foreground">
                Points, levels, leaderboards, raffles, and marketplace rewards
              </p>
            </div>
            
            <div className="glassmorphism p-6 rounded-xl border border-accent/20 hover:border-accent/40 transition-all">
              <Users className="w-8 h-8 text-accent mb-4 mx-auto" />
              <h3 className="font-display font-bold mb-2">Web3 Ready</h3>
              <p className="text-sm text-muted-foreground">
                SOL, BTC, ETH wallet support with token-gated access
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
