import { loadComponents } from "./load-components.js";
import { loadSliders } from "./slider.js";
import {
  auth,
  onAuthStateChanged,
  signOut,
  getDoc,
  doc,
  db,
} from "./firebase-init.js";

loadComponents();
loadSliders();

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("user-sidebar").classList.remove("hidden");
    document.getElementById("signupBtn").classList.add("hidden");
    document.getElementById("loginBtn").classList.add("hidden");
  } else {
    document.getElementById("user-sidebar").classList.add("hidden");
    document.getElementById("signupBtn").classList.remove("hidden");
    document.getElementById("loginBtn").classList.remove("hidden");
  }
});

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("meme-hub-user");
        alert("Logout successfull!!");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
window.logout = logout;

function setupFilterListeners() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      // Highlight selected filter
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const type = btn.dataset.filter;
      const filtered = filterMemes(type);

      displayedCount = 0;
      document.getElementById("meme-feed").innerHTML = "";
      allMemesFiltered = filtered;
      displayData();
    });
  });
}
window.setupFilterListeners = setupFilterListeners;

const toggle = document.getElementById("darkModeToggle");

// Check saved preference (optional)
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
  toggle.checked = true;
}

toggle.addEventListener("change", () => {
  if (toggle.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
  }
});
