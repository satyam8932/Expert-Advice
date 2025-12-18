import { db } from '@/lib/db/drizzle';
import { limits, usage, subscriptions } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';

export interface QuotaCheckResult {
    allowed: boolean;
    current: number;
    limit: number;
    message?: string;
    requiresUpgrade?: boolean;
}

export async function checkQuota(userId: string, resource: 'forms' | 'submissions' | 'storage'): Promise<QuotaCheckResult> {
    const [userLimits, userUsage, userSubscription] = await Promise.all([db.query.limits.findFirst({ where: eq(limits.userId, userId) }), db.query.usage.findFirst({ where: eq(usage.userId, userId) }), db.query.subscriptions.findFirst({ where: eq(subscriptions.userId, userId) })]);

    if (!userLimits || !userSubscription || userSubscription.status !== 'active') {
        return {
            allowed: false,
            current: 0,
            limit: 0,
            message: 'Active subscription required',
            requiresUpgrade: true,
        };
    }

    switch (resource) {
        case 'forms': {
            const current = userUsage?.formsCreatedCount || 0;
            const limit = userLimits.formsLimit;
            const allowed = limit === -1 || current < limit;

            return {
                allowed,
                current,
                limit,
                message: allowed ? undefined : `Form limit reached (${current}/${limit})`,
                requiresUpgrade: !allowed,
            };
        }

        case 'submissions': {
            const current = userUsage?.submissionsCount || 0;
            const limit = userLimits.submissionsLimit;
            const allowed = limit === -1 || current < limit;

            return {
                allowed,
                current,
                limit,
                message: allowed ? undefined : `Submission limit reached (${current}/${limit})`,
                requiresUpgrade: !allowed,
            };
        }

        case 'storage': {
            const current = userUsage?.storageUsedBytes || 0;
            const limit = userLimits.storageLimitBytes;
            const allowed = limit === -1 || current < limit;

            return {
                allowed,
                current,
                limit,
                message: allowed ? undefined : 'Storage limit reached',
                requiresUpgrade: !allowed,
            };
        }
    }
}

export async function checkStorageQuota(userId: string, additionalBytes: number): Promise<QuotaCheckResult> {
    const [userLimits, userUsage, userSubscription] = await Promise.all([db.query.limits.findFirst({ where: eq(limits.userId, userId) }), db.query.usage.findFirst({ where: eq(usage.userId, userId) }), db.query.subscriptions.findFirst({ where: eq(subscriptions.userId, userId) })]);

    if (!userLimits || !userSubscription || userSubscription.status !== 'active') {
        return {
            allowed: false,
            current: 0,
            limit: 0,
            message: 'Active subscription required',
            requiresUpgrade: true,
        };
    }

    const currentUsage = userUsage?.storageUsedBytes || 0;
    const limit = userLimits.storageLimitBytes;
    const newTotal = currentUsage + additionalBytes;
    const allowed = limit === -1 || newTotal <= limit;

    return {
        allowed,
        current: currentUsage,
        limit,
        message: allowed ? undefined : `Storage limit would be exceeded`,
        requiresUpgrade: !allowed,
    };
}

export async function getUserUsage(userId: string) {
    return await db.query.usage.findFirst({
        where: eq(usage.userId, userId),
    });
}
