import ContactForm from '@/components/(public)/contact/ContactForm';
import { Ghost, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Contact Us | AdviceExpert.io',
    description: "Get in touch with us. We're here to help!",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 relative selection:bg-indigo-500/30 overflow-x-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-2xl animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center mb-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 backdrop-blur-sm">
                            <Mail className="w-8 h-8 text-indigo-500" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                                Get in <span className="text-indigo-500">Touch</span>
                            </h1>
                            <p className="text-muted-foreground text-sm sm:text-base">Have a question? We'd love to hear from you.</p>
                        </div>
                    </div>
                </div>

                <div className="backdrop-blur-md w-full">
                    <ContactForm />
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
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
}
