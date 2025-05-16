import { auth, onAuthStateChanged } from "../firebase-init.js";


export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("meme-hub-user"));
}
