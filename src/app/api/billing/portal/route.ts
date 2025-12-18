import { NextResponse } from 'next/server';
import { supabaseServer } from '@/supabase/server';
import { db } from '@/lib/db/drizzle';
import { subscriptions } from '../../../../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/stripe/config';

export async function POST() {
    try {
        const supabase = await supabaseServer();
        const { data: user } = await supabase.auth.getUser();
        const userId = user?.user?.id;
        if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

        const userSubscription = await db.query.subscriptions.findFirst({
            where: eq(subscriptions.userId, userId),
        });

        if (!userSubscription?.stripeCustomerId) {
            return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: userSubscription.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billings`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Billing portal error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
