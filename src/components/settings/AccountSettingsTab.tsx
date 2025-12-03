/**
 * Account Settings Tab
 * Manage account details: display name, email, password, and account deletion
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  deleteUser,
} from 'firebase/auth';
import { Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
// Validation Schemas
// ============================================================================

const displayNameSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
});

const emailSchema = z.object({
  newEmail: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type DisplayNameFormData = z.infer<typeof displayNameSchema>;
type EmailFormData = z.infer<typeof emailSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// ============================================================================
// Component
// ============================================================================

export const AccountSettingsTab = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loadingName, setLoadingName] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Forms
  const nameForm = useForm<DisplayNameFormData>({
    resolver: zodResolver(displayNameSchema),
    defaultValues: {
      displayName: user?.displayName || '',
    },
  });

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      newEmail: '',
      password: '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // ========================================================================
  // Handlers
  // ========================================================================

  const handleUpdateDisplayName = async (data: DisplayNameFormData) => {
    if (!user) return;

    try {
      setLoadingName(true);
      await updateUserProfile(data.displayName);
      toast({
        title: 'Display name updated',
        description: 'Your display name has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update display name.',
        variant: 'destructive',
      });
    } finally {
      setLoadingName(false);
    }
  };

  const handleUpdateEmail = async (data: EmailFormData) => {
    if (!user || !user.email) return;

    try {
      setLoadingEmail(true);

      // Re-authenticate user before changing email
      const credential = EmailAuthProvider.credential(user.email, data.password);
      await reauthenticateWithCredential(user, credential);

      // Update email
      await updateEmail(user, data.newEmail);

      toast({
        title: 'Email updated',
        description: 'Your email has been updated successfully.',
      });

      emailForm.reset();
    } catch (error: any) {
      let errorMessage = 'Failed to update email.';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use.';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please sign out and sign in again before changing your email.';
      }

      toast({
        title: 'Update failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleChangePassword = async (data: PasswordFormData) => {
    if (!user || !user.email) return;

    try {
      setLoadingPassword(true);

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, data.newPassword);

      toast({
        title: 'Password changed',
        description: 'Your password has been changed successfully.',
      });

      passwordForm.reset();
    } catch (error: any) {
      let errorMessage = 'Failed to change password.';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect current password.';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please sign out and sign in again before changing your password.';
      }

      toast({
        title: 'Update failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      setDeleting(true);
      await deleteUser(user);

      toast({
        title: 'Account deleted',
        description: 'Your account has been permanently deleted.',
      });

      navigate('/');
    } catch (error: any) {
      let errorMessage = 'Failed to delete account.';
      if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please sign out and sign in again before deleting your account.';
      }

      toast({
        title: 'Deletion failed',
        description: errorMessage,
        variant: 'destructive',
      });
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <div className="space-y-6">
      {/* Update Display Name */}
      <div className="glassmorphism rounded-2xl p-6 border border-border/50">
        <h3 className="text-xl font-display font-bold mb-4">Display Name</h3>
        <form onSubmit={nameForm.handleSubmit(handleUpdateDisplayName)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              {...nameForm.register('displayName')}
              placeholder="Your display name"
            />
            {nameForm.formState.errors.displayName && (
              <p className="text-sm text-destructive">
                {nameForm.formState.errors.displayName.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loadingName || !nameForm.formState.isDirty}
            className="gradient-primary"
          >
            {loadingName && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update Display Name
          </Button>
        </form>
      </div>

      {/* Update Email */}
      <div className="glassmorphism rounded-2xl p-6 border border-border/50">
        <h3 className="text-xl font-display font-bold mb-4">Email Address</h3>
        <form onSubmit={emailForm.handleSubmit(handleUpdateEmail)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentEmail">Current Email</Label>
            <Input
              id="currentEmail"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newEmail">New Email</Label>
            <Input
              id="newEmail"
              type="email"
              {...emailForm.register('newEmail')}
              placeholder="new@example.com"
            />
            {emailForm.formState.errors.newEmail && (
              <p className="text-sm text-destructive">
                {emailForm.formState.errors.newEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailPassword">Confirm Password</Label>
            <Input
              id="emailPassword"
              type="password"
              {...emailForm.register('password')}
              placeholder="Enter your password"
            />
            {emailForm.formState.errors.password && (
              <p className="text-sm text-destructive">
                {emailForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={loadingEmail} className="gradient-primary">
            {loadingEmail && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update Email
          </Button>
        </form>
      </div>

      {/* Change Password */}
      <div className="glassmorphism rounded-2xl p-6 border border-border/50">
        <h3 className="text-xl font-display font-bold mb-4">Change Password</h3>
        <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                {...passwordForm.register('currentPassword')}
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-sm text-destructive">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                {...passwordForm.register('newPassword')}
                placeholder="Enter new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {passwordForm.formState.errors.newPassword && (
              <p className="text-sm text-destructive">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                {...passwordForm.register('confirmPassword')}
                placeholder="Confirm new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={loadingPassword} className="gradient-primary">
            {loadingPassword && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Change Password
          </Button>
        </form>
      </div>

      {/* Delete Account */}
      <div className="glassmorphism rounded-2xl p-6 border border-destructive/50 bg-destructive/5">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xl font-display font-bold text-destructive mb-1">
              Delete Account
            </h3>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be
              undone.
            </p>
          </div>
        </div>

        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
        >
          Delete Account
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and all associated data. This action cannot
              be undone. Are you absolutely sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
