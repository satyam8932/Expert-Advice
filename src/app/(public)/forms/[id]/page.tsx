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
    <div className="min-h-screen w-full bg-[#030303] text-gray-200 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-indigo-500/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-3xl animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center mb-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                    <Ghost className="w-5 h-5 text-indigo-400" />
                    <span className="font-bold text-white tracking-tight">
                        Advice<span className="text-indigo-400">Expert</span>.io
                    </span>
                </div>
            </div>

            {children}

            <div className="mt-8 text-center">
                <p className="text-xs text-gray-600 flex items-center justify-center gap-2">
                    Powered by <span className="text-gray-400 font-medium">AdviceExpert.io</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                    <Link href="/privacy" className="hover:text-gray-400">
                        Privacy
                    </Link>
                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                    <Link href="/terms" className="hover:text-gray-400">
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
    const { data, error } = await supabase.from('forms').select('status').eq('id', formId).single();

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

    return (
        <PageWrapper>
            <div className="backdrop-blur-md overflow-hidden w-full">
                <CollectionForm formId={formId} />
            </div>
        </PageWrapper>
    );
}
