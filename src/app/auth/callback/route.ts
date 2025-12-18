import { NextResponse } from 'next/server';
import { supabaseServer } from '@/supabase/server';
import { eq } from 'drizzle-orm';
import { users } from '../../../../drizzle/schema';
import { db } from '@/lib/db/drizzle';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const redirectTo = requestUrl.searchParams.get('redirectTo') || '/dashboard';

    const supabase = await supabaseServer();

    if (code) {
        const {
            data: { user },
            error: exchangeError,
        } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
            console.error('Error exchanging auth code:', exchangeError);
            return NextResponse.redirect(new URL('/auth/login?error=exchange_failed', request.url));
        }

        // Update missing name in Auth table
        if (user && !user.user_metadata?.name) {
            const name = requestUrl.searchParams.get('name');
            if (name) await supabase.auth.updateUser({ data: { name } });
        }

        // Sync Auth User to Public User table
        if (user) {
            const name = user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Anonymous';
            const email = user.email ?? '';
            const userId = user.id;

            const existing = await db.query.users.findFirst({
                where: eq(users.id, userId),
            });

            if (!existing) {
                await db.insert(users).values({
                    id: userId,
                    name,
                    email,
                });
            }
        }
    }

    return NextResponse.redirect(new URL(redirectTo, request.url));
}
