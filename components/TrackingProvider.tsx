'use client'

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics, db } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const TrackingProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const trackPageView = async () => {
            try {
                // Track page view in Analytics
                if (analytics) {
                    logEvent(analytics, 'page_view', {
                        page_path: pathname,
                        page_search: searchParams?.toString() || '',
                        page_url: window.location.href,
                    });
                }

                // Store page view in Firestore
                if (db) {
                    const pageViewsCollection = collection(db, 'page_views');
                    await addDoc(pageViewsCollection, {
                        path: pathname,
                        search: searchParams?.toString() || '',
                        url: window.location.href,
                        userAgent: window.navigator.userAgent,
                        timestamp: serverTimestamp(),
                        referrer: document.referrer || null,
                        screenResolution: `${window.screen.width}x${window.screen.height}`,
                        language: window.navigator.language,
                    });
                }
            } catch (error) {
                console.error('Error tracking page view:', error);
            }
        };

        trackPageView();
    }, [pathname, searchParams]);

    return <>{children}</>;
};

export default TrackingProvider;
