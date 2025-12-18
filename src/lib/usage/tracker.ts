import { db } from '@/lib/db/drizzle';
import { usage } from '../../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';

export async function incrementStorage(userId: string, bytes: number): Promise<void> {
    await db
        .update(usage)
        .set({
            storageUsedBytes: sql`${usage.storageUsedBytes} + ${bytes}`,
            updatedAt: new Date(),
        })
        .where(eq(usage.userId, userId));
}

export async function decrementStorage(userId: string, bytes: number): Promise<void> {
    await db
        .update(usage)
        .set({
            storageUsedBytes: sql`GREATEST(0, ${usage.storageUsedBytes} - ${bytes})`,
            updatedAt: new Date(),
        })
        .where(eq(usage.userId, userId));
}

export async function incrementSubmissions(userId: string): Promise<void> {
    await db
        .update(usage)
        .set({
            submissionsCount: sql`${usage.submissionsCount} + 1`,
            updatedAt: new Date(),
        })
        .where(eq(usage.userId, userId));
}
