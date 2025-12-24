import { checkAdminAuth } from '@/lib/auth/admin';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users, subscriptions, forms, submissions, limits, usage } from '../../../../../drizzle/schema';
import { count, eq, desc } from 'drizzle-orm';

export async function GET() {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
        return NextResponse.json({ error }, { status: error === 'Unauthorized' ? 401 : 403 });
    }

    const [usersData, totalUsersResult, totalFormsResult, totalSubmissionsResult, activeSubscriptionsResult] = await Promise.all([
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
                    videoMinutesLimit: limits.videoMinutesLimit,
                    videoIntelligenceEnabled: limits.videoIntelligenceEnabled,
                },
                usage: {
                    storageUsedBytes: usage.storageUsedBytes,
                    formsCreatedCount: usage.formsCreatedCount,
                    submissionsCount: usage.submissionsCount,
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
    ]);

    const totalUsers = totalUsersResult[0]?.count || 0;
    const totalForms = totalFormsResult[0]?.count || 0;
    const totalSubmissions = totalSubmissionsResult[0]?.count || 0;
    const activeSubscriptions = activeSubscriptionsResult[0]?.count || 0;

    return NextResponse.json({
        users: usersData,
        stats: {
            totalUsers,
            totalForms,
            totalSubmissions,
            activeSubscriptions,
        },
    });
}
