import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Konfiguracja Firebase - MUSISZ UZUPEŁNIĆ SWOIMI DANYMI z Firebase Console
// 1. Idź na https://console.firebase.google.com/
// 2. Utwórz nowy projekt lub wybierz istniejący
// 3. Przejdź do Project Settings > General > Your apps
// 4. Dodaj aplikację Web i skopiuj konfigurację tutaj
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDEMO_KEY_REPLACE_ME",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Inicjalizacja Firebase (tylko raz)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Eksport usług Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
