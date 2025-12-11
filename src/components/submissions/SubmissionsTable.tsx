'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, FileJson, FileCode, AlertCircle, Calendar, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, Zap, ScrollText } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { SubmissionStatus, SubmissionDisplayData } from '@/lib/types/submission.types';
import DeleteSubmissionButton from './DeleteSubmissionButton';
import { useSubmissionsStore } from '@/store/submissions.store';
import { PendingDots } from './PendingDots';

interface SubmissionsTableProps {
    search?: string;
}

const getStatusStyle = (status: SubmissionStatus) => {
    switch (status) {
        case 'completed':
            return 'bg-green-500/10 text-green-400 border border-green-500/20';
        case 'pending':
            return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
        case 'failed':
            return 'bg-red-500/10 text-red-400 border border-red-500/20';
        default:
            return 'bg-gray-800 text-gray-400';
    }
};

const getStatusIcon = (status: SubmissionStatus) => {
    switch (status) {
        case 'completed':
            return <CheckCircle className="mr-2 h-3.5 w-3.5" />;
        case 'pending':
            return <span className="flex items-center mr-1">{PendingDots()}</span>;
        case 'failed':
            return <XCircle className="mr-2 h-3.5 w-3.5" />;
    }
};

const extractDataValue = (data: Record<string, any>, key: string) => {
    const value = data[key];
    if (value === undefined || value === null || value === '') {
        return <span className="text-gray-600 font-normal">N/A</span>;
    }
    return typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
};

