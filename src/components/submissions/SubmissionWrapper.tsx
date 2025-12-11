'use client';

import { useState, useEffect } from 'react';
import SubmissionsTable from './SubmissionsTable';
import { Search, Filter, Download, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SubmissionDisplayData } from '@/lib/types/submission.types';
import { useSubmissionsStore } from '@/store/submissions.store';

interface SubmissionWrapperProps {
    initialSubmissions: SubmissionDisplayData[];
}

export default function SubmissionWrapper({ initialSubmissions }: SubmissionWrapperProps) {
    const [search, setSearch] = useState('');
    const setSubmissions = useSubmissionsStore((s) => s.setSubmissions);

    useEffect(() => {
        setSubmissions(initialSubmissions);
    }, [initialSubmissions, setSubmissions]);

    return (
        <div className="flex flex-col p-2 gap-8 overflow-visible">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
                {/* Title and Subtitle */}
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-foreground to-muted-foreground">Submissions</h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        <Send className="w-4 h-4 text-gray-600" />
                        Manage and analyze your incoming video forms
                    </p>
                </div>

                {/* Search and Action Buttons (Stacks below title on mobile, inline on MD+) */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-73">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <Input
                            placeholder="Search customer, email, or status..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 bg-muted border border-border rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-muted-foreground text-foreground w-full"
                        />
                    </div>

                    {/* Responsive Action Buttons (Hidden on mobile for space, use dropdown if needed) */}
                    {/* <div className="hidden md:flex items-center gap-3">
                        <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-gray-300 text-sm">
                            <Filter className="w-4 h-4 mr-2" /> Filter
                        </Button>
                        <Button className="bg-white text-black hover:bg-gray-200 border-none text-sm">
                            <Download className="w-4 h-4 mr-2" /> Export
                        </Button>
                    </div> */}
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <SubmissionsTable search={search} />
            </div>
        </div>
    );
}
