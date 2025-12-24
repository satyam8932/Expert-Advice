// Raw submission data from database
export interface SubmissionRow {
    id: string;
    user_id: string;
    form_id: string;
    data: Record<string, any>;
    video_url: string | null;
    transcript: string | null;
    summary: string | null;
    video_summary: string | null;
    json_result_url: string | null;
    markdown_url: string | null;
    status: SubmissionStatus;
    error_message: string | null;
    processed_at: string | null;
    created_at: string;
}

// Display data for UI
export interface SubmissionDisplayData {
    id: string;
    formId: string;
    userId: string;
    data: Record<string, any>;
    videoUrl: string | null;
    transcript: string | null;
    summary: string | null;
    videoSummary: string | null;
    jsonResultUrl: string | null;
    markdownUrl: string | null;
    status: SubmissionStatus;
    errorMessage: string | null;
    processedAt: string | null;
    createdAt: string;
}

export type SubmissionStatus = 'pending' | 'completed' | 'failed';
