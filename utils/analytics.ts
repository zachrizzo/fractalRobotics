import { db } from "../app/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface PageView {
  path: string;
  timestamp: any;
  userAgent: string;
  language: string;
  screenResolution: string;
  timezone: string;
  referrer: string;
  country?: string;
  city?: string;
  region?: string;
  ip?: string;
  latitude?: number;
  longitude?: number;
}

// Create a cache to store the last tracked timestamps for each path
const pageViewCache = new Map<string, number>();
const DUPLICATE_THRESHOLD = 1000; // 1 second in milliseconds

async function getLocationData() {
  try {
    // First try to get detailed location data from ipapi.co
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) {
      throw new Error("Failed to fetch from ipapi.co");
    }
    const data = await response.json();
    return {
      country: data.country_name,
      city: data.city,
      region: data.region,
      ip: data.ip,
      latitude: data.latitude,
      longitude: data.longitude,
    };
  } catch (error) {
    console.error("Error getting location data from ipapi.co:", error);
    try {
      // Fallback to ipify for basic IP information
      const response = await fetch("https://api.ipify.org?format=json");
      if (!response.ok) {
        throw new Error("Failed to fetch from ipify");
      }
      const data = await response.json();
      return {
        ip: data.ip,
      };
    } catch (error) {
      console.error("Error getting IP from fallback service:", error);
      return {};
    }
  }
}

export const trackPageView = async (path: string) => {
  try {
    // Check if we've tracked this path recently
    const now = Date.now();
    const lastTracked = pageViewCache.get(path);

    if (lastTracked && now - lastTracked < DUPLICATE_THRESHOLD) {
      // Skip if we've tracked this path recently
      return;
    }

    // Update the cache
    pageViewCache.set(path, now);

    // Get basic client information
    const userAgent = window.navigator.userAgent;
    const language = window.navigator.language;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const referrer = document.referrer;

    // Create the page view data
    const pageView: PageView = {
      path,
      timestamp: serverTimestamp(),
      userAgent,
      language,
      screenResolution,
      timezone,
      referrer,
    };

    // Get location data
    const locationData = await getLocationData();
    Object.assign(pageView, locationData);

    // Add the page view to Firestore
    await addDoc(collection(db, "page_views"), pageView);
    console.log("Page view tracked successfully with location data");
  } catch (error) {
    console.error("Error tracking page view:", error);
  }
};
