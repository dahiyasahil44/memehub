import { auth, onAuthStateChanged } from "../firebase-init.js";

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      localStorage.setItem("meme-hub-user", JSON.stringify(user));
      //   console.log(user);
    } else {
      window.location.href = "/login.html";
    }
  });
});

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("meme-hub-user"));
}
