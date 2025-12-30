import { supabaseServer } from '@/supabase/server';
import { supabaseAdmin } from '@/supabase/admin';
import { NextResponse } from 'next/server';
import { checkQuota } from '@/lib/quota/checker';
import { incrementSubmissions } from '@/lib/usage/tracker';

export async function POST(req: Request) {
    try {
        const supabase = await supabaseServer();
        const body = await req.json();

        const { formId, firstName, lastName, zipcode, helpType, email, phone, countryCode, tempVideoPath } = body;

        // Validate required fields
        if (!formId || !firstName || !lastName || !zipcode || !helpType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        if (!tempVideoPath) {
            return NextResponse.json({ error: 'Video path is required' }, { status: 400 });
        }
        // Validate at least one contact method is provided
        if (!email && !phone) {
            return NextResponse.json({ error: 'At least one contact method (email or phone) is required' }, { status: 400 });
        }

        const { data: form } = await supabase.from('forms').select('user_id').eq('id', formId).single();
        if (!form) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        const userId = form.user_id;
        const quotaCheck = await checkQuota(userId, 'submissions');
        if (!quotaCheck.allowed) {
            return NextResponse.json(
                {
                    error: quotaCheck.message,
                    requiresUpgrade: quotaCheck.requiresUpgrade,
                    currentUsage: quotaCheck.current,
                    limit: quotaCheck.limit,
                },
                { status: 403 }
            );
        }

        const fileSubmissionId = crypto.randomUUID();
        const fileExt = tempVideoPath.split('.').pop();
        const permanentPath = `${formId}/${fileSubmissionId}/video.${fileExt}`;

        const tempBucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_TEMP_BUCKET!;
        const prodBucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!;

        const { error: moveError } = await supabaseAdmin.storage.from(tempBucket).move(tempVideoPath, permanentPath, {
            destinationBucket: prodBucket,
        });

        if (moveError) {
            console.error('Failed to move file from temp to production bucket:', moveError);
            return NextResponse.json({ error: 'Failed to process video file: ' + moveError.message }, { status: 500 });
        }

        const {
            data: { publicUrl: videoUrl },
        } = supabaseAdmin.storage.from(prodBucket).getPublicUrl(permanentPath);

        const submissionData = {
            first_name: firstName,
            last_name: lastName,
            zipcode,
            help_type: helpType,
            email: email || null,
            phone: phone || null,
            country_code: phone ? countryCode : null,
        };

        const { data: submission, error: submissionError } = await supabase
            .from('submissions')
            .insert([
                {
                    user_id: userId,
                    form_id: formId,
                    files_submission_id: fileSubmissionId,
                    data: submissionData,
                    video_url: videoUrl,
                    video_url_path: permanentPath,
                    status: 'pending',
                },
            ])
            .select()
            .single();

        if (submissionError) {
            console.error('Submission error:', submissionError);
            return NextResponse.json({ error: 'Failed to save submission: ' + submissionError.message }, { status: 500 });
        }

        try {
            await fetch(process.env.N8N_TRANSCRIBE_URL as string, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    submissionId: submission.id,
                    videoUrl,
                    userId,
                    formId,
                    fileSubmissionId,
                    data: submissionData,
                }),
            });
        } catch (err) {
            console.error('Failed to trigger transcription workflow:', err);
        }

        // Increment Submission Usage and Form Submission Count
        await incrementSubmissions(userId);
        const { error: updateError } = await supabase.rpc('increment_form_submissions', { form_id: formId });

        if (updateError) {
            console.warn('Failed to increment form submissions count:', updateError);
        }

        return NextResponse.json({ success: true, submission }, { status: 201 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const supabase = await supabaseServer();
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        let ids: string[] | undefined;
        try {
            const body = await req.json().catch(() => ({}));
            if (Array.isArray(body?.ids)) ids = body.ids;
        } catch {}

        if (!id && (!ids || !ids.length)) {
            return NextResponse.json({ error: 'No submission ID(s) provided' }, { status: 400 });
        }

        const { data: user } = await supabase.auth.getUser();
        const userId = user?.user?.id;
        if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

        const deleteIds = ids?.length ? ids : [id!];

        // Fetch submissions with file paths and sizes
        const { data: submissions } = await supabase.from('submissions').select('id, video_url_path, json_result_url_path, markdown_url_path, files_size').in('id', deleteIds).eq('user_id', userId);

        if (!submissions || submissions.length === 0) {
            return NextResponse.json({ error: 'No submissions found' }, { status: 404 });
        }

        const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET;
        if (!bucketName) {
            return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
        }

        let totalBytes = 0;
        const filesToDelete: string[] = [];

        // Collect all file paths and calculate total storage to free
        for (const sub of submissions) {
            const paths = [sub.video_url_path, sub.json_result_url_path, sub.markdown_url_path].filter(Boolean) as string[];

            // Add all file paths to deletion list
            filesToDelete.push(...paths);

            // Add the stored file size to total bytes
            const fileSize = sub.files_size || 0;
            totalBytes += fileSize;

            console.log('[Storage Delete] Submission:', sub.id, '- Files:', paths.length, '- Size:', fileSize, 'bytes');
        }

        // Delete files from storage
        if (filesToDelete.length > 0) {
            const { error: storageError } = await supabase.storage.from(bucketName).remove(filesToDelete);
            if (storageError) {
                console.error('[Storage Delete] Failed to delete files:', storageError);
            } else {
                console.log('[Storage Delete] ✓ Deleted', filesToDelete.length, 'files from storage');
            }
        }

        // Delete submission records from database
        const { error } = await supabase.from('submissions').delete().in('id', deleteIds).eq('user_id', userId);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        // Decrement storage usage
        if (totalBytes > 0) {
            const { decrementStorage } = await import('@/lib/usage/tracker');
            await decrementStorage(userId, totalBytes);
            console.log('[Storage Delete] ✓ Decremented', totalBytes, 'bytes for user:', userId);
        }

        return NextResponse.json({
            success: true,
            deleted: deleteIds.length,
            filesDeleted: filesToDelete.length,
            storageFreed: totalBytes,
        });
    } catch (error: any) {
        console.error('Delete submissions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
