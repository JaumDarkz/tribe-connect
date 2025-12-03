/**
 * Billing Tab
 * Manage subscription, payment methods, and billing history
 * Migrated from BillingSettings page
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubscriptionBadge } from '@/components/subscription/SubscriptionBadge';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { getPlanByTier, getAllPlans, isPlanHigher } from '@/config/plans';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';

export const BillingTab = () => {
  const navigate = useNavigate();
  const {
    subscription,
    currentPlan,
    cancelSubscription: cancelSub,
    reactivateSubscription: reactivateSub,
  } = useSubscription();
  const { toast } = useToast();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showReactivateDialog, setShowReactivateDialog] = useState(false);
  const [processing, setProcessing] = useState(false);

  const currentPlanData = getPlanByTier(currentPlan);
  const allPlans = getAllPlans();

  const handleCancelSubscription = async () => {
    try {
      setProcessing(true);
      await cancelSub();
      toast({
        title: 'Subscription canceled',
        description: 'Your subscription will remain active until the end of your billing period.',
      });
      setShowCancelDialog(false);
    } catch (error: any) {
      toast({
        title: 'Cancellation failed',
        description: error.message || 'Failed to cancel subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setProcessing(true);
      await reactivateSub();
      toast({
        title: 'Subscription reactivated',
        description: 'Your subscription has been reactivated and will continue normally.',
      });
      setShowReactivateDialog(false);
    } catch (error: any) {
      toast({
        title: 'Reactivation failed',
        description: error.message || 'Failed to reactivate subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Current Plan */}
      <div className="lg:col-span-2 space-y-6">
        {/* Plan card */}
        <div className="glassmorphism rounded-2xl p-6 border border-border/50">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-display font-bold mb-2">Current Plan</h2>
              <p className="text-sm text-muted-foreground">
                Your active subscription plan
              </p>
            </div>
            <SubscriptionBadge plan={currentPlan} />
          </div>

          <div className="space-y-6">
            {/* Plan details */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-bold">
                ${currentPlanData.price}
              </span>
              {currentPlanData.interval && (
                <span className="text-muted-foreground">/{currentPlanData.interval}</span>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              {subscription?.cancelAtPeriodEnd ? (
                <>
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <span className="text-sm">
                    Cancels on{' '}
                    {subscription?.currentPeriodEnd
                      ? format(subscription.currentPeriodEnd, 'MMMM d, yyyy')
                      : 'end of period'}
                  </span>
                </>
              ) : subscription?.status === 'active' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-sm">
                    {currentPlan === 'free'
                      ? 'Active'
                      : `Renews on ${
                          subscription?.currentPeriodEnd
                            ? format(subscription.currentPeriodEnd, 'MMMM d, yyyy')
                            : 'N/A'
                        }`}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-destructive" />
                  <span className="text-sm capitalize">{subscription?.status || 'Unknown'}</span>
                </>
              )}
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold mb-3">Plan Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentPlanData.features.slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{feature.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-border/50">
              {subscription?.cancelAtPeriodEnd ? (
                <Button
                  onClick={() => setShowReactivateDialog(true)}
                  className="gradient-primary"
                >
                  Reactivate Subscription
                </Button>
              ) : (
                <>
                  {currentPlan !== 'free' && (
                    <Button
                      onClick={() => setShowCancelDialog(true)}
                      variant="destructive"
                    >
                      Cancel Subscription
                    </Button>
                  )}
                  <Button onClick={() => navigate('/pricing')} variant="outline">
                    Change Plan
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Upgrade options */}
        {allPlans.filter((p) => isPlanHigher(p.id, currentPlan)).length > 0 && (
          <div className="glassmorphism rounded-2xl p-6 border border-border/50">
            <h2 className="text-xl font-display font-bold mb-4">Upgrade Your Plan</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Unlock more features and boost your earning potential
            </p>

            <div className="space-y-3">
              {allPlans
                .filter((plan) => isPlanHigher(plan.id, currentPlan))
                .map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/30 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-bold">{plan.name}</h3>
                        {plan.popular && (
                          <Badge className="gradient-primary text-xs">Popular</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <div className="font-display font-bold text-xl">
                          ${plan.price}
                        </div>
                        <div className="text-xs text-muted-foreground">/month</div>
                      </div>
                      <Button
                        onClick={() => navigate('/pricing')}
                        size="sm"
                        className="gradient-primary"
                      >
                        Upgrade
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar info */}
      <div className="space-y-6">
        {/* Billing info */}
        <div className="glassmorphism rounded-2xl p-6 border border-border/50">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Billing Information
          </h3>

          <div className="space-y-4">
            {subscription?.stripeCustomerId && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Customer ID</div>
                <div className="text-sm font-mono truncate">
                  {subscription.stripeCustomerId}
                </div>
              </div>
            )}

            {subscription?.currentPeriodStart && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Billing Started</div>
                <div className="text-sm">
                  {format(subscription.currentPeriodStart, 'MMMM d, yyyy')}
                </div>
              </div>
            )}

            {currentPlan === 'free' && (
              <div className="text-sm text-muted-foreground">
                No billing information for free plan
              </div>
            )}
          </div>
        </div>

        {/* Support */}
        <div className="glassmorphism rounded-2xl p-6 border border-border/50">
          <h3 className="font-display font-bold mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Have questions about billing or your subscription?
          </p>
          <a
            href="mailto:support@tribeconnect.com"
            className="text-sm text-primary hover:underline"
          >
            Contact Support →
          </a>
        </div>

        {/* Important info */}
        <div className="glassmorphism rounded-2xl p-6 border border-warning/30 bg-warning/5">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1 text-sm">Billing Cycle</h4>
              <p className="text-xs text-muted-foreground">
                Your subscription automatically renews each month. Cancel anytime to stop
                future charges.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel confirmation dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Your subscription will remain active until{' '}
              {subscription?.currentPeriodEnd
                ? format(subscription.currentPeriodEnd, 'MMMM d, yyyy')
                : 'the end of your billing period'}
              . After that, you'll be downgraded to the Free plan and lose access to premium
              features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reactivate confirmation dialog */}
      <AlertDialog open={showReactivateDialog} onOpenChange={setShowReactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Your subscription will continue with the same plan and billing cycle. You'll be
              charged on your next billing date.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReactivateSubscription}
              disabled={processing}
              className="gradient-primary"
            >
              Reactivate Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
