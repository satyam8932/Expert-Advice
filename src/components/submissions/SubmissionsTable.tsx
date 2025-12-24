'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, FileJson, FileCode, Calendar, CheckCircle, XCircle, Download, Eye, ChevronRight, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { SubmissionStatus, SubmissionDisplayData } from '@/lib/types/submission.types';
import DeleteSubmissionButton from './DeleteSubmissionButton';
import ProcessAIButton from './ProcessAIButton';
import { useSubmissionsStore } from '@/store/submissions.store';
import { PendingDots } from './PendingDots';
import { useFileActions } from './hooks/useFileActions';
import { VideoModal } from './components/VideoModal';
import { MarkdownModal } from './components/MarkdownModal';
import { JsonModal } from './components/JsonModal';
import { SubmissionDetails } from './components/SubmissionDetails';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';

const getStatusTheme = (status: SubmissionStatus) => {
    switch (status) {
        case 'completed':
            return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/20';
        case 'pending':
            return 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/20';
        case 'failed':
            return 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/20';
        default:
            return 'bg-muted text-muted-foreground';
    }
};

const FileActionButton = ({ icon: Icon, label, color, onDownload, onPreview, url, type, submissionData }: any) => {
    if (!url) return null;

    const generateFilename = () => {
        const firstName = submissionData?.first_name || 'Unknown';
        const lastName = submissionData?.last_name || 'User';
        const phone = submissionData?.phone;
        const email = submissionData?.email;

        let identifier = '';
        if (phone) {
            const digits = phone.replace(/\D/g, '');
            identifier = digits.slice(-4);
        } else if (email) {
            identifier = email.split('@')[0];
        } else {
            identifier = 'nocontact';
        }

        const extension = type === 'markdown' ? 'md' : type === 'json' ? 'json' : 'mp4';
        return `${firstName}-${lastName}-${identifier}.${extension}`;
    };

    const filename = generateFilename();

    return (
        <div className="flex items-center gap-1 p-0.5 sm:gap-1.5 sm:p-1 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/30 transition-all group/btn">
            <div className={cn('p-1 sm:p-1.5 rounded-md bg-background shadow-sm', color)}>
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-muted-foreground pr-1 hidden xs:inline">{label}</span>
            <div className="flex gap-0.5 border-l border-border/50 pl-1 ml-auto">
                <button
                    type="button"
                    title={`Preview ${label}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onPreview(url, type);
                    }}
                    className="p-1 hover:bg-primary/10 hover:text-primary rounded transition-colors"
                >
                    <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
                <button
                    type="button"
                    title={`Download ${label}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDownload(url, filename);
                    }}
                    className="p-1 hover:bg-primary/10 hover:text-primary rounded transition-colors"
                >
                    <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
            </div>
        </div>
    );
};

