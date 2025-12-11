import { Code2, ScanLine, Mic, LayoutGrid, Check, FileText } from 'lucide-react';
import Link from 'next/link';

export function FeatureBento() {
    return (
        <section className="container mx-auto px-4 py-20" id="features">
            <div className="mb-12 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-b from-foreground to-muted-foreground mb-4">The Integrated AI Intelligence Layer</h2>
                <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">We turn raw customer video submissions into actionable, structured data instantly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(250px, auto)]">
                {/* Large Card (1): Structured Data & Reporting */}
                <div className="md:col-span-2 group relative overflow-hidden rounded-xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:border-indigo-500/30 flex flex-col justify-between">
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-linear-to-l from-indigo-500/10 to-transparent pointer-events-none" />
                    <div>
                        <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Code2 className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">Machine-Ready Data Output</h3>
                        <p className="mt-2 text-muted-foreground max-w-lg text-sm leading-relaxed">
                            Every video is processed to generate structured data files, available directly in your dashboard: clean <strong className="text-foreground">JSON files</strong> for database import and <strong className="text-foreground">Markdown summaries</strong> for easy reporting.
                        </p>
                    </div>
                    {/* Decorative Output Tags */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        <span className="text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 rounded-full border border-indigo-500/20 font-medium">JSON Data</span>
                        <span className="text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 rounded-full border border-indigo-500/20 font-medium">Markdown Summary</span>
                    </div>
                </div>

                {/* Tall Card (2): Visual Intelligence & Measurement */}
                <div className="row-span-2 group relative overflow-hidden rounded-xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:border-pink-500/30 flex flex-col justify-start">
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-linear-to-l from-pink-500/10 to-transparent pointer-events-none" />
                    <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <ScanLine className="h-6 w-6 text-pink-500 dark:text-pink-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Precision Visual Analysis</h3>
                    <p className="mt-2 text-muted-foreground text-sm leading-relaxed">Our specialized AI models analyze video frames to identify objects, measure dimensions, and detect specific types of damage automatically.</p>
                    <div className="mt-6 space-y-4">
                        <div className="flex items-start gap-3 text-sm text-muted-foreground">
                            <div className="mt-0.5 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-green-500 dark:text-green-400" />
                            </div>
                            <span>Object Detection & Sizing (e.g., furniture, vehicles)</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-muted-foreground">
                            <div className="mt-0.5 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-green-500 dark:text-green-400" />
                            </div>
                            <span>Plant/Crop Health & Disease Analysis</span>
                        </div>
                    </div>
                </div>

                {/* Small Card (3): Audio Transcription & Summarization */}
                <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:border-blue-500/30">
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-linear-to-l from-blue-500/10 to-transparent pointer-events-none" />
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Mic className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Instant Transcription & Summary</h3>
                    <p className="mt-2 text-muted-foreground text-sm leading-relaxed">Get accurate text transcripts from customer video audio, plus an AI-generated summary of the core request.</p>
                </div>

                {/* Small Card (4): Dashboard Management & Forms (Replaces API/Webhook) */}
                <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:border-green-500/30">
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-linear-to-l from-green-500/10 to-transparent pointer-events-none" />
                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <LayoutGrid className="h-6 w-6 text-green-500 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Form & Data Management</h3>
                    <p className="mt-2 text-muted-foreground text-sm leading-relaxed">Create unlimited intake forms and manage all video submissions, processed data, and billing history directly in your secured dashboard.</p>
                </div>
            </div>
        </section>
    );
}
