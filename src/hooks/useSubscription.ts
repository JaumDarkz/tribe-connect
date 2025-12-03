/**
 * useSubscription Hook
 * Access subscription context from any component
 */

import { useContext } from 'react';
import { SubscriptionContext } from '@/contexts/SubscriptionContext';
import type { SubscriptionContextType } from '@/types/subscription';

/**
 * Hook to access subscription context
 * @throws Error if used outside SubscriptionProvider
 * @returns Subscription context
 */
export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);

  if (context === undefined) {
    throw new Error(
      'useSubscription must be used within a SubscriptionProvider'
    );
  }

  return context;
};
