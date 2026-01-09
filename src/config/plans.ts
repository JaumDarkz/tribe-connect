/**
 * Subscription Plans Configuration
 * Defines all available subscription plans and their features
 */

import { Plan, PlanTier } from '@/types/subscription';

/**
 * All subscription plans
 */
export const PLANS: Record<PlanTier, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: null,
    description: 'Perfect for getting started',
    features: [
      { name: 'All core features unlimited', included: true },
      { name: '1 server per account', included: true, limit: 1 },
      { name: 'Standard earning rates', included: true },
      { name: 'Manual captcha verification', included: true },
      { name: 'Standard raffle participation', included: true },
      { name: 'Community support', included: true },
      { name: 'Basic analytics', included: true },
    ],
    cta: 'Get Started',
    popular: false,
  },
  silver: {
    id: 'silver',
    name: 'Silver',
    price: 5.99,
    interval: 'month',
    description: 'Enhanced experience for active members',
    features: [
      { name: 'All Free features', included: true },
      { name: 'Faster point claiming', included: true },
      { name: 'Premium-exclusive giveaways', included: true },
      { name: '+1 extra raffle entry', included: true },
      { name: 'Captcha-free participation', included: true },
      { name: 'Multiple servers', included: true },
    ],
    cta: 'Upgrade to Silver',
    popular: false,
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    price: 11.99,
    interval: 'month',
    description: 'For power users and serious earners',
    features: [
      { name: 'All Silver features', included: true },
      { name: 'Auto Farm (1 server)', included: true, limit: 1 },
      { name: '5x monthly raffle tickets', included: true },
      { name: '+10% XP earnings boost', included: true },
      { name: 'Point transfers (30% fee)', included: true },
      { name: 'Limited API access', included: true },
      { name: 'Priority processing', included: true },
    ],
    cta: 'Upgrade to Gold',
    popular: true,
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond',
    price: 17.99,
    interval: 'month',
    description: 'Ultimate experience for VIP members',
    features: [
      { name: 'All Gold features', included: true },
      { name: 'Auto Farm (3 servers)', included: true, limit: 3 },
      { name: '10x monthly raffle tickets', included: true },
      { name: '+25% XP earnings boost', included: true },
      { name: 'Point transfers (10% fee)', included: true },
      { name: 'Advanced API access', included: true },
      { name: 'VIP status everywhere', included: true },
      { name: 'Insider community', included: true },
    ],
    cta: 'Go Diamond',
    popular: false,
  },
};

/**
 * Get plan by tier
 */
export const getPlanByTier = (tier: PlanTier): Plan => {
  return PLANS[tier];
};

/**
 * Get all plans as array
 */
export const getAllPlans = (): Plan[] => {
  return Object.values(PLANS);
};

/**
 * Get plan price
 */
export const getPlanPrice = (tier: PlanTier): number => {
  return PLANS[tier].price;
};

/**
 * Check if plan is paid
 */
export const isPlanPaid = (tier: PlanTier): boolean => {
  return tier !== 'free';
};

/**
 * Get plan hierarchy index (for comparison)
 */
export const getPlanHierarchyIndex = (tier: PlanTier): number => {
  const hierarchy: PlanTier[] = ['free', 'silver', 'gold', 'diamond'];
  return hierarchy.indexOf(tier);
};

/**
 * Check if planA is higher than planB
 */
export const isPlanHigher = (planA: PlanTier, planB: PlanTier): boolean => {
  return getPlanHierarchyIndex(planA) > getPlanHierarchyIndex(planB);
};

/**
 * Check if planA is lower than planB
 */
export const isPlanLower = (planA: PlanTier, planB: PlanTier): boolean => {
  return getPlanHierarchyIndex(planA) < getPlanHierarchyIndex(planB);
};

/**
 * Get plans ordered by price
 */
export const getPlansOrdered = (): Plan[] => {
  return getAllPlans().sort((a, b) => a.price - b.price);
};
