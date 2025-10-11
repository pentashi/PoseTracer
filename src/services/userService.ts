
// src/services/userService.ts
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export const getUserSettings = async () => {
  if (!auth.currentUser) throw new Error("No user logged in");

  const userDocRef = doc(db, "users", auth.currentUser.uid);
  const docSnap = await getDoc(userDocRef);

  if (!docSnap.exists()) {
    throw new Error("User settings not found");
  }

  return docSnap.data();
};

export const updateUserSettings = async (data: any) => {
  if (!auth.currentUser) throw new Error("No user logged in");

  const userDocRef = doc(db, "users", auth.currentUser.uid);
  await updateDoc(userDocRef, data);
};
