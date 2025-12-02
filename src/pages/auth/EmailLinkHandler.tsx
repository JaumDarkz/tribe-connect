/**
 * Email Link Handler Page
 * Completes passwordless email link sign-in
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getAuthErrorMessage } from '@/utils/auth-errors';
import {
  isSignInLink,
  getStoredEmailForSignIn,
} from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Mail,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const EmailLinkHandler = () => {
  const navigate = useNavigate();
  const { signInWithEmailLink } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [needsEmail, setNeedsEmail] = useState(false);

  useEffect(() => {
    const handleEmailLink = async () => {
      const emailLink = window.location.href;

      // Check if this is a valid sign-in link
      if (!isSignInLink(emailLink)) {
        setError('Invalid or expired sign-in link.');
        setLoading(false);
        return;
      }

      // Try to get email from localStorage
      const storedEmail = getStoredEmailForSignIn();

      if (storedEmail) {
        // Complete sign-in with stored email
        try {
          await signInWithEmailLink(storedEmail, emailLink);
          setSuccess(true);
          toast({
            title: 'Successfully signed in!',
            description: 'Redirecting to dashboard...',
          });
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } catch (err) {
          setError(getAuthErrorMessage(err));
          toast({
            title: 'Sign in failed',
            description: getAuthErrorMessage(err),
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      } else {
        // Email not found, prompt user to enter it
        setNeedsEmail(true);
        setLoading(false);
      }
    };

    handleEmailLink();
  }, [signInWithEmailLink, navigate, toast]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const emailLink = window.location.href;
      await signInWithEmailLink(email, emailLink);
      setSuccess(true);
      toast({
        title: 'Successfully signed in!',
        description: 'Redirecting to dashboard...',
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(getAuthErrorMessage(err));
      toast({
        title: 'Sign in failed',
        description: getAuthErrorMessage(err),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background/95 to-background p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iaHNsKDIwMyA4OSUgNTMlIC8gMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-display font-bold text-2xl"
          >
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            ENGAGE <span className="text-primary">IO</span>
          </Link>
        </div>

        <div className="glassmorphism rounded-2xl p-8 border border-border/50">
          {/* Loading state */}
          {loading && !needsEmail && (
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <h2 className="text-2xl font-display font-bold">
                Verifying your email link...
              </h2>
              <p className="text-muted-foreground">Please wait a moment</p>
            </div>
          )}

          {/* Success state */}
          {success && (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 mx-auto text-success" />
              <h2 className="text-2xl font-display font-bold">
                Successfully signed in!
              </h2>
              <p className="text-muted-foreground">
                Redirecting you to the dashboard...
              </p>
            </div>
          )}

          {/* Error state */}
          {error && !needsEmail && (
            <div className="text-center space-y-4">
              <XCircle className="w-12 h-12 mx-auto text-destructive" />
              <h2 className="text-2xl font-display font-bold">
                Sign in failed
              </h2>
              <p className="text-muted-foreground">{error}</p>
              <div className="space-y-2 pt-4">
                <Button
                  asChild
                  className="w-full gradient-primary"
                >
                  <Link to="/login">Try again</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full"
                >
                  <Link to="/">Go home</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Email input form */}
          {needsEmail && !success && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Mail className="w-12 h-12 mx-auto text-primary" />
                <h2 className="text-2xl font-display font-bold">
                  Confirm your email
                </h2>
                <p className="text-muted-foreground">
                  Please enter the email address you used to request the sign-in
                  link
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="bg-background/50"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Complete sign in'
                  )}
                </Button>
              </form>

              {error && (
                <div className="text-center">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="text-center">
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/login">Back to login</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailLinkHandler;
