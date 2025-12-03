/**
 * Authentication Tab
 * Manage connected authentication providers (Google, Discord, Twitter)
 */

import { useState, useMemo } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// ============================================================================
// Types
// ============================================================================

type Provider = {
  id: 'google' | 'discord' | 'twitter';
  name: string;
  providerId: string;
  icon: React.ReactNode;
  linkMethod: () => Promise<void>;
  unlinkMethod: () => Promise<void>;
};

// ============================================================================
// Provider Icons (SVG)
// ============================================================================

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const DiscordIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#5865F2">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1DA1F2">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

// ============================================================================
// Component
// ============================================================================

export const AuthenticationTab = () => {
  const { user, linkDiscordAccount, unlinkDiscordAccount, linkTwitterAccount, unlinkTwitterAccount } = useAuth();
  const { toast } = useToast();

  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false);
  const [providerToUnlink, setProviderToUnlink] = useState<Provider | null>(null);

  // Get connected provider IDs from user
  const connectedProviders = useMemo(() => {
    if (!user?.providerData) return new Set<string>();
    return new Set(user.providerData.map((p) => p.providerId));
  }, [user]);

  // Provider configurations
  const providers: Provider[] = [
    {
      id: 'google',
      name: 'Google',
      providerId: 'google.com',
      icon: <GoogleIcon />,
      linkMethod: async () => {
        toast({
          title: 'Already connected',
          description: 'Google is your primary sign-in method.',
        });
      },
      unlinkMethod: async () => {},
    },
    {
      id: 'discord',
      name: 'Discord',
      providerId: 'oidc.discord',
      icon: <DiscordIcon />,
      linkMethod: linkDiscordAccount,
      unlinkMethod: unlinkDiscordAccount,
    },
    {
      id: 'twitter',
      name: 'Twitter',
      providerId: 'twitter.com',
      icon: <TwitterIcon />,
      linkMethod: linkTwitterAccount,
      unlinkMethod: unlinkTwitterAccount,
    },
  ];

  // Check if provider is connected
  const isConnected = (provider: Provider) => connectedProviders.has(provider.providerId);

  // Check if it's safe to unlink (must have at least one provider)
  const canUnlink = connectedProviders.size > 1;

  // ========================================================================
  // Handlers
  // ========================================================================

  const handleLink = async (provider: Provider) => {
    if (isConnected(provider)) return;

    try {
      setLoadingProvider(provider.id);
      await provider.linkMethod();

      toast({
        title: `${provider.name} connected`,
        description: `Your ${provider.name} account has been successfully linked.`,
      });
    } catch (error: any) {
      let errorMessage = `Failed to link ${provider.name} account.`;

      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed. Please try again.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign-in was cancelled. Please try again.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with this email using a different sign-in method.';
      }

      toast({
        title: 'Connection failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleUnlinkConfirm = async () => {
    if (!providerToUnlink) return;

    try {
      setLoadingProvider(providerToUnlink.id);
      await providerToUnlink.unlinkMethod();

      toast({
        title: `${providerToUnlink.name} disconnected`,
        description: `Your ${providerToUnlink.name} account has been unlinked.`,
      });

      setUnlinkDialogOpen(false);
      setProviderToUnlink(null);
    } catch (error: any) {
      toast({
        title: 'Disconnection failed',
        description: error.message || `Failed to unlink ${providerToUnlink.name} account.`,
        variant: 'destructive',
      });
    } finally {
      setLoadingProvider(null);
    }
  };

  const openUnlinkDialog = (provider: Provider) => {
    setProviderToUnlink(provider);
    setUnlinkDialogOpen(true);
  };

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <div className="space-y-6">
      {/* Security Notice */}
      <div className="glassmorphism rounded-2xl p-6 border border-primary/30 bg-primary/5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1 text-sm">Security Requirement</h4>
            <p className="text-xs text-muted-foreground">
              You must have at least one authentication method connected to your account. If you
              want to switch methods, connect a new one before disconnecting the current one.
            </p>
          </div>
        </div>
      </div>

      {/* Connected Providers */}
      <div className="glassmorphism rounded-2xl p-6 border border-border/50">
        <h3 className="text-xl font-display font-bold mb-4">Connected Accounts</h3>

        <div className="space-y-4">
          {providers.map((provider) => {
            const connected = isConnected(provider);
            const loading = loadingProvider === provider.id;

            return (
              <div
                key={provider.id}
                className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border/30"
              >
                <div className="flex items-center gap-4">
                  {/* Provider Icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-background border border-border">
                    {provider.icon}
                  </div>

                  {/* Provider Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{provider.name}</h4>
                      {connected && (
                        <Badge variant="default" className="gradient-primary text-xs">
                          Connected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {connected
                        ? `Your ${provider.name} account is linked`
                        : `Connect your ${provider.name} account`}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div>
                  {connected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!canUnlink || loading}
                      onClick={() => openUnlinkDialog(provider)}
                    >
                      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={loading}
                      onClick={() => handleLink(provider)}
                      className="gradient-primary"
                    >
                      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlink Confirmation Dialog */}
      <AlertDialog open={unlinkDialogOpen} onOpenChange={setUnlinkDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect {providerToUnlink?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect your {providerToUnlink?.name} account? You can
              reconnect it at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loadingProvider !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnlinkConfirm}
              disabled={loadingProvider !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loadingProvider && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
