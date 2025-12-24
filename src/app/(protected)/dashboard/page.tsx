import DashboardWrapper from '@/components/dashboard/DashboardWrapper';
import { supabaseServer } from '@/supabase/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/drizzle';
import { users, subscriptions, forms, submissions, usage, limits } from '../../../../drizzle/schema';
import { eq, desc } from 'drizzle-orm';

export const metadata = {
    title: 'Dashboard | AdviceExpert.io',
};

async function getDashboardData(userId: string) {
    // Fetch all data in parallel for performance
    const [userSubscription, userUsage, userLimits, formsData, submissionsData, recentForms, recentSubmissions] = await Promise.all([
        // Get subscription
        db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1),

        // Get usage
        db.select().from(usage).where(eq(usage.userId, userId)).limit(1),

        // Get limits
        db.select().from(limits).where(eq(limits.userId, userId)).limit(1),

        // Get forms count
        db.select().from(forms).where(eq(forms.userId, userId)),

        // Get submissions count
        db.select().from(submissions).where(eq(submissions.userId, userId)),

        // Get last 5 forms
        db.select().from(forms).where(eq(forms.userId, userId)).orderBy(desc(forms.createdAt)).limit(5),

        // Get last 5 submissions
        db
            .select({
                id: submissions.id,
                formId: submissions.formId,
                status: submissions.status,
                createdAt: submissions.createdAt,
                formName: forms.name,
            })
            .from(submissions)
            .leftJoin(forms, eq(submissions.formId, forms.id))
            .where(eq(submissions.userId, userId))
            .orderBy(desc(submissions.createdAt))
            .limit(5),
    ]);

    const subscription = userSubscription[0];
    const usageData = userUsage[0];
    const limitsData = userLimits[0];

    // Calculate storage usage percentage
    const storageUsedGB = usageData ? Number(usageData.storageUsedBytes) / (1024 * 1024 * 1024) : 0;
    const storageLimitGB = limitsData ? Number(limitsData.storageLimitBytes) / (1024 * 1024 * 1024) : 10;
    const storagePercentage = limitsData ? Math.round((Number(usageData?.storageUsedBytes || 0) / Number(limitsData.storageLimitBytes)) * 100) : 0;

    // Calculate audio minutes percentage
    const audioMinutesUsed = usageData ? Number(usageData.audioMinutesTranscribed) : 0;
    const audioMinutesLimit = limitsData?.audioMinutesLimit || 120;
    const audioPercentage = Math.round((audioMinutesUsed / audioMinutesLimit) * 100);

    // Calculate video minutes percentage
    const videoMinutesUsed = usageData ? Number(usageData.videoMinutesUsed) : 0;
    const videoMinutesLimit = limitsData?.videoMinutesLimit || 0;
    const videoPercentage = videoMinutesLimit > 0 ? Math.round((videoMinutesUsed / videoMinutesLimit) * 100) : 0;

    // Calculate forms usage percentage
    const formsUsed = formsData.length;
    const formsLimit = limitsData?.formsLimit || 5;
    const formsPercentage = Math.round((formsUsed / formsLimit) * 100);

    // Calculate submissions usage percentage
    const submissionsUsed = submissionsData.length;
    const submissionsLimit = limitsData?.submissionsLimit || 20;
    const submissionsPercentage = Math.round((submissionsUsed / submissionsLimit) * 100);

    return {
        stats: [
            {
                label: 'Total Forms',
                value: formsData.length.toString(),
                subtitle: `${formsPercentage}% of ${formsLimit} limit`,
                iconName: 'FileText',
                color: 'indigo' as const,
            },
            {
                label: 'Total Submissions',
                value: submissionsData.length.toString(),
                subtitle: `${submissionsPercentage}% of ${submissionsLimit} limit`,
                iconName: 'Send',
                color: 'green' as const,
            },
            {
                label: 'Storage Used',
                value: `${storageUsedGB.toFixed(2)} GB`,
                subtitle: `${storagePercentage}% of ${storageLimitGB.toFixed(0)} GB`,
                iconName: 'HardDrive',
                color: 'yellow' as const,
            },
            {
                label: 'Audio Minutes',
                value: audioMinutesUsed.toFixed(2),
                subtitle: `${audioPercentage}% of ${audioMinutesLimit} min`,
                iconName: 'Mic',
                color: 'pink' as const,
            },
            {
                label: 'Video Minutes',
                value: videoMinutesUsed.toFixed(2),
                subtitle: videoMinutesLimit > 0 ? `${videoPercentage}% of ${videoMinutesLimit} min` : 'Not available',
                iconName: 'Video',
                color: 'purple' as const,
            },
        ],
        billing: {
            plan: subscription?.plan || 'free',
            status: subscription?.status || 'active',
        },
        usage: {
            storage: {
                used: storageUsedGB,
                limit: storageLimitGB,
                percentage: storagePercentage,
            },
            forms: {
                used: formsData.length,
                limit: limitsData?.formsLimit || 5,
            },
            submissions: {
                used: submissionsData.length,
                limit: limitsData?.submissionsLimit || 20,
            },
            audioMinutes: {
                used: audioMinutesUsed,
                limit: audioMinutesLimit,
            },
        },
        recentForms: recentForms.map((form) => ({
            id: form.id,
            name: form.name,
            submissions: form.submissions,
            status: form.status,
            createdAt: form.createdAt,
        })),
        recentSubmissions: recentSubmissions.map((sub) => ({
            id: sub.id,
            formId: sub.formId,
            formName: sub.formName || 'Unknown Form',
            status: sub.status || 'pending',
            createdAt: sub.createdAt,
        })),
    };
}

export default async function DashboardPage() {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect('/auth/login');

    const data = await getDashboardData(user.id);

    return (
        <div className="bg-background text-foreground">
            <DashboardWrapper data={data} />
        </div>
    );
}
