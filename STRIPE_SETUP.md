# Stripe Payment Integration Setup Guide

This guide will help you configure Stripe payment integration for ENGAGE IO.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Stripe Account Setup](#stripe-account-setup)
- [Environment Configuration](#environment-configuration)
- [Creating Products and Prices](#creating-products-and-prices)
- [Testing the Integration](#testing-the-integration)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js 18+ installed
- Stripe account (sign up at https://stripe.com)
- Firebase project with authentication configured
- Project dependencies installed (`npm install`)

---

## Stripe Account Setup

### 1. Create a Stripe Account

1. Go to https://stripe.com and click "Sign up"
2. Complete the registration process
3. Verify your email address

### 2. Enable Test Mode

1. In the Stripe Dashboard, ensure you're in **Test Mode** (toggle in top right)
2. Test mode allows you to test payments without real money

### 3. Get Your API Keys

1. Navigate to **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_test_...`)
3. **DO NOT** expose your Secret key in the frontend

---

## Environment Configuration

### 1. Update `.env` File

Add your Stripe publishable key to `.env`:

```bash
# Stripe Configuration (Test Mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

**Important Security Notes:**
- ✅ Only the publishable key goes in `.env`
- ❌ NEVER add the secret key to frontend code
- ✅ `.env` is already in `.gitignore`
- ✅ For production, use live keys (`pk_live_...`)

### 2. Verify Configuration

Start your dev server:
```bash
npm run dev
```

Check the browser console for any Stripe initialization errors.

---

## Creating Products and Prices

You need to create products in Stripe Dashboard that match your plans.

### Step 1: Create Products

1. Go to **Products** in Stripe Dashboard
2. Click **Add product** for each plan

#### Silver Plan
- **Name:** Silver
- **Description:** Enhanced experience for active members
- **Pricing:** $5.99 / month
- Click **Save product**
- Copy the **Product ID** (starts with `prod_...`)
- Copy the **Price ID** (starts with `price_...`)

#### Gold Plan
- **Name:** Gold
- **Description:** For power users and serious earners
- **Pricing:** $11.99 / month
- Click **Save product**
- Copy the **Product ID** and **Price ID**

#### Diamond Plan
- **Name:** Diamond
- **Description:** Ultimate experience for VIP members
- **Pricing:** $17.99 / month
- Click **Save product**
- Copy the **Product ID** and **Price ID**

### Step 2: Update Plan Configuration

Edit `src/config/plans.ts` and update the Stripe IDs:

```typescript
export const PLANS: Record<PlanTier, Plan> = {
  // ... free plan stays the same

  silver: {
    // ... other properties
    stripeProductId: 'prod_YOUR_ACTUAL_SILVER_PRODUCT_ID',
    stripePriceId: 'price_YOUR_ACTUAL_SILVER_PRICE_ID',
  },

  gold: {
    // ... other properties
    stripeProductId: 'prod_YOUR_ACTUAL_GOLD_PRODUCT_ID',
    stripePriceId: 'price_YOUR_ACTUAL_GOLD_PRICE_ID',
  },

  diamond: {
    // ... other properties
    stripeProductId: 'prod_YOUR_ACTUAL_DIAMOND_PRODUCT_ID',
    stripePriceId: 'price_YOUR_ACTUAL_DIAMOND_PRICE_ID',
  },
};
```

---

## Testing the Integration

### Test Cards

Use these test card numbers in **Test Mode**:

| Card Number          | Description              |
|---------------------|--------------------------|
| `4242 4242 4242 4242` | Success (default)        |
| `4000 0000 0000 0002` | Card declined            |
| `4000 0025 0000 3155` | Requires authentication  |
| `4000 0000 0000 9995` | Insufficient funds       |

**CVV:** Any 3 digits
**Expiry:** Any future date
**ZIP:** Any 5 digits

### Testing Workflow

1. **Sign Up**
   - Go to http://localhost:5173/signup
   - Create a test account
   - Verify email if required

2. **View Pricing**
   - Go to http://localhost:5173/pricing
   - Click on any paid plan (Silver, Gold, or Diamond)

3. **Checkout Flow (MVP Simulation)**
   - Click "Upgrade to [Plan]"
   - You'll be redirected to the success page
   - Check that your subscription is updated

4. **Verify Subscription**
   - Go to Dashboard → Billing
   - Verify your plan is shown correctly
   - Check subscription badge in sidebar

5. **Test Cancellation**
   - In Billing settings, click "Cancel Subscription"
   - Confirm the cancellation
   - Verify the "Cancels on [date]" message appears

6. **Test Reactivation**
   - Click "Reactivate Subscription"
   - Verify the subscription is active again

---

## MVP Implementation Notes

### Current State (Frontend-Only)

The current implementation is a **frontend-only MVP** for demonstration purposes:

✅ **What Works:**
- Full pricing page with plan comparison
- Stripe configuration and setup
- Subscription state management (localStorage)
- Feature gating system
- Billing settings page
- All UI/UX flows

⚠️ **MVP Limitations:**
- No real Stripe Checkout redirect (simulated for demo)
- Subscription data stored in localStorage (can be manipulated)
- No webhook integration
- No automatic subscription updates
- No invoice history

### Future Backend Implementation

For production, you'll need to:

1. **Create NestJS Backend**
   - Implement `/api/subscriptions/checkout` endpoint
   - Create Stripe webhook handler
   - Store subscriptions in Firestore
   - Validate subscription status server-side

2. **Update Frontend**
   - Replace mock checkout with real API calls
   - Remove localStorage subscription management
   - Add real-time subscription sync
   - Implement invoice fetching

3. **Configure Webhooks**
   - Set up webhook endpoint in Stripe Dashboard
   - Handle subscription lifecycle events
   - Sync subscription status automatically

See the full implementation plan in `.claude/plans/stripe-integration-plan.md` (Section 17: Future Backend Implementation).

---

## Production Deployment

### 1. Switch to Live Mode

1. In Stripe Dashboard, toggle to **Live Mode**
2. Complete Stripe account activation (business details, bank account)
3. Go to **Developers** → **API keys**
4. Copy your **Live Publishable Key** (starts with `pk_live_...`)

### 2. Update Environment Variables

For production deployment (Vercel, Netlify, etc.):

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key_here
```

### 3. Configure Authorized Domains

1. Go to Stripe Dashboard → **Settings** → **Checkout settings**
2. Add your production domain to **Authorized domains**

### 4. Customize Email Templates

1. Go to **Settings** → **Emails**
2. Customize receipt, invoice, and notification emails
3. Add your logo and brand colors

### 5. Enable Payment Methods

1. Go to **Settings** → **Payment methods**
2. Enable desired payment methods:
   - Cards (Visa, Mastercard, Amex, etc.)
   - Apple Pay
   - Google Pay
   - Bank transfers (optional)

---

## Feature Gating Examples

### Basic Feature Gate

```tsx
import { FeatureGate } from '@/components/subscription/FeatureGate';
import { InlineUpgradePrompt } from '@/components/subscription/InlineUpgradePrompt';

// Hide feature if user doesn't have access
<FeatureGate feature="autoFarm">
  <AutoFarmSettings />
</FeatureGate>

// Show upgrade prompt instead
<FeatureGate
  feature="autoFarm"
  fallback={<InlineUpgradePrompt feature="autoFarm" />}
>
  <AutoFarmSettings />
</FeatureGate>
```

### Locked Content Overlay

```tsx
import { LockedFeatureOverlay } from '@/components/subscription/LockedFeatureOverlay';

<LockedFeatureOverlay feature="apiAccess">
  <APIKeyManager />
</LockedFeatureOverlay>
```

### Check Feature Access in Code

```tsx
import { useFeatureGate } from '@/hooks/useFeatureGate';

function MyComponent() {
  const { hasAccess, requiredPlan } = useFeatureGate('multipleServers');

  if (!hasAccess) {
    return <div>Upgrade to {requiredPlan} to use this feature</div>;
  }

  return <ServerSelector />;
}
```

---

## Troubleshooting

### Issue: "Stripe failed to load"

**Solution:**
- Check that `VITE_STRIPE_PUBLISHABLE_KEY` is set in `.env`
- Restart your dev server (`npm run dev`)
- Clear browser cache and reload
- Verify the key format starts with `pk_test_` or `pk_live_`

### Issue: Subscription not persisting after login

**Solution:**
- Check browser localStorage for `engageio_subscription_[userId]`
- Clear localStorage and try again
- Check browser console for errors

### Issue: Plans showing "prod_SILVER_ID" instead of real products

**Solution:**
- Update `src/config/plans.ts` with real Stripe Product IDs
- Ensure you created products in Stripe Dashboard
- Copy the IDs exactly as shown in Stripe

### Issue: TypeScript errors in imports

**Solution:**
```bash
npm install
npm run build
```

### Issue: Build warnings about chunk size

**Solution:**
- This is normal for MVP
- For production, implement code splitting:
  ```tsx
  const Pricing = lazy(() => import('./pages/Pricing'));
  const BillingSettings = lazy(() => import('./pages/dashboard/BillingSettings'));
  ```

---

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [React Integration](https://stripe.com/docs/stripe-js/react)

---

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review browser console for errors
3. Check Stripe Dashboard logs (**Developers** → **Logs**)
4. Verify all environment variables are set correctly
5. Ensure products are created in Stripe Dashboard

---

## Security Checklist

Before going to production:

- [ ] Using `pk_live_` key (not `pk_test_`)
- [ ] `.env` file is in `.gitignore`
- [ ] Backend API implemented for checkout
- [ ] Webhook signature verification enabled
- [ ] HTTPS enforced on production domain
- [ ] Authorized domains configured in Stripe
- [ ] Test mode disabled in production
- [ ] Secret keys stored securely (never in frontend)

---

**Last Updated:** December 2025
**Version:** 1.0.0 (MVP Frontend-Only)
