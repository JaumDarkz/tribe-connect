import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Copy,
  Gift,
  Users,
  DollarSign,
  Trophy,
  Zap,
  TrendingUp,
  Star,
  Crown,
  Gem,
  Target,
  Rocket,
  ChevronRight,
  Check,
  Sparkles,
  Percent,
  ArrowRight,
  BadgeDollarSign,
  Coins,
  Award,
} from "lucide-react";

// Affiliate tier structure with bonuses
const affiliateTiers = [
  {
    name: "Starter",
    icon: Star,
    minReferrals: 0,
    maxReferrals: 4,
    commission: 15,
    color: "from-slate-400 to-slate-600",
    borderColor: "border-slate-500/30",
    bgColor: "bg-slate-500/10",
    perks: ["15% lifetime commission", "Basic tracking dashboard", "Monthly payouts"],
  },
  {
    name: "Bronze",
    icon: Award,
    minReferrals: 5,
    maxReferrals: 14,
    commission: 20,
    color: "from-amber-600 to-amber-800",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/10",
    perks: ["20% lifetime commission", "$25 bonus at 5 referrals", "Bi-weekly payouts", "Priority support"],
  },
  {
    name: "Silver",
    icon: Gem,
    minReferrals: 15,
    maxReferrals: 49,
    commission: 25,
    color: "from-gray-300 to-gray-500",
    borderColor: "border-gray-400/30",
    bgColor: "bg-gray-400/10",
    perks: ["25% lifetime commission", "$100 bonus at 15 referrals", "Weekly payouts", "Exclusive Discord role", "Early feature access"],
  },
  {
    name: "Gold",
    icon: Trophy,
    minReferrals: 50,
    maxReferrals: 99,
    commission: 30,
    color: "from-yellow-400 to-yellow-600",
    borderColor: "border-yellow-500/30",
    bgColor: "bg-yellow-500/10",
    perks: ["30% lifetime commission", "$500 bonus at 50 referrals", "Daily payouts available", "1-on-1 success manager", "Co-marketing opportunities"],
  },
  {
    name: "Diamond",
    icon: Crown,
    minReferrals: 100,
    maxReferrals: Infinity,
    commission: 40,
    color: "from-cyan-400 to-purple-500",
    borderColor: "border-primary/50",
    bgColor: "bg-primary/10",
    perks: [
      "40% lifetime commission",
      "$2,000 bonus at 100 referrals",
      "Instant payouts",
      "Revenue share on tier 2",
      "VIP events & retreats",
      "Custom landing pages",
      "Direct founder access",
    ],
  },
];

// Milestone bonuses
const milestoneBonuses = [
  { referrals: 3, bonus: 10, label: "Quick Start", achieved: false },
  { referrals: 5, bonus: 25, label: "Bronze Tier", achieved: false },
  { referrals: 10, bonus: 50, label: "Momentum", achieved: false },
  { referrals: 15, bonus: 100, label: "Silver Tier", achieved: false },
  { referrals: 25, bonus: 200, label: "Rising Star", achieved: false },
  { referrals: 50, bonus: 500, label: "Gold Tier", achieved: false },
  { referrals: 75, bonus: 750, label: "Elite", achieved: false },
  { referrals: 100, bonus: 2000, label: "Diamond Tier", achieved: false },
];

// Leaderboard mock data (will be replaced with real data)
const topAffiliates = [
  { name: "Alex M.", referrals: 247, earnings: 12847, avatar: "AM" },
  { name: "Sarah K.", referrals: 189, earnings: 9823, avatar: "SK" },
  { name: "Mike T.", referrals: 156, earnings: 8234, avatar: "MT" },
  { name: "Emma L.", referrals: 134, earnings: 7012, avatar: "EL" },
  { name: "David R.", referrals: 98, earnings: 5234, avatar: "DR" },
];

