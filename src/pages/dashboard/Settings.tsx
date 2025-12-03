/**
 * Settings Page
 * Centralized settings page with tab navigation for account, profile, authentication, billing, and preferences
 */

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, UserCircle, Shield, CreditCard, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { AccountSettingsTab } from '@/components/settings/AccountSettingsTab';
import { ProfileSettingsTab } from '@/components/settings/ProfileSettingsTab';
import { AuthenticationTab } from '@/components/settings/AuthenticationTab';
import { BillingTab } from '@/components/settings/BillingTab';
import { PreferencesTab } from '@/components/settings/PreferencesTab';

const Settings = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'account';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const { user, loading: authLoading } = useAuth();
  const { loading: subLoading } = useSubscription();

  if (authLoading || subLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6 space-y-6">
          {/* Page header */}
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account, profile, billing, and preferences
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
              <TabsTrigger value="account" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <UserCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="authentication" className="gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Authentication</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="gap-2">
                <SettingsIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6">
              <AccountSettingsTab />
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <ProfileSettingsTab />
            </TabsContent>

            <TabsContent value="authentication" className="space-y-6">
              <AuthenticationTab />
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <BillingTab />
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <PreferencesTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;
