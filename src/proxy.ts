import { NextResponse, type NextRequest } from 'next/server';
import { supabaseServer } from '@/supabase/server';
import { publicRoutes } from '@/lib/constants/publicRoutes';

export async function proxy(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = await supabaseServer();

    if (publicRoutes.some((path) => req.nextUrl.pathname.startsWith(path))) return res;

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (process.env.NODE_ENV === 'development') {
        console.log('🔐 Auth check:', { user: user?.email, error: error?.message });
    }

    if (!user) {
        const redirectUrl = new URL('/auth/login', req.url);
        redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
    }

    return res;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|auth|login|signup|api/public).*)'],
};
