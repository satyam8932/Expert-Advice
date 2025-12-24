import { supabaseServer } from '@/supabase/server';
import { db } from '@/lib/db/drizzle';
import { users } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';

interface AdminAuthResult {
    isAdmin: boolean;
    userId: string | null;
    error: string | null;
}

export async function checkAdminAuth(): Promise<AdminAuthResult> {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { isAdmin: false, userId: null, error: 'Unauthorized' };
    }

    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.id),
    });

    if (!dbUser?.isSuper) {
        return { isAdmin: false, userId: user.id, error: 'Forbidden - Admin access required' };
    }

    return { isAdmin: true, userId: user.id, error: null };
}
