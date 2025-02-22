import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Initialize Firebase Admin with service account
const app = initializeApp({
  credential: cert({
    projectId: "fractal-robotics",
    clientEmail:
      "firebase-adminsdk-fbsvc@fractal-robotics.iam.gserviceaccount.com",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDNzyb5Jc6StZo\nyGiDvd4Gbt+hTiSM88EQMPue0hjm6iN0KCf+x//JHdAWokashUeApJOfiDsQR7Zf\n5yKu2RKvn6v+INoTjbvdHrhHMu8F87mOYdZCVhB67aa+KOwnCWdI9kBd6uK1AUqt\nR/0W5aD513lUUq1pSvjKS3Qkp11umASmMsPrf/fupVQOS6uOMyfaexoB6VQhHkpJ\nqw2hKEykSwA3pxshmtVF4ohr4w7ITKwPmvszXszskKrDsXGw65A45UvUbWPam5OP\nFhoGHCkhJ6HLPiYX8NyApZvfffz0TZnJAuyT3RFVFrJwc6X4ApxObHHuCR1YlPiD\nUEgelxGjAgMBAAECggEAHulcugy425ylFeOCFTZX9WnSFH9Er2Mbs54mAdCf69Sw\nd4CyUJhHywdi/2qDyWazW030KENQovPQD6CQb+JkoJWmjO+TyJvdXxaxtGh+y9D7\nlW2tmUR6iJSgHiVpu4a0KawApj5+1o2VTxoCnAERe+5gQndzCSS7f4DyK6mq1EuM\nNP2s2VbFHBk3RW7wIQzO7VHrcnfK43vRzELTe94jbi8s/gnbH0HKRd66U8cpc7If\nYiWElM9bX3obKa4dDpTvTVqyCaR2xsxGDNtxTjIevKwLNElZpvFs8AgL30QMkaUO\n68CI6YDrFy2YyN/ylRR5o8DwHr2XZkKiZM2m0ORQhQKBgQDqNkwgFD14glLkM11n\nJqTXViIkBuw5JMFgrfIWL8kYgdabAyvnYSNdghY4BACc0SH0Mu3H2RyMlsFpQ/Fl\nf1vembc4sOQWW956CrG5k7GiPgWJqA5GI97AEjmCrWL6bRU65KqPZODLBhhWSeXT\nbUBjOZ7jEAIq70cTzSYxn0vkZQKBgQDVYEBjjcGa0i8A5Daefr7/thiIJUPYuyVd\nJ52wcP+0G64zw3cQ8QEuL7L/w3SKStqRRgCTSym9BwrzZyxcvp4Q9Ztlope8Zjqh\nYIlG9fB+Avk+8hH3KNKtpSAodT5TyETAtVC2byQGqSplBQxQAbKaK/1bXerFkTSE\njedkmPIpZwKBgQDDtlOuirtDNEPoBTQLujMM7iDhUhebOKePDku5Vn0ISZb3OZM6\naeWPgeDnNhD8+ZUR5mzkDvzYTjGYsPnLAr3WKUT9znMKbAJgoQcaN9y74m/mM9SZ\nr+e3QINmO1T2Rqjy6ZnM8VMW1CUKFf5Cyox/XerzerEVB5WxakB8PszAMQKBgFSB\n/n5vUlJjFEKiIA+92x+jmyuwtqJL3Ix8eDO9TUij/eZ6b9nB2dnVAmvRmYJ8Cvym\nYOv1RN6cv3WPUz6YMDo/TACA2N/BDU+E0FnOZiVCQDzx2rOs82PallXvuXOtSa2Z\nIhJfCkGpFiVUToARbA8rhPh+xdDhpY8qNI7fFGnZAoGAIhHs/UfBYSVajZ1Rjcom\n8hbyykdnx9jeWCOleUCZb+Asusjw6wY8zXPfl5l9/J1BZ6OfOQn3z9nss4rQd1ji\nxaSxIoNCZeO13ClJABb0tqNsWR37kvT5moAzerIlwsMDrzhLo7fwkkJVeknPgb+T\nhHol5taIlgzIWX/wICNDp50=\n-----END PRIVATE KEY-----\n",
  }),
  storageBucket: "fractal-robotics.appspot.com",
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
    const bucket = storage.bucket();
    const file = bucket.file(`blog-images/${filename}`);

    await file.save(imageBuffer, {
      metadata: {
        contentType: "image/jpeg", // Adjust based on actual image type
      },
    });

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-01-2500", // Far future expiration
    });

    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
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
