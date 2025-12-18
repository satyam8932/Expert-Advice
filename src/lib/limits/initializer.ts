import { db } from '@/lib/db/drizzle';
import { limits } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';

interface PlanLimits {
    storageLimitBytes: number;
    formsLimit: number;
    submissionsLimit: number;
    audioMinutesLimit: number;
    videoMinutesLimit: number;
    videoIntelligenceEnabled: boolean;
}

/**
 * Get plan limits from environment variables
 */
function getPlanLimitsFromEnv(planKey: 'go' | 'pro'): PlanLimits {
    const prefix = planKey.toUpperCase();

    return {
        storageLimitBytes: parseInt(process.env[`${prefix}_STORAGE_LIMIT_BYTES`] || '10737418240'),
        formsLimit: parseInt(process.env[`${prefix}_FORMS_LIMIT`] || (planKey === 'go' ? '5' : '20')),
        submissionsLimit: parseInt(process.env[`${prefix}_SUBMISSIONS_LIMIT`] || (planKey === 'go' ? '20' : '100')),
        audioMinutesLimit: parseInt(process.env[`${prefix}_AUDIO_MINUTES_LIMIT`] || (planKey === 'go' ? '120' : '600')),
        videoMinutesLimit: parseInt(process.env[`${prefix}_VIDEO_MINUTES_LIMIT`] || (planKey === 'go' ? '0' : '300')),
        videoIntelligenceEnabled: process.env[`${prefix}_VIDEO_INTELLIGENCE`] === 'true',
    };
}

/**
 * Initialize or update user limits based on their plan
 * Called when:
 * - New subscription created (checkout.session.completed)
 * - Subscription updated (customer.subscription.updated)
 */
export async function initializeUserLimits(userId: string, planKey: 'go' | 'pro', subscriptionId?: string): Promise<void> {
    const planLimits = getPlanLimitsFromEnv(planKey);

    console.log(`[Limits] Initializing limits for user ${userId} with plan ${planKey}`);

    try {
        await db
            .insert(limits)
            .values({
                userId,
                subscriptionId: subscriptionId || null,
                ...planLimits,
            })
            .onConflictDoUpdate({
                target: limits.userId,
                set: {
                    ...planLimits,
                    subscriptionId: subscriptionId || null,
                    updatedAt: new Date(),
                },
            });

        console.log(`[Limits] ✓ Successfully initialized limits for user ${userId}`);
    } catch (error) {
        console.error(`[Limits] Failed to initialize limits for user ${userId}:`, error);
        throw error;
    }
}

/**
 * Get user limits from database
 */
export async function getUserLimits(userId: string) {
    return await db.query.limits.findFirst({
        where: eq(limits.userId, userId),
    });
}
