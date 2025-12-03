/**
 * Authentication Type Definitions
 */

import type { User as FirebaseUser } from 'firebase/auth';

/**
 * Extended user type with additional properties
 */
export interface User extends FirebaseUser {
  // You can extend this with custom properties from your backend if needed
}

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Authentication context type
 */
export interface AuthContextType extends AuthState {
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signInWithDiscord: () => Promise<User>;
  linkDiscordAccount: () => Promise<void>;
  unlinkDiscordAccount: () => Promise<void>;
  signInWithTwitter: () => Promise<User>;
  linkTwitterAccount: () => Promise<void>;
  unlinkTwitterAccount: () => Promise<void>;
  sendSignInLinkToEmail: (email: string) => Promise<void>;
  signInWithEmailLink: (email: string, emailLink: string) => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendEmailVerification: () => Promise<void>;
}

/**
 * Authentication error codes
 */
export enum AuthErrorCode {
  EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
  INVALID_EMAIL = 'auth/invalid-email',
  OPERATION_NOT_ALLOWED = 'auth/operation-not-allowed',
  WEAK_PASSWORD = 'auth/weak-password',
  USER_DISABLED = 'auth/user-disabled',
  USER_NOT_FOUND = 'auth/user-not-found',
  WRONG_PASSWORD = 'auth/wrong-password',
  TOO_MANY_REQUESTS = 'auth/too-many-requests',
  POPUP_CLOSED_BY_USER = 'auth/popup-closed-by-user',
  EXPIRED_ACTION_CODE = 'auth/expired-action-code',
  INVALID_ACTION_CODE = 'auth/invalid-action-code',
  NETWORK_REQUEST_FAILED = 'auth/network-request-failed',
}

/**
 * Sign in credentials
 */
export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Sign up credentials
 */
export interface SignUpCredentials {
  email: string;
  password: string;
  displayName?: string;
  acceptTerms: boolean;
}
