// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "studio-6502446661-92fd4",
  "appId": "1:31962575903:web:093e019314f25b07f7112a",
  "storageBucket": "studio-6502446661-92fd4.firebasestorage.app",
  "apiKey": "AIzaSyCnWu0fxbXaKbhkLOhtj97tLyhjJMa5AFY",
  "authDomain": "studio-6502446661-92fd4.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "31962575903"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
