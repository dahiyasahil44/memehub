import { auth, db } from '/js/firebase-init.js';
import { uploadToCloudinary } from '/js/m-js/cloudinary.js';
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

let imageEditor;

document.addEventListener('DOMContentLoaded', () => {
  const imageEditorContainer = document.getElementById('tui-image-editor-container');
  const memeImageInput = document.getElementById('memeImage');
  const aiSuggestions = document.getElementById("aiSuggestions");
  const hashtagsInput = document.getElementById("hashtags");

  // Initialize Toast UI Image Editor
  imageEditor = new tui.ImageEditor(imageEditorContainer, {
    includeUI: {
      loadImage: {
        path: '',
        name: 'New Meme'
      },
      menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'filter'],
      initMenu: '',
      uiSize: {
        width: '100%',
        height: '500px'
      },
      menuBarPosition: 'bottom'
    },
    cssMaxWidth: 700,
    cssMaxHeight: 500,
    selectionStyle: {
      cornerSize: 20,
      rotatingPointOffset: 70
    }
  });

  // Image Upload
  memeImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        imageEditor.loadImageFromURL(reader.result, file.name)
          .then(() => imageEditor.clearUndoStack())
          .catch(console.error);
      };
      reader.readAsDataURL(file);
    }
  });

  // Generate AI Caption (mock)
  document.getElementById("generateCaption").addEventListener("click", () => {
    aiSuggestions.innerText = "🤖 Suggested Caption: 'When the code compiles on the first try...'";
  });

  // Save Meme
  document.getElementById("saveDraft").addEventListener("click", () => {
    saveMeme("draft");
  });

  document.getElementById("publishMeme").addEventListener("click", () => {
    saveMeme("published");
  });

  async function saveMeme(status) {
    const memeData = {
      caption: aiSuggestions.innerText || "",
      hashtags: hashtagsInput.value || "",
      userId: auth.currentUser?.uid || "anonymous",
      createdAt: Timestamp.now(),
      status: status,
      imageUrl: null,
    };

    try {
      const dataUrl = imageEditor.toDataURL();
      const blob = await (await fetch(dataUrl)).blob();
      memeData.imageUrl = await uploadToCloudinary(blob);

      await addDoc(collection(db, "memes"), memeData);
      alert(`Meme ${status === 'draft' ? 'saved as draft' : 'published'}!`);
      window.location.href = "/dashboard.html";
    } catch (error) {
      console.error("Error saving meme:", error);
      alert("Failed to save meme.");
    }
  }
});
