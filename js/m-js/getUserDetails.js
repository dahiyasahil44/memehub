import { db, getDoc, doc } from "../firebase-init.js";
import { getCurrentUser } from "./get-user.js";


export async function getUserDetails() {
  const user = getCurrentUser();

  if (!user) {
    console.log("No user is currently logged in.");
    return null;
  }
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("User document not found.");
      return null;
    }
  } catch (error) {
    console.log("Error fetching user details:", error);
    return null;
  }
}