export default function SubmissionsTable({ search = '' }: { search?: string }) {
    const submissions = useSubmissionsStore((s) => s.submissions as SubmissionDisplayData[]);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const { openModal, handleDownload, handlePreview, closeModal } = useFileActions();

    const filtered = useMemo(() => {
        const query = search.toLowerCase();
        return submissions.filter((s) => `${s.data.first_name} ${s.data.last_name}`.toLowerCase().includes(query) || s.data.email?.toLowerCase().includes(query));
    }, [submissions, search]);

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <TooltipProvider>
            <Card className="border-none shadow-none bg-transparent flex flex-col flex-1 w-full">
                <CardContent className="p-0 flex flex-col flex-1 w-full">
                    {/* Added overflow-x-auto to the table wrapper to prevent page breaking */}
                    <div className="relative overflow-x-auto rounded-2xl border border-border bg-card/40 backdrop-blur-md shadow-2xl flex-1">
                        <table className="w-full text-left text-sm border-separate border-spacing-0 min-w-[600px] sm:min-w-full">
                            <thead>
                                <tr className="bg-muted/40">
                                    <th className="px-4 sm:px-6 py-4 sm:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 border-b border-border hidden lg:table-cell">Identity</th>
                                    <th className="px-4 sm:px-6 py-4 sm:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 border-b border-border">Customer Profile</th>
                                    <th className="px-4 sm:px-6 py-4 sm:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 border-b border-border">Status</th>
                                    <th className="px-4 sm:px-6 py-4 sm:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 border-b border-border hidden sm:table-cell text-center">Timeline</th>
                                    <th className="px-4 sm:px-6 py-4 sm:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 border-b border-border hidden md:table-cell">Resource Assets</th>
                                    <th className="px-4 sm:px-6 py-4 sm:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 border-b border-border text-left">Details</th>
                                    <th className="px-4 sm:px-6 py-4 sm:py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 border-b border-border text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-border/40">
                                {filtered.map((sub) => {
                                    const expanded = expandedRows.has(sub.id);
                                    const name = `${sub.data.first_name || ''} ${sub.data.last_name || ''}`.trim() || 'Anonymous';

                                    return (
                                        <React.Fragment key={sub.id}>
                                            <tr className={cn('group hover:bg-primary/[0.02] transition-all duration-300 cursor-pointer', expanded && 'bg-primary/[0.03]')} onClick={() => toggleRow(sub.id)}>
                                                <td className="px-4 sm:px-6 py-4 sm:py-5 hidden lg:table-cell">
                                                    <Badge variant="secondary" className="font-mono text-[9px] opacity-60">
                                                        #{sub.id.slice(0, 6)}
                                                    </Badge>
                                                </td>

                                                {/* Optimized Profile Cell with truncation */}
                                                <td className="px-4 sm:px-6 py-4 sm:py-5 max-w-[150px] sm:max-w-none">
                                                    <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
                                                        <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-xl bg-gradient-to-tr from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center text-[10px] sm:text-xs font-bold text-primary shadow-sm">
                                                            {name
                                                                .split(' ')
                                                                .map((n) => n[0])
                                                                .join('')}
                                                        </div>
                                                        <div className="flex flex-col gap-0.5 min-w-0 overflow-hidden">
                                                            <span className="font-bold text-foreground truncate block">{name}</span>
                                                            <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate block">{sub.data.email || 'No email provided'}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 sm:px-6 py-4 sm:py-5">
                                                    <div className={cn('inline-flex items-center gap-1.5 sm:gap-2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm', getStatusTheme(sub.status))}>
                                                        {sub.status === 'pending' ? <PendingDots /> : <CheckCircle className="w-3 h-3" />}
                                                        <span className="leading-none">{sub.status}</span>
                                                    </div>
                                                </td>

                                                <td className="px-4 sm:px-6 py-4 sm:py-5 hidden sm:table-cell">
                                                    <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                                        <div className="flex items-center gap-1.5 text-foreground/80">
                                                            <Calendar className="w-3.5 h-3.5 opacity-40" />
                                                            {format(new Date(sub.createdAt), 'MMM d, yy')}
                                                        </div>
                                                        <span className="text-[10px] opacity-60">{format(new Date(sub.createdAt), 'HH:mm a')}</span>
                                                    </div>
                                                </td>

                                                <td className="px-4 sm:px-6 py-4 sm:py-5 hidden md:table-cell">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        <FileActionButton label="Video" type="video" icon={Video} color="text-indigo-500" url={sub.videoUrl} onDownload={handleDownload} onPreview={handlePreview} submissionData={sub.data} />
                                                        <FileActionButton label="Data" type="json" icon={FileJson} color="text-emerald-500" url={sub.jsonResultUrl} onDownload={handleDownload} onPreview={handlePreview} submissionData={sub.data} />
                                                        <FileActionButton label="Doc" type="markdown" icon={FileText} color="text-sky-500" url={sub.markdownUrl} onDownload={handleDownload} onPreview={handlePreview} submissionData={sub.data} />
                                                    </div>
                                                </td>

                                                <td className="px-4 sm:px-6 py-4 sm:py-5 text-left">
                                                    <div className={cn('inline-flex p-1 rounded-full border transition-all duration-500 bg-background shadow-sm sm:p-1.5', expanded ? 'rotate-90 border-primary text-primary' : 'text-muted-foreground')}>
                                                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    </div>
                                                </td>

                                                <td className="px-4 sm:px-6 py-4 sm:py-5 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex justify-end items-center gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                        {!sub.videoSummary && <ProcessAIButton submissionId={sub.id} />}
                                                        <DeleteSubmissionButton submissionId={sub.id} videoUrl={sub.videoUrl} jsonResultUrl={sub.jsonResultUrl} markdownUrl={sub.markdownUrl} />
                                                    </div>
                                                </td>
                                            </tr>

                                            {expanded && (
                                                <tr className="bg-primary/[0.01]">
                                                    <td colSpan={7} className="px-4 sm:px-8 py-6 sm:py-10 border-b border-border/50">
                                                        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                                            <SubmissionDetails data={sub.data} transcript={sub.transcript} summary={sub.summary} videoSummary={sub.videoSummary} errorMessage={sub.errorMessage} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <VideoModal url={openModal?.url || ''} isOpen={openModal?.type === 'video'} onClose={closeModal} />
            <MarkdownModal url={openModal?.url || ''} isOpen={openModal?.type === 'markdown'} onClose={closeModal} />
            <JsonModal url={openModal?.url || ''} isOpen={openModal?.type === 'json'} onClose={closeModal} />
        </TooltipProvider>
    );
}
