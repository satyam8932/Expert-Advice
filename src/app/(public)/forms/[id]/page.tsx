import CollectionForm from '@/components/(public)/forms/CollectionForm';
import { supabaseServer } from '@/supabase/server';
import { StatusMessage } from '@/components/(public)/forms/StatusMessage';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Ghost } from 'lucide-react';

const HomeButton = (
    <Link href="/" className="w-full block mt-6">
        <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 h-11 transition-all active:scale-95">Return to Homepage</Button>
    </Link>
);

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 relative selection:bg-indigo-500/30 overflow-x-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-3xl animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center mb-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 backdrop-blur-sm">
                        <Ghost className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h2 className="text-lg font-bold tracking-tight">
                        <span className='text-muted-foreground font-light'>Powered by</span>{' '}
                        Advice<span className="text-indigo-500">Expert</span>.io
                    </h2>
                </div>
            </div>

            {children}

            <div className="mt-8 text-center">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                    Powered by <span className="text-foreground/70 font-medium">AdviceExpert.io</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <Link href="/privacy" className="hover:text-foreground transition-colors">
                        Privacy
                    </Link>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <Link href="/terms" className="hover:text-foreground transition-colors">
                        Terms
                    </Link>
                </p>
            </div>
        </div>
    </div>
);

export default async function SubmissionFormPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const formId = resolvedParams.id;

    const supabase = await supabaseServer();
    const { data, error } = await supabase.from('forms').select('status, user_id').eq('id', formId).single();

    if (error) {
        const isNotFound = error.code === '22P02';
        return (
            <PageWrapper>
                <StatusMessage
                    type={isNotFound ? 'not-found' : 'error'}
                    heading={isNotFound ? 'Form Not Found' : 'System Error'}
                    content={isNotFound ? "The form you are looking for doesn't exist or has been removed." : 'We encountered an issue loading this form. Please try again later.'}
                    action={HomeButton}
                />
            </PageWrapper>
        );
    }

    if (data.status === 'completed') {
        return (
            <PageWrapper>
                <StatusMessage type="not-found" heading="Submissions Closed" content="This form is no longer accepting new responses. Thank you for your interest." action={HomeButton} />
            </PageWrapper>
        );
    }

    const { checkQuota } = await import('@/lib/quota/checker');
    const quotaCheck = await checkQuota(data.user_id, 'submissions');

    if (!quotaCheck.allowed) {
        return (
            <PageWrapper>
                <StatusMessage type="not-found" heading="Form Not Accepting Responses" content="This form has reached its submission limit. The form owner needs to upgrade their plan to continue accepting responses." action={HomeButton} />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div className="backdrop-blur-md w-full">
                <CollectionForm formId={formId} />
            </div>
        </PageWrapper>
    );
}
