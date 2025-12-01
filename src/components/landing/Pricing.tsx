import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "All core features unlimited",
      "1 server per account",
      "Standard earning rates",
      "Manual captcha verification",
      "Standard raffle participation",
      "Community support",
      "Basic analytics",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Silver",
    price: "$5.99",
    period: "/month",
    description: "Enhanced experience for active members",
    features: [
      "All Free features",
      "Faster point claiming",
      "Premium-exclusive giveaways",
      "+1 extra raffle entry",
      "Win reminder notifications",
      "Captcha-free participation",
      "Multiple servers",
    ],
    cta: "Upgrade to Silver",
    popular: false,
  },
  {
    name: "Gold",
    price: "$11.99",
    period: "/month",
    description: "For power users and serious earners",
    features: [
      "All Silver features",
      "Auto Farm (1 server)",
      "5x monthly raffle tickets",
      "+10% XP earnings boost",
      "Point transfers (30% fee)",
      "Limited API access",
      "Priority processing",
    ],
    cta: "Upgrade to Gold",
    popular: true,
  },
  {
    name: "Diamond",
    price: "$17.99",
    period: "/month",
    description: "Ultimate experience for VIP members",
    features: [
      "All Gold features",
      "Auto Farm (3 servers)",
      "10x monthly raffle tickets",
      "+25% XP earnings boost",
      "Point transfers (10% fee)",
      "Advanced API access",
      "VIP status everywhere",
      "Insider community",
    ],
    cta: "Go Diamond",
    popular: false,
  },
];

export const Pricing = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="pricing">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Choose Your
            <span className="gradient-primary bg-clip-text text-transparent"> Power Level</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Start free forever. Upgrade anytime for automation and multiplied earnings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative glassmorphism rounded-2xl p-8 border transition-all hover:scale-105 duration-300 ${
                plan.popular
                  ? "border-primary shadow-[0_0_50px_rgba(29,161,242,0.3)] scale-105"
                  : "border-border/50 hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-primary text-sm font-display font-bold flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-display font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/dashboard">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "gradient-primary animate-glow"
                        : "bg-card hover:bg-muted"
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-muted-foreground">
            All plans include unlimited features. Premium applies to your account across ALL servers.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-success" />
              <span className="text-sm">No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-success" />
              <span className="text-sm">Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-success" />
              <span className="text-sm">24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
