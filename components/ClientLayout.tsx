'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { trackPageView } from '../utils/analytics';
import type { ReactNode } from 'react';
import React from 'react';

export default function ClientLayout({
    children,
}: {
    children: ReactNode;
}) {
    const pathname = usePathname();
    const lastTrackedPath = useRef<string | null>(null);
    const isFirstMount = useRef(true);

    useEffect(() => {
        // Only track if this is a new path and not the initial mount in development
        if (pathname !== lastTrackedPath.current && (!isFirstMount.current || process.env.NODE_ENV === 'production')) {
            trackPageView(pathname);
            lastTrackedPath.current = pathname;
        }
        isFirstMount.current = false;
    }, [pathname]);

    return <>{children}</>;
}
