import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth/admin';
import { db } from '@/lib/db/drizzle';
import { contactQueries } from '../../../../../drizzle/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
    const { isAdmin } = await checkAdminAuth();

    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const queries = await db
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
            .orderBy(desc(contactQueries.createdAt));

        return NextResponse.json({ queries }, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch contact queries:', error);
        return NextResponse.json({ error: 'Failed to fetch contact queries' }, { status: 500 });
    }
}
