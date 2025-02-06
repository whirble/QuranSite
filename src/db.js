// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDD0gscMahM2MXErIKIYT45bZXfVi6AkR4",
  authDomain: "quran-website-ab7ef.firebaseapp.com",
  projectId: "quran-website-ab7ef",
  storageBucket: "quran-website-ab7ef.firebasestorage.app",
  messagingSenderId: "382974773590",
  appId: "1:382974773590:web:fbfbf9776f1a7d7a6b2ef7",
  measurementId: "G-Y3X8V9TR4W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export the db instance and Firestore functions
export { db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy };