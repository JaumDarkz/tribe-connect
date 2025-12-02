/**
 * Password Reset Page
 * Send password reset email to user
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { getAuthErrorMessage } from '@/utils/auth-errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap, CheckCircle2, ArrowLeft, Mail } from 'lucide-react';

// Form validation schema
const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);
    try {
      await resetPassword(data.email);
      setSentEmail(data.email);
      setSuccess(true);
      toast({
        title: 'Reset email sent',
        description: 'Check your email for password reset instructions.',
      });
    } catch (error) {
      toast({
        title: 'Failed to send reset email',
        description: getAuthErrorMessage(error),
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

          {!success && (
            <>
              <h1 className="text-3xl font-display font-bold mt-4">
                Reset your password
              </h1>
              <p className="text-muted-foreground mt-2">
                Enter your email and we'll send you a reset link
              </p>
            </>
          )}
        </div>

        <div className="glassmorphism rounded-2xl p-8 border border-border/50">
          {success ? (
            // Success state
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold">
                  Check your email
                </h2>
                <p className="text-muted-foreground">
                  We sent password reset instructions to
                </p>
                <p className="font-medium">{sentEmail}</p>
              </div>

              <div className="glassmorphism rounded-lg p-4 border border-primary/20 text-left space-y-2">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">Didn't receive the email?</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Check your spam folder</li>
                      <li>• Verify you entered the correct email</li>
                      <li>• Wait a few minutes and check again</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => setSuccess(false)}
                  className="w-full gradient-primary"
                >
                  Send to different email
                </Button>

                <Button asChild variant="ghost" className="w-full">
                  <Link to="/login">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to sign in
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            // Form state
            <div className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
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

                <Button
                  type="submit"
                  className="w-full gradient-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </Button>
              </form>

              <Button asChild variant="ghost" className="w-full">
                <Link to="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to sign in
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Sign up link */}
        {!success && (
          <p className="text-center mt-6 text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
