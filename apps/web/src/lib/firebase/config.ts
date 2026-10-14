/**
 * Firebase web app config. These values are public identifiers (they ship
 * to every browser); access is enforced by Firebase Auth + server checks.
 * Env vars override the defaults for other environments.
 */
export const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyAnI6eHyfSpg_E44caxHo0Fj-xRL6cfs_o",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "barristrly-77608.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "barristrly-77608",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "barristrly-77608.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "815281367223",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:815281367223:web:e1d91a729c5ae04a3bc532",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-2MKD4MYLXK",
};
