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

    // Helper function to format storage size
    const formatStorageSize = (bytes: number) => {
        const gb = bytes / (1024 * 1024 * 1024);
        const mb = bytes / (1024 * 1024);

        // If less than 1 GB, show in MB
        if (gb < 1) {
            return {
                value: mb.toFixed(2),
                unit: 'MB',
            };
        }
        // Otherwise show in GB
        return {
            value: gb.toFixed(2),
            unit: 'GB',
        };
    };

    // Calculate storage usage
    const storageUsedBytes = usageData ? Number(usageData.storageUsedBytes) : 0;
    const storageLimitBytes = limitsData ? Number(limitsData.storageLimitBytes) : 10737418240; // 10GB default
    const storagePercentage = Math.round((storageUsedBytes / storageLimitBytes) * 100);

    const storageUsed = formatStorageSize(storageUsedBytes);
    const storageLimit = formatStorageSize(storageLimitBytes);

    // Calculate audio minutes percentage
    const audioMinutesUsed = usageData ? Number(usageData.audioMinutesTranscribed) : 0;
    const audioMinutesLimit = limitsData?.audioMinutesLimit || 120;
    const audioPercentage = Math.round((audioMinutesUsed / audioMinutesLimit) * 100);

    // Calculate video minutes percentage
    const videoMinutesUsed = usageData ? Number(usageData.videoMinutesUsed) : 0;
    const videoMinutesLimit = limitsData?.videoMinutesLimit || 0;
    const videoPercentage = videoMinutesLimit > 0 ? Math.round((videoMinutesUsed / videoMinutesLimit) * 100) : 0;

    // Calculate forms usage percentage (cumulative from usage table)
    const formsUsed = usageData?.formsCreatedCount || 0;
    const formsLimit = limitsData?.formsLimit || 5;
    const formsPercentage = Math.round((formsUsed / formsLimit) * 100);

    // Calculate submissions usage percentage (cumulative from usage table)
    const submissionsUsed = usageData?.submissionsCount || 0;
    const submissionsLimit = limitsData?.submissionsLimit || 20;
    const submissionsPercentage = Math.round((submissionsUsed / submissionsLimit) * 100);

    return {
        stats: [
            {
                label: 'Forms Created',
                value: formsUsed.toString(),
                subtitle: `${formsPercentage}% of ${formsLimit} limit • ${formsData.length} active`,
                iconName: 'FileText',
                color: 'indigo' as const,
            },
            {
                label: 'Submissions Created',
                value: submissionsUsed.toString(),
                subtitle: `${submissionsPercentage}% of ${submissionsLimit} limit • ${submissionsData.length} active`,
                iconName: 'Send',
                color: 'green' as const,
            },
            {
                label: 'Storage Used',
                value: `${storageUsed.value} ${storageUsed.unit}`,
                subtitle: `${storagePercentage}% of ${storageLimit.value} ${storageLimit.unit}`,
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
                used: storageUsedBytes / (1024 * 1024 * 1024), // Convert to GB for compatibility
                limit: storageLimitBytes / (1024 * 1024 * 1024), // Convert to GB for compatibility
                percentage: storagePercentage,
            },
            forms: {
                used: formsUsed,
                limit: limitsData?.formsLimit || 5,
            },
            submissions: {
                used: submissionsUsed,
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
