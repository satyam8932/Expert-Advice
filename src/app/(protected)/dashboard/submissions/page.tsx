import SubmissionWrapper from '@/components/submissions/SubmissionWrapper';
import { SubmissionDisplayData, SubmissionRow } from '@/lib/types/submission.types';
import { supabaseServer } from '@/supabase/server';

export const metadata = {
    title: 'Submissions | AdviceExpert.io',
};

export default async function SubmissionsPage() {
    const supabase = await supabaseServer();
    const { data: submissionsRaw } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });

    const submissions: SubmissionDisplayData[] = (submissionsRaw || []).map((row: SubmissionRow) => ({
        id: row.id,
        formId: row.form_id,
        userId: row.user_id,
        data: row.data,
        videoUrl: row.video_url,
        transcript: row.transcript,
        jsonResultUrl: row.json_result_url,
        markdownUrl: row.markdown_url,
        status: row.status,
        errorMessage: row.error_message,
        processedAt: row.processed_at,
        createdAt: row.created_at,
    }));

    return <SubmissionWrapper initialSubmissions={submissions} />;
}
