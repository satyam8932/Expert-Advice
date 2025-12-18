import { NextResponse } from 'next/server';
import { supabaseServer } from '@/supabase/server';
import { stripe, PLAN_CONFIG, type PlanKey } from '@/lib/stripe/config';

export async function POST(req: Request) {
    try {
        const { planKey, interval = 'monthly' } = await req.json();

        const supabase = await supabaseServer();
        const { data: user } = await supabase.auth.getUser();
        const userId = user?.user?.id;
        if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

        const plan = PLAN_CONFIG[planKey as PlanKey];
        if (!plan) {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        const priceId = interval === 'yearly' ? plan.stripePriceId.yearly : plan.stripePriceId.monthly;

        const session = await stripe.checkout.sessions.create({
            customer_email: user.user?.email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billings`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billings`,
            metadata: {
                userId: userId,
                planKey: plan.key,
                interval: interval,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
