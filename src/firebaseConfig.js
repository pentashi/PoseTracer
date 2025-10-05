// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDD-ldFUK6J1egmVHxipjrhb-LTOIfEaEs",
  authDomain: "achapi-ai-fitness-coach.firebaseapp.com",
  projectId: "achapi-ai-fitness-coach",
  storageBucket: "achapi-ai-fitness-coach.firebasestorage.app",
  messagingSenderId: "117338601600",
  appId: "1:117338601600:web:44f152b88bb5258d3d0e65",
  measurementId: "G-V8B0V56DW5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
