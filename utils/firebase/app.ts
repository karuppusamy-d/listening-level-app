import {
  credential,
  firestore as initFrestore,
  auth as initAuth,
  apps,
} from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

if (!apps.length) {
  initializeApp({
    credential: credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const firestore = initFrestore();
const auth = initAuth();

export { auth, firestore };
