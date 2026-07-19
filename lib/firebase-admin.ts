import "server-only";

import { initializeApp, getApps, cert, AppOptions } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";

function getAdminApp() {
  if (getApps().length === 0) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (clientEmail && privateKey) {
      const options: AppOptions = {
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      };
      return initializeApp(options);
    }

    return initializeApp({ projectId });
  }
  return getApps()[0];
}

function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

const adminApp = getAdminApp();
const adminAuth = getAdminAuth();

export { adminApp, adminAuth };
