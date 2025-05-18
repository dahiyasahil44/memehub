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

// const toggle = document.getElementById("darkModeToggle");

// Check saved preference (optional)
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
//   toggle.checked = true;
}

// toggle.addEventListener("change", () => {
//   if (toggle.checked) {
//     document.body.classList.add("dark-mode");
//     localStorage.setItem("darkMode", "enabled");
//   } else {
//     document.body.classList.remove("dark-mode");
//     localStorage.setItem("darkMode", "disabled");
//   }
// });

const currentUser = JSON.parse(localStorage.getItem("meme-hub-user") || "{}");
window.currentUser = currentUser
// console.log(currentUser)
// voting meme
async function voteHandler(item, type, card) {
  const isUpvote = type === "upvote";
  const userId = currentUser?.uid;
  if (!userId) return;

  const votedKey = isUpvote ? "upvotedBy" : "downvotedBy";
  const counterKey = isUpvote ? "upvoteCount" : "downvoteCount";
  const oppositeKey = isUpvote ? "downvotedBy" : "upvotedBy";
  const oppositeCount = isUpvote ? "downvoteCount" : "upvoteCount";

  if (item[votedKey]?.[userId]) return; // already voted

  if (item[oppositeKey]?.[userId]) {
      delete item[oppositeKey][userId];
      item[oppositeCount] = Math.max(0, item[oppositeCount] - 1);
  }

  item[counterKey] = (item[counterKey] || 0) + 1;
  item[votedKey] = item[votedKey] || {};
  item[votedKey][userId] = true;

  // Update UI
  const votes = card.querySelectorAll(".meme-votes span");
  votes[isUpvote ? 1 : 3].innerText = item[counterKey];
  votes[isUpvote ? 0 : 2].querySelector("i").classList.add("active");
  votes[isUpvote ? 3 : 1].innerText = item[oppositeCount];
  votes[isUpvote ? 2 : 0].querySelector("i").classList.remove("active");

  // DB update
  await fetch(`${url}/memes/${item.id}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          [counterKey]: item[counterKey],
          [oppositeCount]: item[oppositeCount],
          [`${votedKey}/${userId}`]: true,
          [`${oppositeKey}/${userId}`]: null,
          updatedAt: Date.now()
      })
  });
}
window.voteHandler = voteHandler


// top memers data & show in right sidebar
async function fetchTop10Memers() {
  const dbURL = "https://memehub-4e730-default-rtdb.asia-southeast1.firebasedatabase.app";

  // Fetch all memes from the database
  const res = await fetch(`${dbURL}/memes.json`);
  const memes = await res.json();
  if (!memes) return [];

  // Aggregate upvotes by user ID
  const voteCountByUser = {};
  for (const [id, meme] of Object.entries(memes)) {
      const uid = meme.UID;
      if (!uid) continue;

      const votes = meme.upvoteCount || 0;
      voteCountByUser[uid] = (voteCountByUser[uid] || 0) + votes;
  }

  // Sort users by upvotes (descending) and take top 10
  const sortedUserEntries = Object.entries(voteCountByUser)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 10

  // Fetch user info from Firestore
  const topMemers = [];
  for (const [uid, totalUpvotes] of sortedUserEntries) {
      try {
          const userSnap = await getDoc(doc(db, "users", uid));
          const userData = userSnap.exists() ? userSnap.data() : { userName: "Unknown", avatar: "", bio: "" };

          topMemers.push({
              uid,
              totalUpvotes,
              ...userData
          });
      } catch (error) {
          console.error(`Error fetching user ${uid}:`, error);
      }
  }

  return topMemers;
}
// window.fetchTop10Memers = fetchTop10Memers

// let topMemers = await fetchTop10Memers()
// console.log(topMemers)

async function renderTopMemers() {
  const topMemers = await fetchTop10Memers();
  const list = document.getElementById("top-memers");
  if(!list)return
  list.innerHTML = "";

  topMemers.forEach(memer => {
      const li = document.createElement("li");

      li.innerHTML = `
          <a href="/memer.html?id=${memer.uid}" class="mb-0"><span>@${memer.userName || 'Unknown'}</span></a>
      `;

      list.appendChild(li);
  });
}

renderTopMemers();


