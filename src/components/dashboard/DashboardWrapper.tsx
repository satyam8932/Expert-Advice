'use client';

import StatsCard from '@/components/dashboard/StatsCard';
import { RecentFormsCard, RecentSubmissionsCard } from './DashboardWidgets';

interface DashboardData {
    stats: {
        label: string;
        value: string;
        subtitle?: string;
        iconName: string;
        color: 'indigo' | 'green' | 'yellow' | 'pink' | 'purple';
    }[];
    billing: {
        plan: string;
        status: string;
    };
    usage: {
        storage: { used: number; limit: number; percentage: number };
        forms: { used: number; limit: number };
        submissions: { used: number; limit: number };
        audioMinutes: { used: number; limit: number };
    };
    recentForms: {
        id: string;
        name: string;
        submissions: number;
        status: string;
        createdAt: Date | null;
    }[];
    recentSubmissions: {
        id: string;
        formId: string;
        formName: string;
        status: string;
        createdAt: Date | null;
    }[];
}

export default function DashboardWrapper({ data }: { data: DashboardData }) {
    return (
        <div className="flex flex-col p-2 gap-8 overflow-visible">
            <div className="shrink-0">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-foreground to-muted-foreground">Overview</h1>
                <p className="text-muted-foreground mt-1">Welcome back! Here's your AI data intake performance.</p>
            </div>

            <div className="flex-1 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {data.stats.map((stat) => (
                        <StatsCard key={stat.label} {...stat} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RecentFormsCard forms={data.recentForms} />
                    <RecentSubmissionsCard submissions={data.recentSubmissions} />
                </div>
            </div>
        </div>
    );
}
