import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc ,updateDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



export { app, auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, doc, setDoc, getDoc , updateDoc };