export default function SubmissionsTable({ search = '' }: SubmissionsTableProps) {
    const submissions: SubmissionDisplayData[] = useSubmissionsStore((s) => s.submissions as SubmissionDisplayData[]);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const filteredSubmissions = useMemo(() => {
        if (!search) return submissions;
        const lowerSearch = search.toLowerCase();
        return submissions.filter((s) => {
            const name = (s.data.first_name || '') + ' ' + (s.data.last_name || '');
            return name.toLowerCase().includes(lowerSearch) || (s.data.email || '').toLowerCase().includes(lowerSearch) || s.status.toLowerCase().includes(lowerSearch);
        });
    }, [submissions, search]);

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    return (
        <Card className="bg-card border border-border shadow-xl flex flex-col flex-1">
            <CardContent className="p-0 flex flex-col flex-1">
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                    <table className="w-full text-left text-sm relative border-separate border-spacing-0 ">
                        <thead className="sticky top-0 z-10 bg-card">
                            <tr className="border-b border-border text-muted-foreground uppercase tracking-wider">
                                {/* Mobile hides ID, Created/Processed, Assets */}
                                <th className="px-6 py-4 text-xs font-medium bg-card border-b border-border w-[5%] hidden lg:table-cell">ID</th>
                                <th className="px-6 py-4 text-xs font-medium bg-card border-b border-border w-[25%] lg:w-[20%]">Customer</th>
                                <th className="px-6 py-4 text-xs font-medium bg-card border-b border-border w-[15%]">Status</th>
                                <th className="px-6 py-4 text-xs font-medium bg-card border-b border-border w-[20%] hidden sm:table-cell">Created / Processed</th>
                                <th className="px-6 py-4 text-xs font-medium bg-card border-b border-border w-[15%] hidden md:table-cell">Assets</th>
                                <th className="px-6 py-4 text-xs font-medium bg-card border-b border-border w-[10%] text-right">Details</th>
                                <th className="px-6 py-4 text-xs font-medium bg-card border-b border-border w-[5%] text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {filteredSubmissions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center text-muted-foreground py-12">
                                        No submissions found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredSubmissions.map((submission) => {
                                    const isExpanded = expandedRows.has(submission.id);
                                    const fullName = (submission.data.first_name || '') + ' ' + (submission.data.last_name || '');
                                    const email = extractDataValue(submission.data, 'email');

                                    return (
                                        <React.Fragment key={submission.id}>
                                            <tr className="group hover:bg-muted/50 transition-colors">
                                                <td className="px-6 py-4 hidden lg:table-cell">
                                                    <div className="font-mono text-xs text-gray-500">{submission.id.substring(0, 8)}</div>
                                                </td>

                                                <td className="px-6 py-4 max-w-sm">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-foreground capitalize">{fullName || <span className="text-muted-foreground font-normal">N/A</span>}</span>
                                                        <span className="text-xs text-gray-500">{email}</span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className={`${getStatusStyle(submission.status)} border rounded-md px-2 py-0.5 transition-colors flex w-fit items-center text-xs font-medium`}>
                                                        {getStatusIcon(submission.status)}
                                                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                                    </Badge>
                                                </td>

                                                <td className="px-6 py-4 text-xs text-gray-500 hidden sm:table-cell">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3 text-gray-600" />
                                                            {format(new Date(submission.createdAt), 'MMM dd, yyyy HH:mm')}
                                                        </span>
                                                        <span className="text-[10px] text-gray-500">Processed: {submission.processedAt ? format(new Date(submission.processedAt), 'HH:mm') : '-'}</span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 hidden md:table-cell">
                                                    <div className="flex items-center gap-4">
                                                        {/* Video */}
                                                        {submission.videoUrl ? (
                                                            <Link href={submission.videoUrl} target="_blank" className="text-indigo-400 hover:text-foreground transition-colors flex flex-col items-center group/asset" title="View Video">
                                                                <Video className="w-4 h-4" />
                                                                <span className="text-[10px] text-gray-500 group-hover/asset:text-indigo-400">Video</span>
                                                            </Link>
                                                        ) : (
                                                            <span className="flex flex-col items-center text-gray-700" title="No Video">
                                                                <Video className="w-4 h-4 opacity-50" />
                                                                <span className="text-[10px]">N/A</span>
                                                            </span>
                                                        )}

                                                        {/* JSON Result */}
                                                        {submission.jsonResultUrl ? (
                                                            <Link href={submission.jsonResultUrl} target="_blank" className="text-green-400 hover:text-foreground transition-colors flex flex-col items-center group/asset" title="View JSON Output">
                                                                <FileJson className="w-4 h-4" />
                                                                <span className="text-[10px] text-gray-500 group-hover/asset:text-green-400">JSON</span>
                                                            </Link>
                                                        ) : (
                                                            <span className="flex flex-col items-center text-gray-700" title="No JSON">
                                                                <FileJson className="w-4 h-4 opacity-50" />
                                                                <span className="text-[10px]">N/A</span>
                                                            </span>
                                                        )}

                                                        {/* Markdown */}
                                                        {submission.markdownUrl ? (
                                                            <Link href={submission.markdownUrl} target="_blank" className="text-blue-400 hover:text-foreground transition-colors flex flex-col items-center group/asset" title="View Markdown">
                                                                <FileCode className="w-4 h-4" />
                                                                <span className="text-[10px] text-gray-500 group-hover/asset:text-blue-400">MD</span>
                                                            </Link>
                                                        ) : (
                                                            <span className="flex flex-col items-center text-gray-700" title="No Markdown">
                                                                <FileCode className="w-4 h-4 opacity-50" />
                                                                <span className="text-[10px]">N/A</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => toggleRow(submission.id)} className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" aria-label="Toggle details">
                                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    </button>
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <DeleteSubmissionButton submissionId={submission.id} videoUrl={submission.videoUrl} jsonResultUrl={submission.jsonResultUrl} markdownUrl={submission.markdownUrl} />
                                                </td>
                                            </tr>

                                            {/* Expanded Row Content */}
                                            {isExpanded && (
                                                <tr className="bg-muted/50 border-b border-border animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <td colSpan={7} className="px-6 py-4">
                                                        <div className="bg-black/40 rounded-lg p-5 border border-white/10">
                                                            {/* --- Heading --- */}
                                                            <h4 className="text-xs font-semibold text-indigo-400 uppercase mb-3 flex items-center gap-2">
                                                                <Zap className="w-4 h-4" /> Structured Data & Transcript
                                                            </h4>

                                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                                {/* Form Data Fields (Takes 2/3rds space on large screen) */}
                                                                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                    {Object.entries(submission.data).map(([key, value]) => {
                                                                        const displayKey = key.replace(/_/g, ' ');
                                                                        const displayValue = extractDataValue(submission.data, key);

                                                                        return (
                                                                            <div key={key} className="flex flex-col">
                                                                                <span className="text-[11px] font-medium text-gray-500 capitalize mb-1">{displayKey}</span>
                                                                                <div className="text-sm text-foreground bg-muted px-3 py-2 rounded border border-border truncate">{displayValue}</div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>

                                                                {/* Raw Transcript Content (Takes 1/3rd space on large screen) */}
                                                                <div className="lg:col-span-1 flex flex-col">
                                                                    <span className="text-[11px] font-medium text-gray-500 capitalize mb-1 flex items-center gap-1">
                                                                        <ScrollText className="w-3 h-3" /> Raw Transcript
                                                                    </span>
                                                                    <div className="text-sm text-gray-300 bg-black/40 p-3 rounded border border-white/5 h-32 overflow-y-auto font-sans leading-relaxed">
                                                                        {submission.transcript || <span className="text-gray-600">Transcript not yet generated.</span>}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Error Message - Always full width */}
                                                            {submission.errorMessage && (
                                                                <div className="mt-4 p-3 bg-red-900/40 rounded-lg border border-red-500/50 flex items-center gap-2">
                                                                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                                                                    <span className="text-sm text-red-300 font-medium">Processing Error:</span>
                                                                    <span className="text-xs text-red-300">{submission.errorMessage}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-border bg-card flex items-center justify-center text-xs text-muted-foreground shrink-0">Showing {filteredSubmissions.length} submissions | Data processed by AI.</div>
            </CardContent>
        </Card>
    );
}
