import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from console
const firebaseConfig = {
  apiKey: "AIzaSyCSxxqlg73RIPT-VxxexPjWstKDnPwbB4M",
  authDomain: "personal-expense-fyp.firebaseapp.com",
  projectId: "personal-expense-fyp",
  storageBucket: "personal-expense-fyp.firebasestorage.app",
  messagingSenderId: "201508674196",
  appId: "1:201508674196:web:d897f44f625d1221717281",
  measurementId: "G-KDJH9VP21L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
