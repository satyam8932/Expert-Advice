import Link from 'next/link';
import { TriangleAlert, ArrowLeft, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* --- Background Effect --- */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 text-center max-w-md w-full">
                {/* --- Icon and Code --- */}
                <div className="flex flex-col items-center mb-6">
                    <TriangleAlert className="w-16 h-16 text-red-500/80 mb-2 animate-bounce-slow" />
                    <h1 className="text-8xl font-extrabold text-foreground tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">404</h1>
                    <p className="text-xl font-medium text-red-600 dark:text-red-400 mt-2">Page Not Found</p>
                </div>

                {/* --- Separator Line --- */}
                <div className="w-24 h-1 mx-auto bg-indigo-600 rounded-full mb-8" />

                {/* --- Main Message --- */}
                <p className="text-lg text-muted-foreground mb-8">Uh oh! We couldn't find the page you were looking for. It might have been moved or doesn't exist.</p>

                {/* --- Action Buttons --- */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/dashboard" className="w-full sm:w-auto">
                        <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                        </Button>
                    </Link>

                    <Link href="/" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full h-12 bg-muted border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                            <Ghost className="w-4 h-4 mr-2" /> Go to Homepage
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
