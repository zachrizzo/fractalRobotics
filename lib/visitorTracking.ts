import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface VisitorData {
  timestamp: any;
  userAgent: string;
  language: string;
  screenResolution: string;
  timezone: string;
  platform: string;
  ipAddress?: string;
  referrer: string;
  path: string;
}

export const trackVisitor = async (path: string) => {
  if (typeof window === "undefined" || !db) return;

  try {
    const visitorData: VisitorData = {
      timestamp: serverTimestamp(),
      userAgent: window.navigator.userAgent,
      language: window.navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      platform: window.navigator.platform,
      referrer: document.referrer,
      path: path,
    };

    await addDoc(collection(db, "visitors"), visitorData);
  } catch (error) {
    console.error("Error tracking visitor:", error);
  }
};
