/**
 * Email Link Authentication Card
 * UI for passwordless email link sign-in
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';

interface EmailLinkAuthCardProps {
  onSendLink: (email: string) => Promise<void>;
  disabled?: boolean;
}

/**
 * Email Link Authentication Card
 * Allows users to sign in via magic link sent to email
 */
export const EmailLinkAuthCard = ({
  onSendLink,
  disabled = false,
}: EmailLinkAuthCardProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      return;
    }

    setLoading(true);
    try {
      await onSendLink(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="glassmorphism rounded-xl p-6 border border-primary/30 space-y-4">
        <div className="flex items-center gap-3 text-primary">
          <CheckCircle2 className="w-6 h-6" />
          <h3 className="font-display font-bold">Check your email!</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          We sent a sign-in link to <strong>{email}</strong>
        </p>
        <p className="text-sm text-muted-foreground">
          Click the link in the email to sign in. The link will expire in 1
          hour.
        </p>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setSent(false)}
        >
          Send to different email
        </Button>
      </div>
    );
  }

  return (
    <div className="glassmorphism rounded-xl p-6 border border-border/50 space-y-4">
      <div className="flex items-center gap-3">
        <Mail className="w-6 h-6 text-accent" />
        <h3 className="font-display font-bold">Sign in with email link</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        No password needed! We'll send you a magic link to sign in.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email-link">Email address</Label>
          <Input
            id="email-link"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={disabled || loading}
            required
            className="bg-background/50"
          />
        </div>
        <Button
          type="submit"
          className="w-full gradient-primary"
          disabled={disabled || loading || !email}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending link...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Send sign-in link
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
