import { uploadToCloudinary } from "./cloudinary.js";
import { getCurrentUser } from "./get-user.js";
import { db, doc, updateDoc } from "../firebase-init.js";
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-database.js";


document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tui-image-editor-container");
  let imageEditor = null;

  const user = getCurrentUser(); // must return current authenticated user object

  document.getElementById("upload").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      if (imageEditor) {
        imageEditor.destroy();
      }
      imageEditor = new tui.ImageEditor(container, {
        includeUI: {
          loadImage: {
            path: e.target.result,
            name: file.name,
          },
          theme: {}, // Default theme
          menu: [
            "crop",
            "flip",
            "rotate",
            "draw",
            "shape",
            "icon",
            "text",
            "filter",
          ],
          initMenu: "filter",
          uiSize: {
            width: "900px",
            height: "600px",
          },
          menuBarPosition: "bottom",
        },
        cssMaxWidth: 700,
        cssMaxHeight: 500,
        selectionStyle: {
          cornerSize: 20,
          rotatingPointOffset: 70,
        },
      });
    };

    reader.readAsDataURL(file);
  });

  document
    .getElementById("post-btn")
    .addEventListener("click", async function (e) {
      e.preventDefault();
      const title = document.getElementById("meme-title").value;
      const tags = document.getElementById("meme-tags").value;
      const status = document.getElementById("post-status").value;

      if (!imageEditor) {
        alert("Please upload and edit an image first.");
        return;
      }
      if (!title || !status) {
        alert("Title and status is required  ");
        return;
      }
      // Compress image
      const dataUrl = imageEditor.toDataURL({
        format: "jpeg",
        quality: 0.7,
      });

      const blob = await (await fetch(dataUrl)).blob();

      try {
        document.getElementById("post-btn").innerHTML = "Loading...";

        const imageUrl = await uploadToCloudinary(blob);

        const memeData = {
          UID: user.uid,
          username: user.userName || 'Anonymous',
          userPhoto: user.avatar || 'https://t4.ftcdn.net/jpg/12/44/29/93/240_F_1244299369_Jixobpdd2rDzg1B6DZw4tRmSa02OY0Qh.jpg',
          title: title,
          tags: tags.split(",").map(tag => tag.trim()),
          // category: category || 'general',
          status: status,
          image: imageUrl,
          upvoteCount: 100,
          downvoteCount: 10,
          views: 500,
          comments: [],
          isFlagged: false,
          reportCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isFeatured: false,
          isTrending: false
        };
        // console.log(imageUrl);
        // console.log(memeData);

        // Post to Realtime DB
        const response = await fetch(
          "https://memehub-4e730-default-rtdb.asia-southeast1.firebasedatabase.app/memes.json",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(memeData),
          }
        );
        console.log(response);

        // Optionally: update user's total meme count

        await updateDoc(doc(db, "users", user.uid), {
          totalMemes: (user.totalMemes || 0) + 1,
        });

        alert("Meme created and uploaded successfully!");
        document.getElementById("meme-title").value = "";
        document.getElementById("meme-tags").value = " ";
        document.getElementById("post-status").value = "";
      } catch (err) {
        console.error("Image upload or database post failed", err);
        alert("Something went wrong. Please try again.");
      } finally {
        document.getElementById("post-btn").innerHTML = "Post";
      }
    });
});
