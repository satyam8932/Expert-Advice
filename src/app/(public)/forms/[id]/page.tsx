import CollectionForm from '@/components/(public)/forms/CollectionForm';
import { supabaseServer } from '@/supabase/server';
import { StatusMessage } from '@/components/(public)/forms/StatusMessage';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function SubmissionFormPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: formId } = await params;
    const supabase = await supabaseServer();
    const { data, error } = await supabase.from('forms').select('*').eq('id', formId).single();

    const wrapperClass = 'min-h-screen bg-linear-to-br from-gray-50 to-indigo-50/20 flex items-center justify-center p-6';

    const HomeButton = (
        <Link href="/" className="w-full">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Go to Homepage</Button>
        </Link>
    );

    // Error states
    if (error) {
        const isNotFound = error.code === '22P02';
        return (
            <div className={wrapperClass}>
                <StatusMessage
                    type={isNotFound ? 'not-found' : 'error'}
                    heading={isNotFound ? 'Form Not Found' : 'Something Went Wrong'}
                    content={isNotFound ? "The form you're looking for doesn't exist or may have been removed." : "We couldn't load the form. Please try again later or contact support if the problem persists."}
                    action={HomeButton}
                />
            </div>
        );
    }

    // Closed form
    if (data.status === 'completed') {
        return (
            <div className={wrapperClass}>
                <StatusMessage type="not-found" heading="Form Not Available" content="This form is no longer accepting responses." action={HomeButton} />
            </div>
        );
    }

    // Valid form
    return (
        <div className={wrapperClass}>
            <CollectionForm formId={formId} />
        </div>
    );
}
