import { checkAdminAuth } from '@/lib/auth/admin';
import { redirect } from 'next/navigation';
import AdminWrapper from '@/components/admin/AdminWrapper';
import { db } from '@/lib/db/drizzle';
import { users, subscriptions, forms, submissions, limits, usage, contactQueries } from '../../../../../drizzle/schema';
import { count, eq, desc } from 'drizzle-orm';

export const metadata = {
    title: 'Admin Dashboard | AdviceExpert.io',
};

export default async function AdminPage() {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
        if (error === 'Unauthorized') {
            redirect('/auth/login');
        } else {
            redirect('/dashboard');
        }
    }

    const [usersData, totalUsersResult, totalFormsResult, totalSubmissionsResult, activeSubscriptionsResult, contactQueriesData] = await Promise.all([
        db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                isSuper: users.isSuper,
                createdAt: users.createdAt,
                subscription: {
                    id: subscriptions.id,
                    plan: subscriptions.plan,
                    status: subscriptions.status,
                    subscriptionStart: subscriptions.subscriptionStart,
                },
                limits: {
                    storageLimitBytes: limits.storageLimitBytes,
                    formsLimit: limits.formsLimit,
                    submissionsLimit: limits.submissionsLimit,
                    audioMinutesLimit: limits.audioMinutesLimit,
                    videoMinutesLimit: limits.videoMinutesLimit,
                    videoIntelligenceEnabled: limits.videoIntelligenceEnabled,
                },
                usage: {
                    storageUsedBytes: usage.storageUsedBytes,
                    formsCreatedCount: usage.formsCreatedCount,
                    submissionsCount: usage.submissionsCount,
                    audioMinutesTranscribed: usage.audioMinutesTranscribed,
                    videoMinutesUsed: usage.videoMinutesUsed,
                },
            })
            .from(users)
            .leftJoin(subscriptions, eq(users.id, subscriptions.userId))
            .leftJoin(limits, eq(users.id, limits.userId))
            .leftJoin(usage, eq(users.id, usage.userId))
            .orderBy(desc(users.createdAt)),
        db.select({ count: count() }).from(users),
        db.select({ count: count() }).from(forms),
        db.select({ count: count() }).from(submissions),
        db.select({ count: count() }).from(subscriptions).where(eq(subscriptions.status, 'active')),
        db
            .select({
                id: contactQueries.id,
                name: contactQueries.name,
                email: contactQueries.email,
                subject: contactQueries.subject,
                message: contactQueries.message,
                isResolved: contactQueries.isResolved,
                createdAt: contactQueries.createdAt,
            })
            .from(contactQueries)
            .orderBy(desc(contactQueries.createdAt)),
    ]);

    const adminData = {
        users: usersData,
        contactQueries: contactQueriesData,
        stats: {
            totalUsers: totalUsersResult[0]?.count || 0,
            totalForms: totalFormsResult[0]?.count || 0,
            totalSubmissions: totalSubmissionsResult[0]?.count || 0,
            activeSubscriptions: activeSubscriptionsResult[0]?.count || 0,
        },
    };

    return (
        <div className="flex flex-col gap-8 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage users, subscriptions, and system settings</p>
                </div>
            </div>

            <AdminWrapper initialData={adminData} />
        </div>
    );
}
