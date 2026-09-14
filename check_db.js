import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVF7MYjyYh1vPy0OMT9LHq0mQiW1BsMC4",
  authDomain: "aromanteacup-ph.firebaseapp.com",
  projectId: "aromanteacup-ph",
  storageBucket: "aromanteacup-ph.firebasestorage.app",
  messagingSenderId: "473146819052",
  appId: "1:473146819052:web:da4fb6b36e9ef134e700c9",
  measurementId: "G-M1VF1YRSNP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const snapshot = await getDocs(collection(db, "products"));
  const products = snapshot.docs.map(doc => doc.data());
  const iced = products.filter(p => p.category === 'Iced Coffee').sort((a, b) => a.id - b.id);
  for (const p of iced) {
    console.log(`ID: ${p.id}, Name: ${p.name}, Image: ${p.image}`);
  }
  process.exit(0);
}

run().catch(console.error);
