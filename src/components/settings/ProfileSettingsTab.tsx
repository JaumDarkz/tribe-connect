/**
 * Profile Settings Tab
 * Manage public profile: avatar, display name, and bio
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// ============================================================================
// Validation Schema
// ============================================================================

const profileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  photoURL: z.string().url('Must be a valid URL').or(z.literal('')),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// ============================================================================
// Component
// ============================================================================

export const ProfileSettingsTab = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [bioLength, setBioLength] = useState(0);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      photoURL: user?.photoURL || '',
      bio: '',
    },
  });

  // Watch bio field for character count
  const bioValue = form.watch('bio');
  useEffect(() => {
    setBioLength(bioValue?.length || 0);
  }, [bioValue]);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // ========================================================================
  // Handlers
  // ========================================================================

  const handleUpdateProfile = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      setLoading(true);
      await updateUserProfile(data.displayName, data.photoURL || undefined);

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update profile.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-6">
        {/* Avatar Section */}
        <div className="glassmorphism rounded-2xl p-6 border border-border/50">
          <h3 className="text-xl font-display font-bold mb-4">Profile Picture</h3>

          <div className="flex items-start gap-6">
            {/* Avatar Preview */}
            <Avatar className="w-24 h-24 border-4 border-primary/50">
              <AvatarImage src={form.watch('photoURL') || user?.photoURL || undefined} />
              <AvatarFallback className="gradient-primary text-white font-bold text-2xl">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>

            {/* Avatar URL Input */}
            <div className="flex-1 space-y-2">
              <Label htmlFor="photoURL">Avatar URL</Label>
              <Input
                id="photoURL"
                type="url"
                {...form.register('photoURL')}
                placeholder="https://example.com/avatar.jpg"
              />
              {form.formState.errors.photoURL && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.photoURL.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter a URL to an image for your profile picture
              </p>
            </div>
          </div>
        </div>

        {/* Display Name Section */}
        <div className="glassmorphism rounded-2xl p-6 border border-border/50">
          <h3 className="text-xl font-display font-bold mb-4">Display Name</h3>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              {...form.register('displayName')}
              placeholder="Your display name"
            />
            {form.formState.errors.displayName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.displayName.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              This is your public display name. It will be visible to other users.
            </p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="glassmorphism rounded-2xl p-6 border border-border/50">
          <h3 className="text-xl font-display font-bold mb-4">Bio</h3>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...form.register('bio')}
              placeholder="Tell us about yourself..."
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Write a short bio about yourself (optional)
              </p>
              <span className="text-xs text-muted-foreground">
                {bioLength}/500
              </span>
            </div>
            {form.formState.errors.bio && (
              <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
            )}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/30">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Bio field is currently for display purposes only. Backend
              storage for bio content will be implemented in a future update.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading || !form.formState.isDirty}
            className="gradient-primary"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
};
