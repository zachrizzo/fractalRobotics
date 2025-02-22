import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import * as path from "path";

// Initialize Firebase Admin with service account
const serviceAccount = require(path.join(
  process.cwd(),
  "fractal-robotics-firebase-adminsdk-fbsvc-e698453788.json"
));

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "fractal-robotics.firebasestorage.app",
});

const db = getFirestore(app);
const storage = getStorage(app);

interface BlogPost {
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
  excerpt: string;
}

export async function createBlogPost(post: BlogPost) {
  try {
    // Add the blog post to Firestore
    const docRef = await db.collection("blogPosts").add({
      ...post,
      createdAt: new Date().toISOString(),
      author: "AI Assistant",
    });

    console.log("Blog post created successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
}

export async function updateBlogPost(
  postId: string,
  updates: Partial<BlogPost>
) {
  try {
    await db.collection("blogPosts").doc(postId).update(updates);
    console.log("Blog post updated successfully:", postId);
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
}

export async function deleteBlogPost(postId: string) {
  try {
    await db.collection("blogPosts").doc(postId).delete();
    console.log("Blog post deleted successfully:", postId);
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
}

export async function uploadImage(
  imageBuffer: Buffer,
  filename: string
): Promise<string> {
  try {
    console.log(`Starting upload process for image: ${filename}`);
    const bucket = storage.bucket();
    console.log(`Got bucket reference: ${bucket.name}`);

    const file = bucket.file(`blog-images/${filename}`);
    console.log(`Created file reference: blog-images/${filename}`);

    // Determine content type based on file extension
    const contentType = filename.toLowerCase().endsWith(".png")
      ? "image/png"
      : "image/jpeg";
    console.log(`Determined content type: ${contentType}`);

    console.log(`Saving file to bucket...`);
    await file.save(imageBuffer, {
      metadata: {
        contentType: contentType,
      },
    });
    console.log(`File saved successfully`);

    console.log(`Generating signed URL...`);
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-01-2500", // Far future expiration
    });
    console.log(`Generated signed URL: ${url}`);

    return url;
  } catch (error: any) {
    console.error("Error uploading image:", error);
    if (error.code === 404) {
      console.error(
        "Storage bucket not found. Please check your Firebase Storage configuration."
      );
    }
    throw error;
  }
}

// Example usage for creating a blog post
export async function createAIBlogPost(
  title: string,
  content: string,
  category: string,
  tags: string[],
  imageUrl?: string
) {
  const blogPost: BlogPost = {
    title,
    content,
    category,
    tags,
    imageUrl,
    author: "AI Assistant",
    createdAt: new Date().toISOString(),
    readTime: `${Math.ceil(content.split(" ").length / 200)} min read`, // Estimate reading time
    excerpt: content.substring(0, 150) + "...",
  };

  return createBlogPost(blogPost);
}
