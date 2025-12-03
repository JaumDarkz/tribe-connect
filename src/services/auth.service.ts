/**
 * Authentication Service Layer
 * Handles all Firebase authentication operations
 * Implements best practices for security and performance
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  linkWithPopup,
  unlink,
  sendSignInLinkToEmail as firebaseSendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink as firebaseSignInWithEmailLink,
  sendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification,
  updateProfile,
  signOut as firebaseSignOut,
  type UserCredential,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User } from '@/types/auth';

/**
 * Email Link Authentication Configuration
 */
const EMAIL_LINK_CONFIG = {
  // URL to redirect to after email link is clicked
  url: window.location.origin + '/auth/email-link',
  // This must be true for email link authentication
  handleCodeInApp: true,
};

/**
 * Local storage key for email in email link flow
 */
const EMAIL_FOR_SIGN_IN_KEY = 'emailForSignIn';

// ============================================================================
// EMAIL/PASSWORD AUTHENTICATION
// ============================================================================

/**
 * Sign up a new user with email and password
 * Sends email verification automatically
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<User> => {
  const userCredential: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user as User;

  // Update profile with display name if provided
  if (displayName) {
    await updateProfile(user, { displayName });
  }

  // Send email verification
  await firebaseSendEmailVerification(user);

  return user;
};

/**
 * Sign in an existing user with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential: UserCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user as User;
};

// ============================================================================
// GOOGLE OAUTH AUTHENTICATION
// ============================================================================

/**
 * Sign in with Google OAuth using popup
 * Uses popup instead of redirect for better UX
 */
export const signInWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();

  // Request additional scopes if needed
  provider.addScope('profile');
  provider.addScope('email');

  // Prompt user to select account every time (optional)
  provider.setCustomParameters({
    prompt: 'select_account',
  });

  const userCredential: UserCredential = await signInWithPopup(auth, provider);

  return userCredential.user as User;
};

// ============================================================================
// DISCORD OAUTH AUTHENTICATION
// ============================================================================

/**
 * Sign in with Discord OAuth using popup
 */
export const signInWithDiscord = async (): Promise<User> => {
  const provider = new OAuthProvider('oidc.discord');
  provider.addScope('identify');
  provider.addScope('email');

  const userCredential: UserCredential = await signInWithPopup(auth, provider);
  return userCredential.user as User;
};

/**
 * Link Discord account to existing user
 */
export const linkDiscordAccount = async (): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('No user is currently signed in');
  }

  const provider = new OAuthProvider('oidc.discord');
  provider.addScope('identify');
  provider.addScope('email');

  await linkWithPopup(auth.currentUser, provider);
};

/**
 * Unlink Discord account from user
 */
export const unlinkDiscordAccount = async (): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('No user is currently signed in');
  }

  await unlink(auth.currentUser, 'oidc.discord');
};

// ============================================================================
// TWITTER OAUTH AUTHENTICATION
// ============================================================================

/**
 * Sign in with Twitter OAuth using popup
 */
export const signInWithTwitter = async (): Promise<User> => {
  const provider = new OAuthProvider('twitter.com');

  const userCredential: UserCredential = await signInWithPopup(auth, provider);
  return userCredential.user as User;
};

/**
 * Link Twitter account to existing user
 */
export const linkTwitterAccount = async (): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('No user is currently signed in');
  }

  const provider = new OAuthProvider('twitter.com');
  await linkWithPopup(auth.currentUser, provider);
};

/**
 * Unlink Twitter account from user
 */
export const unlinkTwitterAccount = async (): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('No user is currently signed in');
  }

  await unlink(auth.currentUser, 'twitter.com');
};

// ============================================================================
// EMAIL LINK (PASSWORDLESS) AUTHENTICATION
// ============================================================================

/**
 * Send sign-in link to email (passwordless authentication)
 * Stores email in localStorage for completion
 */
export const sendSignInLinkToEmail = async (email: string): Promise<void> => {
  await firebaseSendSignInLinkToEmail(auth, email, EMAIL_LINK_CONFIG);

  // Store email in localStorage to complete sign-in
  window.localStorage.setItem(EMAIL_FOR_SIGN_IN_KEY, email);
};

/**
 * Complete sign-in with email link
 * Call this on the redirect page after user clicks email link
 */
export const signInWithEmailLink = async (
  email: string,
  emailLink: string
): Promise<User> => {
  // Verify the link is a valid sign-in link
  if (!isSignInWithEmailLink(auth, emailLink)) {
    throw new Error('Invalid sign-in link');
  }

  const userCredential: UserCredential = await firebaseSignInWithEmailLink(
    auth,
    email,
    emailLink
  );

  // Clear email from localStorage after successful sign-in
  window.localStorage.removeItem(EMAIL_FOR_SIGN_IN_KEY);

  return userCredential.user as User;
};

/**
 * Check if current URL is a sign-in link
 */
export const isSignInLink = (url: string): boolean => {
  return isSignInWithEmailLink(auth, url);
};

/**
 * Get stored email for email link sign-in
 * Returns null if no email is stored
 */
export const getStoredEmailForSignIn = (): string | null => {
  return window.localStorage.getItem(EMAIL_FOR_SIGN_IN_KEY);
};

// ============================================================================
// PASSWORD RESET
// ============================================================================

/**
 * Send password reset email to user
 */
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

// ============================================================================
// EMAIL VERIFICATION
// ============================================================================

/**
 * Send email verification to current user
 */
export const sendEmailVerification = async (): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('No user is currently signed in');
  }

  await firebaseSendEmailVerification(auth.currentUser);
};

// ============================================================================
// USER PROFILE MANAGEMENT
// ============================================================================

/**
 * Update user profile (display name and/or photo URL)
 */
export const updateUserProfile = async (
  displayName?: string,
  photoURL?: string
): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('No user is currently signed in');
  }

  const updates: { displayName?: string; photoURL?: string } = {};

  if (displayName !== undefined) {
    updates.displayName = displayName;
  }

  if (photoURL !== undefined) {
    updates.photoURL = photoURL;
  }

  await updateProfile(auth.currentUser, updates);
};

// ============================================================================
// SIGN OUT
// ============================================================================

/**
 * Sign out the current user
 * Clears all auth state and local storage
 */
export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);

  // Clear any stored auth-related data
  window.localStorage.removeItem(EMAIL_FOR_SIGN_IN_KEY);
};

// ============================================================================
// USER STATE HELPERS
// ============================================================================

/**
 * Get current user
 * Returns null if no user is signed in
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser as User | null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};

/**
 * Check if current user's email is verified
 */
export const isEmailVerified = (): boolean => {
  return auth.currentUser?.emailVerified ?? false;
};
