import { supabaseServer } from '@/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const supabase = await supabaseServer();
        const body = await req.json();

        const { formId, firstName, lastName, zipcode, helpType, contactMethod, email, phone, countryCode, videoUrl } = body;

        if (!formId || !firstName || !lastName || !zipcode || !helpType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!videoUrl) {
            return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
        }

        const { data: form } = await supabase.from('forms').select('user_id').eq('id', formId).single();

        if (!form) {
            return NextResponse.json({ error: 'Form not found' }, { status: 404 });
        }

        const userId = form.user_id;

        const submissionData = {
            first_name: firstName,
            last_name: lastName,
            zipcode,
            help_type: helpType,
            contact_method: contactMethod,
            email: contactMethod === 'email' ? email : null,
            phone: contactMethod === 'phone' ? phone : null,
            country_code: contactMethod === 'phone' ? countryCode : null,
        };

        const { data: submission, error: submissionError } = await supabase
            .from('submissions')
            .insert([
                {
                    user_id: userId,
                    form_id: formId,
                    data: submissionData,
                    video_url: videoUrl,
                    status: 'pending',
                },
            ])
            .select()
            .single();

        if (submissionError) {
            console.error('Submission error:', submissionError);
            return NextResponse.json({ error: 'Failed to save submission: ' + submissionError.message }, { status: 500 });
        }

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
