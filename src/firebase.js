import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7Q-CoqQANa1jU-p4ChsPPp51acRFIGVI",
  authDomain: "zenith-file-manager.firebaseapp.com",
  projectId: "zenith-file-manager",
  storageBucket: "zenith-file-manager.firebasestorage.app",
  messagingSenderId: "532934718517",
  appId: "1:532934718517:web:74c1706be889946de02d7c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);