import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth/admin';
import { db } from '@/lib/db/drizzle';
import { contactQueries } from '../../../../../../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(req: Request, { params }: { params: Promise<{ queryId: string }> }) {
    const { isAdmin } = await checkAdminAuth();

    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { queryId } = await params;
        const body = await req.json();

        if (typeof body.isResolved !== 'boolean') {
            return NextResponse.json({ error: 'isResolved must be a boolean' }, { status: 400 });
        }

        await db.update(contactQueries).set({ isResolved: body.isResolved }).where(eq(contactQueries.id, queryId));

        return NextResponse.json({ success: true, message: 'Query status updated' }, { status: 200 });
    } catch (error) {
        console.error('Failed to update query status:', error);
        return NextResponse.json({ error: 'Failed to update query status' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ queryId: string }> }) {
    const { isAdmin } = await checkAdminAuth();

    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { queryId } = await params;

        await db.delete(contactQueries).where(eq(contactQueries.id, queryId));

        return NextResponse.json({ success: true, message: 'Query deleted' }, { status: 200 });
    } catch (error) {
        console.error('Failed to delete query:', error);
        return NextResponse.json({ error: 'Failed to delete query' }, { status: 500 });
    }
}
