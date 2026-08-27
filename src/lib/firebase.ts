import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';
import { env } from './env';

let app: FirebaseApp | undefined;
let database: Database | undefined;

/** 최초 호출 시에만 초기화하고 이후에는 같은 인스턴스를 돌려준다. */
export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    const config = env();
    app = initializeApp({
      apiKey: config.VITE_FIREBASE_API_KEY,
      authDomain: config.VITE_FIREBASE_AUTH_DOMAIN,
      databaseURL: config.VITE_FIREBASE_DATABASE_URL,
      projectId: config.VITE_FIREBASE_PROJECT_ID,
      storageBucket: config.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: config.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: config.VITE_FIREBASE_APP_ID,
    });
  }
  return app;
}

export function getDb(): Database {
  database ??= getDatabase(getFirebaseApp());
  return database;
}
