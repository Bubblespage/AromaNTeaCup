// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVF7MYjyYh1vPy0OMT9LHq0mQiW1BsMC4",
  authDomain: "aromanteacup-ph.firebaseapp.com",
  projectId: "aromanteacup-ph",
  storageBucket: "aromanteacup-ph.firebasestorage.app",
  messagingSenderId: "473146819052",
  appId: "1:473146819052:web:da4fb6b36e9ef134e700c9",
  measurementId: "G-M1VF1YRSNP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
