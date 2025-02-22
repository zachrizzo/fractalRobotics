import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// This script assumes you have run:
// export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"

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

// Test connection
async function testConnection() {
  try {
    // Try to read from Firestore
    const testDoc = await db.collection("test").doc("test").get();
    console.log("Successfully connected to Firestore");

    // Try to access storage bucket
    const bucket = storage.bucket();
    await bucket.exists();
    console.log("Successfully connected to Storage");

    console.log("Firebase Admin SDK setup is working correctly!");
  } catch (error) {
    console.error("Error testing Firebase connection:", error);
  }
}

testConnection();
