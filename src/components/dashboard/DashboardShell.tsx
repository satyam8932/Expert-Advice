'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

interface DashboardShellProps {
    children: React.ReactNode;
    isAdmin: boolean;
}

export default function DashboardShell({ children, isAdmin }: DashboardShellProps) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const handleResize = () => {
            if (window.innerWidth < 1024) setIsCollapsed(true);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleToggle = () => setIsCollapsed(!isCollapsed);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background">
            <Sidebar isCollapsed={isCollapsed} onToggle={handleToggle} isAdmin={isAdmin} />
            <DashboardHeader isCollapsed={isCollapsed} onToggle={handleToggle} />
            <main className={`pt-[65px] transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                <div className="p-4">{children}</div>
            </main>
        </div>
    );
}
