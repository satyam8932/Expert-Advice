import { NextResponse } from 'next/server';
import { supabaseServer } from '@/supabase/server';
import { db } from '@/lib/db/drizzle';
import { eq } from 'drizzle-orm';
import { stripe, PLAN_CONFIG, type PlanKey } from '@/lib/stripe/config';
import type { BillingDisplayData } from '@/lib/types/billing.types';
import { subscriptions, usage } from '../../../../drizzle/schema';

export async function GET() {
    try {
        const supabase = await supabaseServer();
        const { data: user } = await supabase.auth.getUser();
        const userId = user?.user?.id;
        if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

        const userSubscription = await db.query.subscriptions.findFirst({
            where: eq(subscriptions.userId, userId),
        });

        if (!userSubscription) {
            return NextResponse.json<BillingDisplayData>({
                subscription: null,
                usage: null,
                invoices: [],
            });
        }

        const userUsage = await db.query.usage.findFirst({
            where: eq(usage.userId, userId),
        });

        const planConfig = PLAN_CONFIG[userSubscription.planKey as PlanKey];
        const limits = planConfig.limits;

        const storageUsed = Number(userUsage?.storageUsedBytes || 0);
        const storageLimit = limits.storage_bytes;
        const audioUsed = Number(userUsage?.audioMinutesTranscribed || 0);
        const audioLimit = limits.audio_minutes;

        const billingData: BillingDisplayData = {
            subscription: {
                plan: userSubscription.planKey as PlanKey,
                planName: planConfig.name,
                status: userSubscription.status,
                price: userSubscription.planKey === 'go' ? '$27' : '$69',
                nextBillingDate: userSubscription.subscriptionEnd
                    ? new Date(userSubscription.subscriptionEnd).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                    })
                    : null,
                stripeCustomerId: userSubscription.stripeCustomerId,
            },
            usage: {
                storage: {
                    used: storageUsed,
                    limit: storageLimit,
                    percentage: Math.round((storageUsed / storageLimit) * 100),
                },
                forms: {
                    used: userUsage?.formsCreatedCount || 0,
                    limit: limits.forms_limit,
                    unlimited: false,
                },
                submissions: {
                    used: userUsage?.submissionsCount || 0,
                    limit: limits.submissions_limit,
                    unlimited: false,
                },
                audioMinutes: {
                    used: audioUsed,
                    limit: audioLimit,
                    percentage: Math.round((audioUsed / audioLimit) * 100),
                },
            },
            invoices: [],
        };

        if ((limits as any).video_intelligence) {
            const videoUsed = userUsage?.videoMinutesUsed || 0;
            const videoLimit = (limits as any).video_minutes;
            billingData.usage!.videoMinutes = {
                used: videoUsed,
                limit: videoLimit,
                percentage: Math.round((videoUsed / videoLimit) * 100),
            };
        }

        if (userSubscription.stripeCustomerId) {
            try {
                const stripeInvoices = await stripe.invoices.list({
                    customer: userSubscription.stripeCustomerId,
                    limit: 10,
                });

                billingData.invoices = stripeInvoices.data.map((invoice) => ({
                    id: invoice.id,
                    date: new Date(invoice.created * 1000).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    }),
                    amount: `$${(invoice.amount_paid / 100).toFixed(2)}`,
                    status: invoice.status as any,
                    pdfUrl: invoice.invoice_pdf || null,
                }));
            } catch (error) {
                console.error('Failed to fetch invoices from Stripe:', error);
            }
        }

        return NextResponse.json<BillingDisplayData>(billingData);
    } catch (error: any) {
        console.error('Billing API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
