import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseconfig";

const addMessage = async (uid: string, type: "ai" | "user", message: string, insights?: string[]) => {
  const chatRef = collection(db, "users", uid, "chatHistory");
  await addDoc(chatRef, {
    type,
    message,
    timestamp: Date.now(),
    insights: insights || []
  });
};
