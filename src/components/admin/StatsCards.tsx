import { Users, CreditCard, FileText, Send } from 'lucide-react';

interface StatsCardsProps {
    totalUsers: number;
    activeSubscriptions: number;
    totalForms: number;
    totalSubmissions: number;
}

export default function StatsCards({ totalUsers, activeSubscriptions, totalForms, totalSubmissions }: StatsCardsProps) {
    const stats = [
        {
            label: 'Total Users',
            value: totalUsers,
            icon: Users,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            label: 'Active Subscriptions',
            value: activeSubscriptions,
            icon: CreditCard,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
        },
        {
            label: 'Total Forms',
            value: totalForms,
            icon: FileText,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
        },
        {
            label: 'Total Submissions',
            value: totalSubmissions,
            icon: Send,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div key={stat.label} className="p-6 rounded-lg border border-border bg-card hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
