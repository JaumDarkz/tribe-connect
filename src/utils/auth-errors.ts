/**
 * Authentication Error Handling Utility
 * Maps Firebase error codes to user-friendly messages
 * Prevents exposure of sensitive error details
 */

import { FirebaseError } from 'firebase/app';
import { AuthErrorCode } from '@/types/auth';

/**
 * Maps Firebase auth error codes to user-friendly messages
 */
const errorMessages: Record<string, string> = {
  // Email/Password errors
  [AuthErrorCode.EMAIL_ALREADY_IN_USE]:
    'An account with this email already exists. Please sign in or use a different email.',
  [AuthErrorCode.INVALID_EMAIL]:
    'Invalid email address. Please check and try again.',
  [AuthErrorCode.WEAK_PASSWORD]:
    'Password is too weak. Please use at least 8 characters with a mix of letters, numbers, and symbols.',
  [AuthErrorCode.WRONG_PASSWORD]:
    'Incorrect password. Please try again or reset your password.',
  [AuthErrorCode.USER_NOT_FOUND]:
    'No account found with this email. Please sign up first.',
  [AuthErrorCode.USER_DISABLED]:
    'This account has been disabled. Please contact support for assistance.',

  // Operation errors
  [AuthErrorCode.OPERATION_NOT_ALLOWED]:
    'This sign-in method is not enabled. Please contact support.',
  [AuthErrorCode.TOO_MANY_REQUESTS]:
    'Too many failed attempts. Please wait a few minutes before trying again.',

  // Network errors
  [AuthErrorCode.NETWORK_REQUEST_FAILED]:
    'Network error. Please check your internet connection and try again.',

  // OAuth errors
  [AuthErrorCode.POPUP_CLOSED_BY_USER]:
    'Sign-in cancelled. Please try again if you want to continue.',

  // Email link errors
  [AuthErrorCode.EXPIRED_ACTION_CODE]:
    'This sign-in link has expired. Please request a new one.',
  [AuthErrorCode.INVALID_ACTION_CODE]:
    'Invalid or already used sign-in link. Please request a new one.',
};

/**
 * Converts a Firebase error to a user-friendly error message
 * @param error - The error to convert
 * @returns User-friendly error message
 */
export const getAuthErrorMessage = (error: unknown): string => {
  // Handle FirebaseError
  if (error instanceof FirebaseError) {
    const message = errorMessages[error.code];
    if (message) {
      return message;
    }

    // Log unknown Firebase errors in development
    if (import.meta.env.DEV) {
      console.error('Unknown Firebase error:', error.code, error.message);
    }

    return 'An authentication error occurred. Please try again.';
  }

  // Handle standard Error
  if (error instanceof Error) {
    // Don't expose raw error messages to users for security
    if (import.meta.env.DEV) {
      console.error('Auth error:', error.message);
    }
    return 'An unexpected error occurred. Please try again.';
  }

  // Handle unknown error types
  if (import.meta.env.DEV) {
    console.error('Unknown error type:', error);
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Checks if an error is a Firebase auth error
 */
export const isFirebaseError = (error: unknown): error is FirebaseError => {
  return error instanceof FirebaseError;
};

/**
 * Checks if an error is a specific Firebase auth error code
 */
export const isAuthErrorCode = (
  error: unknown,
  code: AuthErrorCode
): boolean => {
  return isFirebaseError(error) && error.code === code;
};

/**
 * Helper to determine if error requires user action
 */
export const requiresUserAction = (error: unknown): boolean => {
  if (!isFirebaseError(error)) return false;

  const actionRequiredCodes = [
    AuthErrorCode.WEAK_PASSWORD,
    AuthErrorCode.INVALID_EMAIL,
    AuthErrorCode.WRONG_PASSWORD,
    AuthErrorCode.USER_NOT_FOUND,
    AuthErrorCode.EMAIL_ALREADY_IN_USE,
  ];

  return actionRequiredCodes.includes(error.code as AuthErrorCode);
};

/**
 * Helper to determine if error is temporary (user should retry)
 */
export const isTemporaryError = (error: unknown): boolean => {
  if (!isFirebaseError(error)) return false;

  const temporaryErrorCodes = [
    AuthErrorCode.NETWORK_REQUEST_FAILED,
    AuthErrorCode.TOO_MANY_REQUESTS,
  ];

  return temporaryErrorCodes.includes(error.code as AuthErrorCode);
};
