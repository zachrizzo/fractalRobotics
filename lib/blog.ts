import { db } from "./firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  DocumentData,
} from "firebase/firestore";

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
