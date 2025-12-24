import { NextResponse } from 'next/server';
import { supabaseServer } from '@/supabase/server';
import { db } from '@/lib/db/drizzle';
import { eq } from 'drizzle-orm';
import { stripe, PLAN_CONFIG, type PlanKey } from '@/lib/stripe/config';
import type { BillingDisplayData } from '@/lib/types/billing.types';
import { subscriptions, usage, limits } from '../../../../drizzle/schema';

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

        // Query user's actual limits from database
        const userLimits = await db.query.limits.findFirst({
            where: eq(limits.userId, userId),
        });

        // Use 'plan' column as source of truth (plan_key may be outdated)
        const actualPlan = (userSubscription.plan || userSubscription.planKey) as PlanKey;
        const planConfig = PLAN_CONFIG[actualPlan];

        // Use database limits if available, fallback to config
        const actualLimits = userLimits
            ? {
                  storage_bytes: Number(userLimits.storageLimitBytes),
                  forms_limit: userLimits.formsLimit,
                  submissions_limit: userLimits.submissionsLimit,
                  audio_minutes: userLimits.audioMinutesLimit,
                  video_minutes: userLimits.videoMinutesLimit,
                  video_intelligence: userLimits.videoIntelligenceEnabled,
              }
            : planConfig.limits;

        const storageUsed = Number(userUsage?.storageUsedBytes || 0);
        const storageLimit = actualLimits.storage_bytes;
        const audioUsed = Number(userUsage?.audioMinutesTranscribed || 0);
        const audioLimit = actualLimits.audio_minutes;

        const billingData: BillingDisplayData = {
            subscription: {
                plan: actualPlan,
                planName: planConfig.name,
                status: userSubscription.status,
                price: actualPlan === 'go' ? '$27' : '$69',
                nextBillingDate: userSubscription.subscriptionEnd
                    ? new Date(userSubscription.subscriptionEnd).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                      })
                    : null,
                stripeCustomerId: userSubscription.stripeCustomerId,
                videoIntelligenceEnabled: actualLimits.video_intelligence,
            },
            usage: {
                storage: {
                    used: storageUsed,
                    limit: storageLimit,
                    percentage: Math.round((storageUsed / storageLimit) * 100),
                },
                forms: {
                    used: userUsage?.formsCreatedCount || 0,
                    limit: actualLimits.forms_limit,
                    unlimited: false,
                },
                submissions: {
                    used: userUsage?.submissionsCount || 0,
                    limit: actualLimits.submissions_limit,
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

        if (actualLimits.video_intelligence) {
            const videoUsed = Number(userUsage?.videoMinutesUsed || 0);
            const videoLimit = actualLimits.video_minutes;
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
                    limit: 5,
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