const Affiliate = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // TODO: Replace with real data from backend
  const affiliateData = {
    referralCode: user?.uid?.slice(0, 8).toUpperCase() || "TRIBE123",
    totalReferrals: 0,
    activeReferrals: 0,
    pendingEarnings: 0,
    totalEarnings: 0,
    thisMonthEarnings: 0,
    conversionRate: 0,
  };

  const referralLink = `https://tribeconnect.io/ref/${affiliateData.referralCode}`;

  // Calculate current tier
  const getCurrentTier = () => {
    for (let i = affiliateTiers.length - 1; i >= 0; i--) {
      if (affiliateData.totalReferrals >= affiliateTiers[i].minReferrals) {
        return affiliateTiers[i];
      }
    }
    return affiliateTiers[0];
  };

  const getNextTier = () => {
    const currentTierIndex = affiliateTiers.findIndex(
      (tier) => tier.name === getCurrentTier().name
    );
    return affiliateTiers[currentTierIndex + 1] || null;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const progressToNextTier = nextTier
    ? ((affiliateData.totalReferrals - currentTier.minReferrals) /
        (nextTier.minReferrals - currentTier.minReferrals)) *
      100
    : 100;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  // Calculate milestone status
  const getMilestoneStatus = (milestone: typeof milestoneBonuses[0]) => {
    if (affiliateData.totalReferrals >= milestone.referrals) return "achieved";
    if (affiliateData.totalReferrals >= milestone.referrals - 2) return "close";
    return "locked";
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 space-y-8 overflow-auto">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 md:p-12">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Earn Up to 40% Lifetime Commission</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4 leading-tight">
                Turn Your Network Into
                <br />
                <span className="text-yellow-300">Passive Income</span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
                Join the Tribe Connect affiliate program and earn recurring commissions
                for every user you refer. No limits. No caps. Forever.
              </p>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Up to 40%</p>
                    <p className="text-white/70 text-sm">Commission Rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Lifetime</p>
                    <p className="text-white/70 text-sm">Recurring Revenue</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">$2,875+</p>
                    <p className="text-white/70 text-sm">In Tier Bonuses</p>
                  </div>
                </div>
              </div>

              {/* Referral Link Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  Your Unique Referral Link
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3 border border-white/10">
                    <span className="text-sm truncate flex-1 font-mono">{referralLink}</span>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(referralLink, "Referral link")}
                    className="bg-white text-primary hover:bg-white/90 font-bold gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <button
                    onClick={() => copyToClipboard(affiliateData.referralCode, "Referral code")}
                    className="flex items-center gap-2 hover:text-yellow-300 transition-colors"
                  >
                    <span className="text-white/60">Code:</span>
                    <span className="font-mono font-bold">{affiliateData.referralCode}</span>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 glassmorphism border-border/50 hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium">
                  Active
                </span>
              </div>
              <p className="text-3xl font-display font-bold">{affiliateData.totalReferrals}</p>
              <p className="text-sm text-muted-foreground">Total Referrals</p>
              <p className="text-xs text-muted-foreground mt-2">
                {affiliateData.activeReferrals} currently subscribed
              </p>
            </Card>

            <Card className="p-6 glassmorphism border-border/50 hover:border-secondary/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-secondary" />
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-warning/10 text-warning font-medium">
                  Pending
                </span>
              </div>
              <p className="text-3xl font-display font-bold">${affiliateData.pendingEarnings.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Pending Earnings</p>
              <p className="text-xs text-muted-foreground mt-2">
                Next payout in 14 days
              </p>
            </Card>

            <Card className="p-6 glassmorphism border-border/50 hover:border-accent/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <BadgeDollarSign className="w-6 h-6 text-accent" />
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  This Month
                </span>
              </div>
              <p className="text-3xl font-display font-bold">${affiliateData.thisMonthEarnings.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Monthly Earnings</p>
              <p className="text-xs text-muted-foreground mt-2">
                {currentTier.commission}% commission rate
              </p>
            </Card>

            <Card className="p-6 glassmorphism border-border/50 hover:border-success/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-success" />
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium">
                  Lifetime
                </span>
              </div>
              <p className="text-3xl font-display font-bold">${affiliateData.totalEarnings.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Earned</p>
              <p className="text-xs text-muted-foreground mt-2">
                Since joining program
              </p>
            </Card>
          </div>

          {/* Current Tier & Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Tier Card */}
            <Card className={`p-6 border-2 ${currentTier.borderColor} relative overflow-hidden`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${currentTier.color} opacity-5`} />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentTier.color} flex items-center justify-center shadow-lg`}>
                    <currentTier.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Tier</p>
                    <h3 className="text-2xl font-display font-bold">{currentTier.name}</h3>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {currentTier.perks.slice(0, 4).map((perk, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-success" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>

                {nextTier && (
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress to {nextTier.name}</span>
                      <span className="font-bold">
                        {affiliateData.totalReferrals}/{nextTier.minReferrals}
                      </span>
                    </div>
                    <Progress value={progressToNextTier} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {nextTier.minReferrals - affiliateData.totalReferrals} more referrals to unlock {nextTier.commission}% commission
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Milestone Bonuses */}
            <Card className="p-6 glassmorphism border-border/50 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-display font-bold flex items-center gap-2">
                    <Gift className="w-5 h-5 text-secondary" />
                    Milestone Bonuses
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Unlock cash rewards as you hit milestones
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-display font-bold text-success">$2,875</p>
                  <p className="text-xs text-muted-foreground">Total Available</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {milestoneBonuses.map((milestone, index) => {
                  const status = getMilestoneStatus(milestone);
                  return (
                    <div
                      key={index}
                      className={`relative p-4 rounded-xl border transition-all ${
                        status === "achieved"
                          ? "border-success/50 bg-success/10"
                          : status === "close"
                          ? "border-warning/50 bg-warning/5 animate-pulse"
                          : "border-border/50 bg-card/50"
                      }`}
                    >
                      {status === "achieved" && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-success flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mb-1">{milestone.label}</p>
                      <p className="text-lg font-display font-bold text-success">${milestone.bonus}</p>
                      <p className="text-xs text-muted-foreground">
                        {milestone.referrals} referrals
                      </p>
                      {status === "close" && (
                        <p className="text-xs text-warning mt-1 font-medium">Almost there!</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Tier Comparison & Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* All Tiers */}
            <Card className="p-6 glassmorphism border-border/50">
              <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-primary" />
                Commission Tiers
              </h3>

              <div className="space-y-3">
                {affiliateTiers.map((tier, index) => {
                  const isCurrentTier = tier.name === currentTier.name;
                  const isUnlocked = affiliateData.totalReferrals >= tier.minReferrals;

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrentTier
                          ? `${tier.borderColor} ${tier.bgColor}`
                          : isUnlocked
                          ? "border-success/30 bg-success/5"
                          : "border-border/30 bg-card/30 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center`}
                          >
                            <tier.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-bold flex items-center gap-2">
                              {tier.name}
                              {isCurrentTier && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                                  Current
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {tier.minReferrals === 0
                                ? "Start here"
                                : `${tier.minReferrals}+ referrals`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-display font-bold text-primary">
                            {tier.commission}%
                          </p>
                          <p className="text-xs text-muted-foreground">commission</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Leaderboard */}
            <Card className="p-6 glassmorphism border-border/50">
              <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Top Affiliates
              </h3>

              <div className="space-y-3">
                {topAffiliates.map((affiliate, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all hover:border-primary/30 ${
                      index === 0
                        ? "border-yellow-500/30 bg-yellow-500/5"
                        : index === 1
                        ? "border-gray-400/30 bg-gray-400/5"
                        : index === 2
                        ? "border-amber-600/30 bg-amber-600/5"
                        : "border-border/30 bg-card/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0
                            ? "bg-yellow-500 text-black"
                            : index === 1
                            ? "bg-gray-400 text-black"
                            : index === 2
                            ? "bg-amber-600 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
                        {affiliate.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{affiliate.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {affiliate.referrals} referrals
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-success">
                          ${affiliate.earnings.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">earned</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 text-center">
                <p className="text-sm text-muted-foreground mb-1">Your Position</p>
                <p className="text-2xl font-display font-bold">
                  {affiliateData.totalReferrals > 0 ? "#--" : "Not ranked yet"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start referring to appear on the leaderboard!
                </p>
              </div>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="p-8 glassmorphism border-border/50">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-display font-bold mb-2">
                How It Works
              </h3>
              <p className="text-muted-foreground">
                Start earning in 3 simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                  <span className="text-2xl font-display font-bold">1</span>
                </div>
                <h4 className="font-display font-bold mb-2">Share Your Link</h4>
                <p className="text-sm text-muted-foreground">
                  Copy your unique referral link and share it with your community, followers, or friends
                </p>
              </div>

              <div className="text-center relative">
                <div className="hidden md:block absolute top-8 -left-4 w-8">
                  <ChevronRight className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-secondary/30">
                  <span className="text-2xl font-display font-bold">2</span>
                </div>
                <h4 className="font-display font-bold mb-2">Users Sign Up</h4>
                <p className="text-sm text-muted-foreground">
                  When someone signs up through your link, they're automatically tracked to your account
                </p>
              </div>

              <div className="text-center relative">
                <div className="hidden md:block absolute top-8 -left-4 w-8">
                  <ChevronRight className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/30">
                  <span className="text-2xl font-display font-bold text-background">3</span>
                </div>
                <h4 className="font-display font-bold mb-2">Earn Forever</h4>
                <p className="text-sm text-muted-foreground">
                  Earn commission on every payment they make — for life. No caps, no limits
                </p>
              </div>
            </div>
          </Card>

          {/* CTA Section */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 p-8 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism border border-primary/30 text-sm mb-6">
                <Target className="w-4 h-4 text-primary" />
                <span>Limited Time Offer</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Start Earning{" "}
                <span className="gradient-text">
                  Today
                </span>
              </h3>

              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of affiliates already earning passive income with Tribe Connect.
                Your first referral could be just one share away.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="gradient-primary text-lg px-8 py-6 animate-glow gap-2"
                  onClick={() => copyToClipboard(referralLink, "Referral link")}
                >
                  <Copy className="w-5 h-5" />
                  Copy Your Link
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="glassmorphism border-primary/30 hover:border-primary/60 text-lg px-8 py-6 gap-2"
                >
                  View Resources
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-success" />
                No minimum payout • Instant tracking • Lifetime commissions
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Affiliate;
