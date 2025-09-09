import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env['NEXT_PUBLIC_FIREBASE_PROJECT_ID'],
    clientEmail: process.env['FIREBASE_CLIENT_EMAIL'],
    privateKey: process.env['FIREBASE_PRIVATE_KEY']?.replace(/\\n/g, '\n'),
  }),
};

function createFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }
  
  return initializeApp(firebaseAdminConfig);
}

const adminApp = createFirebaseAdminApp();
export const auth = getAuth(adminApp);