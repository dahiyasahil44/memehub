import { auth, db } from '/js/firebase-init.js';
import { uploadToCloudinary } from '/js/m-js/cloudinary.js';
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

const memeImageInput = document.getElementById("memeImage");
const templateSelector = document.getElementById("templateSelector");
const topTextInput = document.getElementById("topText");
const bottomTextInput = document.getElementById("bottomText");
const fontStyleInput = document.getElementById("fontStyle");
const fontSizeInput = document.getElementById("fontSize");
const textColorInput = document.getElementById("textColor");
const alignmentButtons = document.querySelectorAll("[data-align]");
const memePreview = document.getElementById("memePreview");
const aiSuggestions = document.getElementById("aiSuggestions");

let selectedImage = null;
let alignment = "center";

// 1. Show selected image
memeImageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedImage = file;
    const reader = new FileReader();
    reader.onload = () => {
      memePreview.style.backgroundImage = `url('${reader.result}')`;
    };
    reader.readAsDataURL(file);
  }
});

// 2. Show template image when selected
templateSelector.addEventListener("change", () => {
  const template = templateSelector.value;
  if (template) {
    selectedImage = null;
    memePreview.style.backgroundImage = `url('/templates/${template}')`;
  }
});

// 3. Update text overlay on preview
[topTextInput, bottomTextInput, fontStyleInput, fontSizeInput, textColorInput].forEach(input => {
  input.addEventListener("input", updatePreview);
});

alignmentButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    alignment = btn.dataset.align;
    updatePreview();
  });
});

function updatePreview() {
  memePreview.innerHTML = `
    <div class="meme-text top" style="${getTextStyle()}">${topTextInput.value}</div>
    <div class="meme-text bottom" style="${getTextStyle()}">${bottomTextInput.value}</div>
  `;
}

function getTextStyle() {
  return `
    font-family: ${fontStyleInput.value};
    font-size: ${fontSizeInput.value}px;
    color: ${textColorInput.value};
    text-align: ${alignment};
  `;
}

// 4. Generate AI Caption (placeholder)
document.getElementById("generateCaption").addEventListener("click", () => {
  aiSuggestions.innerText = "🤖 Suggested Caption: 'When your code finally works...'";
});

// 5. Save draft or publish
document.getElementById("saveDraft").addEventListener("click", () => {
  saveMeme("draft");
});

document.getElementById("publishMeme").addEventListener("click", () => {
  saveMeme("published");
});

async function saveMeme(status) {
  const memeData = {
    topText: topTextInput.value,
    bottomText: bottomTextInput.value,
    fontStyle: fontStyleInput.value,
    fontSize: fontSizeInput.value,
    color: textColorInput.value,
    alignment: alignment,
    userId: auth.currentUser.uid,
    createdAt: Timestamp.now(),
    status: status,
    imageUrl: null
  };

  try {
    if (selectedImage) {
      memeData.imageUrl = await uploadToCloudinary(selectedImage);
    } else {
      memeData.imageUrl = `/templates/${templateSelector.value}`;
    }

    await addDoc(collection(db, "memes"), memeData);
    alert(`Meme ${status === 'draft' ? 'saved as draft' : 'published'}!`);
    window.location.href = "/dashboard.html";

  } catch (error) {
    console.error("Error saving meme:", error);
    alert("Failed to save meme.");
  }
}
