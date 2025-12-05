import DashboardWrapper from '@/components/dashboard/DashboardWrapper';

export const metadata = {
    title: 'Dashboard | AdviceExpert.io',
};

async function getDashboardData() {
    return {
        stats: [
            {
                label: 'Total Forms',
                value: '24',
                change: '+12%',
                trend: 'up' as const,
                iconName: 'FileText',
                color: 'indigo' as const,
            },
            {
                label: 'Submissions',
                value: '1,429',
                change: '+8%',
                trend: 'up' as const,
                iconName: 'Send',
                color: 'green' as const,
            },
            {
                label: 'Revenue',
                value: '$12,450',
                change: '+23%',
                trend: 'up' as const,
                iconName: 'DollarSign',
                color: 'yellow' as const,
            },
            {
                label: 'Conversion Rate',
                value: '68%',
                change: '+5%',
                trend: 'up' as const,
                iconName: 'TrendingUp',
                color: 'pink' as const,
            },
        ],
        activity: [
            {
                text: 'New Damage Report submitted',
                time: 2,
                iconName: 'FileText',
                color: 'indigo' as const,
            },
            {
                text: 'User profile updated',
                time: 5,
                iconName: 'Users',
                color: 'green' as const,
            },
            {
                text: 'Billing charge initiated',
                time: 10,
                iconName: 'DollarSign',
                color: 'pink' as const,
            },
            {
                text: 'System maintenance scheduled',
                time: 45,
                iconName: 'Zap',
                color: 'yellow' as const,
            },
            {
                text: 'New Damage Report submitted',
                time: 60,
                iconName: 'FileText',
                color: 'indigo' as const,
            },
        ],
        popularForms: [
            { name: 'Damage Report', count: 234 },
            { name: 'Claims Intake', count: 189 },
            { name: 'Product Feedback', count: 156 },
            { name: 'Onboarding Survey', count: 123 },
            { name: 'Vehicle Inspection', count: 98 },
        ],
    };
}

export default async function DashboardPage() {
    const data = await getDashboardData();

    return (
        <div className="bg-[#030303] text-gray-200">
            <DashboardWrapper data={data} />
        </div>
    );
}
