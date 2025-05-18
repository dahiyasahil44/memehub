import { uploadToCloudinary } from "./cloudinary.js";
import { auth, db, doc, updateDoc } from "../firebase-init.js";
import { getCurrentUser } from "./get-user.js";
import { getUserDetails } from "./getUserDetails.js";

// Cloudinary config
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dehamh3j6/image/upload";
const UPLOAD_PRESET = "memory-lane";

document.addEventListener("DOMContentLoaded", async () => {
  const user = await getUserDetails();
  const userAuth = getCurrentUser();
  document.getElementById("userAvatar").src =
    "https://t4.ftcdn.net/jpg/12/44/29/93/240_F_1244299369_Jixobpdd2rDzg1B6DZw4tRmSa02OY0Qh.jpg";
   
    if (user) {
      const dbURL = "https://memehub-4e730-default-rtdb.asia-southeast1.firebasedatabase.app";
    
      fetch(`${dbURL}/memes.json`)
        .then(res => res.json())
        .then(memes => {
          // console.log(user)
          // console.log(userMemes)
          const userMemes = Object.values(memes || {}).filter(meme => meme.UID === currentUser.uid);
          // console.log(userMemes)
          const totalUpvotes = userMemes.reduce((sum, meme) => sum + (meme.upvoteCount || 0), 0);
    
          document.getElementById("username").textContent = `@${
            user.userName || user.email.split("@")[0]
          }`;
          document.getElementById("userBio").textContent =
            user.bio || "Just here to make you laugh";
          document.getElementById("userAvatar").src =
            user.avatar ||
            "https://t4.ftcdn.net/jpg/12/44/29/93/240_F_1244299369_Jixobpdd2rDzg1B6DZw4tRmSa02OY0Qh.jpg";
          document.getElementById("upvotes").textContent = totalUpvotes;
          document.getElementById("memesCount").textContent = userMemes.length;
          // document.getElementById("points").textContent = user.points || 1590;
          // document.getElementById("badges").textContent =
          //   user.badges?.join(", ") || "First Viral Post, 10k Views Club";
        })
        .catch(err => {
          console.error("Failed to fetch memes for user profile:", err);
        });
    }
    
    

  const avatarInput = document.getElementById("avatarInput");
  const userAvatar = document.getElementById("userAvatar");

  avatarInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file || !userAuth?.uid) return;
    const loader = document.getElementById("avatarLoader");
    loader.style.display = "block";

    try {
      // Show loading placeholder
      userAvatar.src =
        "https://t4.ftcdn.net/jpg/12/44/29/93/240_F_1244299369_Jixobpdd2rDzg1B6DZw4tRmSa02OY0Qh.jpg";

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file);

      // Update avatar on UI
      userAvatar.src = imageUrl;

      // Save to Firestore
      await updateDoc(doc(db, "users", userAuth.uid), {
        avatar: imageUrl,
      });

      console.log("Avatar updated:", imageUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image.");
      userAvatar.src =
        user.avatar ||
        "https://t4.ftcdn.net/jpg/12/44/29/93/240_F_1244299369_Jixobpdd2rDzg1B6DZw4tRmSa02OY0Qh.jpg";
    } finally {
      document.getElementById("avatarLoader").style.display = 'none'
    }
  });

  const memeCards = document.querySelectorAll(".meme-card");
  const modal = document.getElementById("memeModal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const closeModalBtn = document.querySelector(".close");
  memeCards.forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.getAttribute("data-title");
      const image = card.getAttribute("data-image");
      modalImg.src = image;
      modalTitle.textContent = title;
      modal.style.display = "flex";
    });
  });
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
  // Optional: Close modal on outside click
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});
