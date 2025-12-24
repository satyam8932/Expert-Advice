'use client';

import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/admin.store';
import type { AdminUsersResponse } from '@/lib/types/admin.types';
import StatsCards from './StatsCards';
import UsersTable from './UsersTable';
import SubscriptionsTable from './SubscriptionsTable';
import ContactQueriesList from './ContactQueriesList';
import AdminTabs from './AdminTabs';

interface ContactQuery {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    isResolved: boolean;
    createdAt: Date | null;
}

interface AdminWrapperProps {
    initialData: AdminUsersResponse & {
        contactQueries: ContactQuery[];
    };
}

export default function AdminWrapper({ initialData }: AdminWrapperProps) {
    const { users, stats, setAdminData, refreshAdminData } = useAdminStore();
    const [activeTab, setActiveTab] = useState('users');
    const [contactQueries, setContactQueries] = useState<ContactQuery[]>(initialData.contactQueries || []);

    useEffect(() => {
        setAdminData(initialData);
        setContactQueries(initialData.contactQueries || []);
    }, [initialData, setAdminData]);

    const handleUpdate = async () => {
        await refreshAdminData();
    };

    const handleQueryUpdate = async () => {
        // Refresh contact queries data
        try {
            const res = await fetch('/api/admin/contact-queries');
            if (res.ok) {
                const data = await res.json();
                setContactQueries(data.queries || []);
            }
        } catch (error) {
            console.error('Failed to refresh contact queries:', error);
        }
    };

    if (!stats) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-8">
            <StatsCards totalUsers={stats.totalUsers} activeSubscriptions={stats.activeSubscriptions} totalForms={stats.totalForms} totalSubmissions={stats.totalSubmissions} />

            <div className="rounded-lg border border-border bg-card">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">Management</h2>
                </div>

                <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="p-6">
                    {activeTab === 'users' && <UsersTable users={users} onUpdate={handleUpdate} />}
                    {activeTab === 'subscriptions' && <SubscriptionsTable users={users} onUpdate={handleUpdate} />}
                    {activeTab === 'queries' && <ContactQueriesList queries={contactQueries} onUpdate={handleQueryUpdate} />}
                </div>
            </div>
        </div>
    );
}
