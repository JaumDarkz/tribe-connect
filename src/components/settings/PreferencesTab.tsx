/**
 * Preferences Tab
 * Manage user preferences: language, timezone, and date format
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Globe, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// ============================================================================
// Validation Schema
// ============================================================================

const preferencesSchema = z.object({
  language: z.string().min(1, 'Please select a language'),
  timezone: z.string().min(1, 'Please select a timezone'),
  dateFormat: z.string().min(1, 'Please select a date format'),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

// ============================================================================
// Options
// ============================================================================

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'pt', label: 'Português' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' },
];

const TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

const DATE_FORMATS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '12/03/2025' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '03/12/2025' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2025-12-03' },
];

// ============================================================================
// Local Storage Helper
// ============================================================================

const PREFERENCES_KEY = 'user-preferences';

const getStoredPreferences = (): PreferencesFormData | null => {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const setStoredPreferences = (preferences: PreferencesFormData): void => {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
};

// ============================================================================
// Component
// ============================================================================

export const PreferencesTab = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: getStoredPreferences() || {
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
    },
  });

  // ========================================================================
  // Handlers
  // ========================================================================

  const handleSavePreferences = async (data: PreferencesFormData) => {
    try {
      setLoading(true);

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Save to localStorage
      setStoredPreferences(data);

      toast({
        title: 'Preferences saved',
        description: 'Your preferences have been saved successfully.',
      });

      // Reset form dirty state
      form.reset(data);
    } catch (error) {
      toast({
        title: 'Save failed',
        description: 'Failed to save preferences. Please try again.',
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
      <form onSubmit={form.handleSubmit(handleSavePreferences)} className="space-y-6">
        {/* Language Preference */}
        <div className="glassmorphism rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-display font-bold">Language</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Preferred Language</Label>
            <Select
              value={form.watch('language')}
              onValueChange={(value) => form.setValue('language', value, { shouldDirty: true })}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.language && (
              <p className="text-sm text-destructive">
                {form.formState.errors.language.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Select your preferred language for the interface (UI only - full localization coming
              soon)
            </p>
          </div>
        </div>

        {/* Timezone Preference */}
        <div className="glassmorphism rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-display font-bold">Timezone</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={form.watch('timezone')}
              onValueChange={(value) => form.setValue('timezone', value, { shouldDirty: true })}
            >
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select a timezone" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.timezone && (
              <p className="text-sm text-destructive">
                {form.formState.errors.timezone.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Select your timezone for accurate time displays (selection only - timezone conversion
              coming soon)
            </p>
          </div>
        </div>

        {/* Date Format Preference */}
        <div className="glassmorphism rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-display font-bold">Date Format</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <Select
              value={form.watch('dateFormat')}
              onValueChange={(value) => form.setValue('dateFormat', value, { shouldDirty: true })}
            >
              <SelectTrigger id="dateFormat">
                <SelectValue placeholder="Select a date format" />
              </SelectTrigger>
              <SelectContent>
                {DATE_FORMATS.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>{format.label}</span>
                      <span className="text-xs text-muted-foreground">{format.example}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.dateFormat && (
              <p className="text-sm text-destructive">
                {form.formState.errors.dateFormat.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Choose how dates are displayed throughout the application
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
            Save Preferences
          </Button>
        </div>
      </form>

      {/* Additional Info */}
      <div className="glassmorphism rounded-2xl p-6 border border-primary/30 bg-primary/5">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Note about Preferences</h4>
          <p className="text-xs text-muted-foreground">
            These preferences are currently saved locally to your browser. Full internationalization
            support (i18n) and timezone conversion features are planned for a future release.
            Your preferences will sync across devices once backend integration is implemented.
          </p>
        </div>
      </div>
    </div>
  );
};
