import { db, doc, updateDoc } from "../firebase-init.js";
import { getCurrentUser } from "./get-user.js";
import { getUserDetails } from "./getUserDetails.js";

document.addEventListener("DOMContentLoaded", async () => {
  const editBtn = document.getElementById("edit-profile");
  const modal = document.getElementById("editProfileModal");
  const closeBtn = document.getElementById("closeEditModal");
  const form = document.getElementById("editProfileForm");

  const user = await getUserDetails();
  const userAuth = getCurrentUser();

  // Open modal
  editBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    if (user) {
      document.getElementById("editUsername").value = user.userName || "";
      document.getElementById("editBio").value = user.bio || "";
      document.getElementById("editGender").value = user.gender || "";
    }
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Submit form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newUsername = document.getElementById("editUsername").value.trim();
    const newBio = document.getElementById("editBio").value.trim();
    const newGender = document.getElementById("editGender").value;

    if (!userAuth?.uid) return alert("User not logged in");

    try {
      await updateDoc(doc(db, "users", userAuth.uid), {
        userName: newUsername,
        bio: newBio,
        gender: newGender,
      });

      // Optionally update on page without reload
      document.getElementById("username").textContent = `@${newUsername}`;
      document.getElementById("userBio").textContent = newBio;

      alert("Profile updated!");
      modal.style.display = "none";
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Something went wrong while updating profile.");
    }
  });
});
