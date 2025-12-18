import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { usage } from '../../../../../drizzle/schema';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        const expectedSecret = process.env.N8N_WEBHOOK_SECRET;

        if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId, audioMinutesUsed, storageBytes, videoMinutesUsed } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const updates: any = {};

        if (audioMinutesUsed !== undefined) {
            updates.audioMinutesTranscribed = sql`audio_minutes_transcribed + ${audioMinutesUsed}`;
        }

        if (storageBytes !== undefined) {
            updates.storageUsedBytes = sql`storage_used_bytes + ${storageBytes}`;
        }

        if (videoMinutesUsed !== undefined) {
            updates.videoMinutesUsed = sql`video_minutes_used + ${videoMinutesUsed}`;
        }

        updates.submissionsCount = sql`submissions_count + 1`;

        await db.update(usage).set(updates).where(eq(usage.userId, userId));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Usage increment error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
