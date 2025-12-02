/**
 * Firebase Initialization
 * Initializes Firebase app and exports auth instance
 * Uses Firebase v9+ modular SDK for better tree-shaking and smaller bundle size
 */

import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  type Auth,
  setPersistence,
  browserLocalPersistence,
  connectAuthEmulator,
} from 'firebase/auth';
import { getFirebaseConfig } from './firebase-config';

// Initialize Firebase app
let app: FirebaseApp;
let auth: Auth;

try {
  const firebaseConfig = getFirebaseConfig();
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  // Set authentication persistence to LOCAL (persists across browser sessions)
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

  // Connect to Firebase Auth Emulator in development if configured
  if (
    import.meta.env.DEV &&
    import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL
  ) {
    const emulatorUrl = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL;
    console.log(`Connecting to Firebase Auth Emulator at ${emulatorUrl}`);
    connectAuthEmulator(auth, emulatorUrl);
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  throw error;
}

export { app, auth };
export default app;
