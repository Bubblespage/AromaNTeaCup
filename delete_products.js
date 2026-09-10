import { initializeApp } from "firebase/app";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVF7MYjyYh1vPy0OMT9LHq0mQiW1BsMC4",
  authDomain: "aromanteacup-ph.firebaseapp.com",
  projectId: "aromanteacup-ph",
  storageBucket: "aromanteacup-ph.firebasestorage.app",
  messagingSenderId: "473146819052",
  appId: "1:473146819052:web:da4fb6b36e9ef134e700c9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  await deleteDoc(doc(db, "products", "26"));
  await deleteDoc(doc(db, "products", "29"));
  console.log("Deleted products 26 and 29.");
}

run().catch(console.error);
