import { ArrowRight, PlayCircle, FileJson, ScanLine, BadgeQuestionMark } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-4">
            {/* Background Glow (Always centered, responsive blur area) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1200px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />

            <div className="container mx-auto relative z-10 text-center">
                {/* Badge (Mobile Friendly) */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-400 mb-8 hover:bg-white/10 transition-colors cursor-default">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    v2.0 Now Available: Object Detection
                </div>

                {/* Headline (Responsive Sizing) */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/60 mb-6 max-w-4xl mx-auto leading-tight">
                    Win more jobs.
                    <br />
                    Close deals faster.
                    <br />
                    <span className="text-indigo-600 dark:text-indigo-400">Boost profitability.</span>
                </h1>

                <p className="text-base md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">AI-assisted customer and team communication that actually works. Reduce labor costs. Remove friction for customers. Grow your business.</p>

                {/* CTA Buttons (Responsive Stack) */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <Link href="/auth/signup" className="w-full sm:w-auto h-12 px-8 rounded-lg bg-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/30">
                        Start Free Trial <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/contact" className="w-full sm:w-auto h-12 px-8 rounded-lg bg-muted border border-border text-foreground font-medium hover:bg-accent transition-all flex items-center justify-center gap-2">
                        <BadgeQuestionMark className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Questions?
                    </Link>
                </div>

                {/* Visual Mockup - Responsive Grid Layout */}
                <div className="relative mx-auto max-w-4xl rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-3 md:p-4 shadow-2xl">
                    <div className="h-6 md:h-8 flex items-center gap-2 px-3 md:px-4 border-b border-white/10 mb-3 md:mb-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/10 to-transparent rounded-xl pointer-events-none" />
                    <img src="/image.png" alt="Product Mockup showing data intake forms analyzing video and outputting structured data" className="w-full h-auto rounded-lg" />
                </div>
            </div>
        </section>
    );
}
