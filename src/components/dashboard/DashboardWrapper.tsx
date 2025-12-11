'use client';

import StatsCard from '@/components/dashboard/StatsCard';
import { RecentActivityCard, PopularFormsCard, ActivityItem, PopularFormItem } from './DashboardWidgets';

interface DashboardData {
    stats: {
        label: string;
        value: string;
        change: string;
        trend: 'up' | 'down' | 'neutral';
        iconName: string;
        color: 'indigo' | 'green' | 'yellow' | 'pink';
    }[];
    activity: ActivityItem[];
    popularForms: PopularFormItem[];
}

export default function DashboardWrapper({ data }: { data: DashboardData }) {
    return (
        <div className="flex flex-col p-2 gap-8 overflow-visible">
            <div className="shrink-0">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-foreground to-muted-foreground">Overview</h1>
                <p className="text-muted-foreground mt-1">Welcome back! Analyze your AI data intake performance.</p>
            </div>

            <div className="flex-1 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.stats.map((stat) => (
                        <StatsCard key={stat.label} {...stat} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RecentActivityCard activities={data.activity} />
                    <PopularFormsCard forms={data.popularForms} />
                </div>
            </div>
        </div>
    );
}
