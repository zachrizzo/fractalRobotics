import { initializeApp, getApps } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import {
  getFirestore,
  Firestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  Query,
  DocumentData,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if it hasn't been initialized already
let app;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (typeof window !== "undefined") {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

// User tracking interface
export interface UserVisit {
  timestamp: Date;
  page: string;
  userAgent: string;
  referrer: string;
  ipAddress?: string;
}

// User tracking function
export async function trackUserVisit(page: string): Promise<void> {
  if (!db) return;

  try {
    const userVisit: Partial<UserVisit> = {
      timestamp: serverTimestamp() as any,
      page,
      userAgent: window.navigator.userAgent,
      referrer: document.referrer || "direct",
    };

    await addDoc(collection(db, "userVisits"), userVisit);
  } catch (error) {
    console.warn("Error tracking user visit:", error);
  }
}

// Blog post interface
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  createdAt: string;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
}

// Blog post functions
export async function getLatestBlogPosts(
  postLimit: number = 3
): Promise<BlogPost[]> {
  if (!db) return [];

  try {
    const blogRef = collection(db, "blogPosts");
    const q = query(blogRef, orderBy("createdAt", "desc"), limit(postLimit));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as BlogPost)
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!db) return [];

  try {
    const blogRef = collection(db, "blogPosts");
    const q = query(blogRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as BlogPost)
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export { app, auth, db, storage };
