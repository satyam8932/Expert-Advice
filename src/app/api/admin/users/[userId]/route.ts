import { checkAdminAuth } from '@/lib/auth/admin';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users, limits, usage } from '../../../../../../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(req: Request, { params }: { params: Promise<{ userId: string }> }) {
    const { isAdmin, error } = await checkAdminAuth();

    if (!isAdmin) {
        return NextResponse.json({ error }, { status: error === 'Unauthorized' ? 401 : 403 });
    }

    const { userId } = await params;
    const body = await req.json();

    if (body.isSuper !== undefined) {
        await db.update(users).set({ isSuper: body.isSuper }).where(eq(users.id, userId));

        return NextResponse.json({ success: true, message: 'Admin status updated' });
    }

    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
}
