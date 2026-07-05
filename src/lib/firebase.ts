/**
 * Firebase Configuration Module
 * 
 * Initializes Firebase and exports analytics for tracking user behavior.
 * 
 * Features:
 * - Firebase Analytics for tracking page views and user interactions
 * - SSR-safe initialization (only runs in browser)
 * 
 * Environment Variables Required:
 * - VITE_FIREBASE_API_KEY
 * - VITE_FIREBASE_MESSAGING_SENDER_ID
 * - VITE_FIREBASE_APP_ID
 * - VITE_FIREBASE_MEASUREMENT_ID
 * 
 * Usage:
 * import { analytics } from '@/lib/firebase';
 * import { logEvent } from 'firebase/analytics';
 * logEvent(analytics, 'event_name', { param: 'value' });
 */

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "smartdaily-b9bb5.firebaseapp.com",
  projectId: "smartdaily-b9bb5",
  storageBucket: "smartdaily-b9bb5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser (not during SSR)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
