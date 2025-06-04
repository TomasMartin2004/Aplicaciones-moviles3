// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage"; // Import Storage

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiMQ7Zr5ZNJS0q9Hk1xI26uGmosG4UKN0",
  authDomain: "tp03-350e1.firebaseapp.com",
  projectId: "tp03-350e1",
  storageBucket: "tp03-350e1.appspot.com",
  messagingSenderId: "1050704063832",
  appId: "1:1050704063832:web:a1d22e1de90306aa97092d",
  measurementId: "G-S958DPP0XV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize and export Firestore
export const storage = getStorage(app); // Initialize and export Storage

export default app;