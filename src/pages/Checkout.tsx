/**
 * Checkout Page
 * Multi-step checkout wizard for upgrading subscription plans
 */

import { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckoutWizard } from '@/components/checkout/CheckoutWizard';
import { TrustBadges } from '@/components/checkout/TrustBadges';
import { Testimonials } from '@/components/checkout/Testimonials';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      const plan = searchParams.get('plan') || '';
      navigate(`/login?redirect=/checkout?plan=${plan}`);
    }
  }, [user, authLoading, navigate, searchParams]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Back button */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link to="/pricing">
              <ArrowLeft className="w-4 h-4" />
              Back to Pricing
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Unlock Your{' '}
            <span className="gradient-text">Power Level</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join 500K+ members who boosted their earnings with premium features
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Checkout wizard (2 columns) */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <CheckoutWizard />
          </div>

          {/* Sidebar (1 column) */}
          <div className="space-y-6 order-1 lg:order-2">
            <TrustBadges />
            <Testimonials />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
