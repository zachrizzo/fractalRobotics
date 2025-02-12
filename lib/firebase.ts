import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBGvpQFYoU4DltrgpeVQ7wfcIy_ECNvZfg",
  authDomain: "fractal-robotics.firebaseapp.com",
  projectId: "fractal-robotics",
  storageBucket: "fractal-robotics.firebasestorage.app",
  messagingSenderId: "320053037264",
  appId: "1:320053037264:web:5a66a4888272801f5f36d5",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

