import { checkAdminAuth } from '@/lib/auth/admin';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { limits } from '../../../../../../../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(req: Request, { params }: { params: Promise<{ userId: string }> }) {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
        return NextResponse.json({ error }, { status: error === 'Unauthorized' ? 401 : 403 });
    }

    const { userId } = await params;
    const body = await req.json();

    const updateData: any = {};
    if (body.storageLimitBytes !== undefined) updateData.storageLimitBytes = body.storageLimitBytes;
    if (body.formsLimit !== undefined) updateData.formsLimit = body.formsLimit;
    if (body.submissionsLimit !== undefined) updateData.submissionsLimit = body.submissionsLimit;
    if (body.audioMinutesLimit !== undefined) updateData.audioMinutesLimit = body.audioMinutesLimit;
    if (body.videoMinutesLimit !== undefined) updateData.videoMinutesLimit = body.videoMinutesLimit;
    if (body.videoIntelligenceEnabled !== undefined) updateData.videoIntelligenceEnabled = body.videoIntelligenceEnabled;

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    await db.update(limits).set(updateData).where(eq(limits.userId, userId));

    return NextResponse.json({ success: true, message: 'Limits updated' });
}
