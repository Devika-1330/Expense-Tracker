import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const requiredFirebaseConfig = [
  {
    envName: 'NEXT_PUBLIC_FIREBASE_API_KEY',
    value: firebaseConfig.apiKey,
  },
  {
    envName: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    value: firebaseConfig.authDomain,
  },
  {
    envName: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    value: firebaseConfig.projectId,
  },
  {
    envName: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    value: firebaseConfig.storageBucket,
  },
  {
    envName: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    value: firebaseConfig.messagingSenderId,
  },
  {
    envName: 'NEXT_PUBLIC_FIREBASE_APP_ID',
    value: firebaseConfig.appId,
  },
] as const;

let appInstance: FirebaseApp | null = null;

function getMissingFirebaseVars() {
  return requiredFirebaseConfig
    .filter((entry) => !entry.value || entry.value.trim().length === 0)
    .map((entry) => entry.envName);
}

export function getFirebaseApp(): FirebaseApp {
  if (appInstance) return appInstance;

  const missing = getMissingFirebaseVars();
  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase environment variables: ${missing.join(', ')}. Add them to .env.local.`
    );
  }

  appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  return appInstance;
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getFirestoreDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

export default getFirebaseApp;
