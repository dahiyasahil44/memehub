import { getCurrentUser } from "./get-user.js";
import {
  auth,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
  signOut,
} from "../firebase-init.js";
document.addEventListener("DOMContentLoaded", () => {
  const user = getCurrentUser();
  document
    .getElementById("updatePasswordForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const oldPassword = document.getElementById("oldPassword").value.trim();
      const newPassword = document.getElementById("newPassword").value.trim();
      const confirmPassword = document
        .getElementById("confirmPassword")
        .value.trim();

      if (newPassword !== confirmPassword) {
        alert("New passwords do not match.");
        return;
      }

      const user = auth.currentUser;

      if (!user || !user.email) {
        console.error("No authenticated user found.");
        return;
      }

      try {
        console.log("Reauthenticating...");
        const credential = EmailAuthProvider.credential(
          user.email,
          oldPassword
        );
        await reauthenticateWithCredential(user, credential);

        console.log("Updating password...");
        await updatePassword(user, newPassword);

        alert("Password updated successfully. Logging you out for security.");

        await signOut(auth);
        window.location.href = "/login.html"; // Change if your login page is elsewhere
      } catch (error) {
        console.error("Error updating password:", error.message);
        alert("Failed to update password: " + error.message);
      }
    });

  // On load, apply saved theme
  window.addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
      darkToggle.checked = true;
    }
  });
  const passwordModal = document.getElementById("passwordModal");
  const closePasswordModal = document.getElementById("closePasswordModal");

  // Example trigger button (you should already have one)
  document.querySelector("#danger-btn").addEventListener("click", () => {
    passwordModal.style.display = "block";
  });

  closePasswordModal.onclick = function () {
    passwordModal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == passwordModal) {
      passwordModal.style.display = "none";
    }
  };
});
