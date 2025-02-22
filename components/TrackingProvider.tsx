'use client'

import React, { useEffect } from 'react';

const TrackingProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        // Initialize analytics here
        // Example: Google Analytics, Mixpanel, etc.
    }, []);

    return <>{children}</>;
};

export default TrackingProvider;
