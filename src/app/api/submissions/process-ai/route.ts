import { supabaseServer } from '@/supabase/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { limits, usage, subscriptions } from '../../../../../drizzle/schema';
import { eq } from 'drizzle-orm';

interface ProcessAIRequest {
    submissionId: string;
    filesSubmissionId: string;
    videoUrl: string;
}

export async function POST(req: Request) {
    try {
        const supabase = await supabaseServer();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body: ProcessAIRequest = await req.json();
        const { submissionId, filesSubmissionId, videoUrl } = body;

        if (!submissionId || !filesSubmissionId || !videoUrl) {
            return NextResponse.json({ error: 'Missing required fields: submissionId, filesSubmissionId, videoUrl' }, { status: 400 });
        }

        const userId = user.id;

        const [userSubscription, userLimits, userUsage] = await Promise.all([
            db.query.subscriptions.findFirst({
                where: eq(subscriptions.userId, userId),
            }),
            db.query.limits.findFirst({
                where: eq(limits.userId, userId),
            }),
            db.query.usage.findFirst({
                where: eq(usage.userId, userId),
            }),
        ]);

        if (!userSubscription || userSubscription.status !== 'active') {
            return NextResponse.json(
                {
                    error: 'Active subscription required',
                    requiresUpgrade: true,
                },
                { status: 403 }
            );
        }

        if (!userLimits) {
            return NextResponse.json({ error: 'User limits not found' }, { status: 404 });
        }

        if (!userLimits.videoIntelligenceEnabled) {
            return NextResponse.json(
                {
                    error: 'Video Intelligence is not enabled on your plan. Please upgrade to Pro to access AI video processing.',
                    requiresUpgrade: true,
                    feature: 'videoIntelligence',
                },
                { status: 403 }
            );
        }

        const videoMinutesUsed = parseFloat(userUsage?.videoMinutesUsed?.toString() || '0');
        const videoMinutesLimit = userLimits.videoMinutesLimit;

        if (videoMinutesLimit !== -1 && videoMinutesUsed >= videoMinutesLimit) {
            return NextResponse.json(
                {
                    error: `You have used all your video processing credits (${videoMinutesUsed}/${videoMinutesLimit} minutes) for current billing cycle.`,
                    requiresUpgrade: false,
                    current: videoMinutesUsed,
                    limit: videoMinutesLimit,
                },
                { status: 403 }
            );
        }

        const { data: submission } = await supabase.from('submissions').select('form_id').eq('id', submissionId).eq('user_id', userId).single();

        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        const n8nWebhookUrl = process.env.N8N_VIDEO_ANALYSIS_URL;

        if (!n8nWebhookUrl) {
            console.error('[Video Analysis] N8N webhook URL not configured');
            return NextResponse.json({ error: 'Video analysis service not configured' }, { status: 500 });
        }

        try {
            const webhookResponse = await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formId: submission.form_id,
                    userId,
                    fileSubmissionId: filesSubmissionId,
                    videoUrl,
                }),
            });

            if (!webhookResponse.ok) {
                console.error('[Video Analysis] N8N webhook failed:', webhookResponse.status);
                return NextResponse.json({ error: 'Failed to start video analysis. Please try again.' }, { status: 500 });
            }

            console.log('[Video Analysis] Successfully triggered for submission:', submissionId);
        } catch (webhookError) {
            console.error('[Video Analysis] Failed to trigger N8N webhook:', webhookError);
            return NextResponse.json({ error: 'Failed to start video analysis. Please try again.' }, { status: 500 });
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Video processing started! AI insights are being generated. Check back in a few minutes to an hour depending on video length.',
                submissionId,
                estimatedTime: 'few minutes to an hour',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('AI Processing error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
