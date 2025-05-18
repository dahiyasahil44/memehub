import { db, doc, getDoc } from "/js/firebase-init.js";

const url =
  "https://memehub-4e730-default-rtdb.asia-southeast1.firebasedatabase.app/";

export async function getMemes() {
  try {
    const res = await fetch(`${url}/memes.json`);
    const data = await res.json();
    const allMemes = Object.entries(data || {}).map(([id, val]) => ({ id, ...val }));
    return allMemes
  } catch (err) {
    console.error("Error fetching memes:", err);
    return []
  }
}
