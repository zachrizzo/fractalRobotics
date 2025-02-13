'use client'

import { trackVisitor } from "@/lib/visitorTracking"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import type React from "react"

export default function TrackingProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        trackVisitor(pathname);
    }, [pathname]);

    return <>{children}</>;
}
