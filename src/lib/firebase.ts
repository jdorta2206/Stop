import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration - uses environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemo-Replace-With-Your-Real-Key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "stop-game-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "stop-game-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "stop-game-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:demo-app-id"
};

// Check if Firebase is properly configured
const isFirebaseConfigured = firebaseConfig.apiKey !== "AIzaSyDemo-Replace-With-Your-Real-Key";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export { isFirebaseConfigured };
export default app;