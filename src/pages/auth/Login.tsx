/**
 * Login Page
 * Email/password, Google OAuth, and email link authentication
 */

import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { getAuthErrorMessage } from '@/utils/auth-errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { EmailLinkAuthCard } from '@/components/auth/EmailLinkAuthCard';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap, Eye, EyeOff } from 'lucide-react';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle, sendSignInLinkToEmail } =
    useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailLink, setShowEmailLink] = useState(false);

  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Email/Password sign in
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await signInWithEmail(data.email, data.password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
      navigate(returnUrl);
    } catch (error) {
      toast({
        title: 'Sign in failed',
        description: getAuthErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth sign in
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: 'Welcome!',
        description: 'You have successfully signed in with Google.',
      });
      navigate(returnUrl);
    } catch (error) {
      toast({
        title: 'Google sign in failed',
        description: getAuthErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  // Email link sign in
  const handleSendEmailLink = async (email: string) => {
    try {
      await sendSignInLinkToEmail(email);
      toast({
        title: 'Check your email',
        description: 'We sent you a sign-in link.',
      });
    } catch (error) {
      toast({
        title: 'Failed to send email',
        description: getAuthErrorMessage(error),
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background/95 to-background p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iaHNsKDIwMyA4OSUgNTMlIC8gMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-display font-bold text-2xl mb-4"
          >
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            ENGAGE <span className="text-primary">IO</span>
          </Link>
          <h1 className="text-3xl font-display font-bold mt-4">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your account to continue
          </p>
        </div>

        {/* Main auth card */}
        <div className="glassmorphism rounded-2xl p-8 border border-border/50 space-y-6">
          {/* Email/Password form */}
          {!showEmailLink && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register('email')}
                  disabled={loading}
                  className="bg-background/50"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/auth/reset-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    disabled={loading}
                    className="bg-background/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" {...register('rememberMe')} />
                <label
                  htmlFor="rememberMe"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
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
                  'Sign in'
                )}
              </Button>
            </form>
          )}

          {/* Email link option toggle */}
          {!showEmailLink && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <GoogleAuthButton
                onSignIn={handleGoogleSignIn}
                disabled={loading}
              />

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowEmailLink(true)}
              >
                Sign in with email link (no password)
              </Button>
            </>
          )}

          {/* Email link card */}
          {showEmailLink && (
            <>
              <EmailLinkAuthCard
                onSendLink={handleSendEmailLink}
                disabled={loading}
              />

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowEmailLink(false)}
              >
                Back to password sign in
              </Button>
            </>
          )}
        </div>

        {/* Sign up link */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
