'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Send, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface RecentForm {
    id: string;
    name: string;
    submissions: number;
    status: string;
    createdAt: Date | null;
}

export function RecentFormsCard({ forms }: { forms: RecentForm[] }) {
    return (
        <Card className="bg-card border border-border shadow-xl flex flex-col h-full">
            <CardHeader className="border-b border-border pb-4 shrink-0">
                <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    Recent Forms
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto custom-scrollbar">
                {forms.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No forms created yet</p>
                        <Link href="/dashboard/forms" className="text-xs text-indigo-500 hover:text-indigo-600 mt-2 inline-block">
                            Create your first form
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {forms.map((form) => (
                            <Link key={form.id} href="/dashboard/forms" className="block">
                                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border group">
                                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                                        <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors shrink-0">
                                            <FileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{form.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <p className="text-xs text-muted-foreground">{form.submissions} submissions</p>
                                                {form.createdAt && (
                                                    <>
                                                        <span className="text-xs text-muted-foreground">•</span>
                                                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(form.createdAt), { addSuffix: true })}</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant={form.status === 'active' ? 'default' : 'secondary'} className="ml-2 shrink-0">
                                        {form.status}
                                    </Badge>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

interface RecentSubmission {
    id: string;
    formId: string;
    formName: string;
    status: string;
    createdAt: Date | null;
}

export function RecentSubmissionsCard({ submissions }: { submissions: RecentSubmission[] }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
            case 'failed':
                return 'bg-red-500/10 text-red-600 border-red-500/20';
            default:
                return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
        }
    };

    return (
        <Card className="bg-card border border-border shadow-xl flex flex-col h-full">
            <CardHeader className="border-b border-border pb-4 shrink-0">
                <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2">
                    <Send className="w-5 h-5 text-green-500 dark:text-green-400" />
                    Recent Submissions
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto custom-scrollbar">
                {submissions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Send className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No submissions yet</p>
                        <p className="text-xs mt-1">Share your forms to start collecting submissions</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {submissions.map((submission) => (
                            <Link key={submission.id} href="/dashboard/submissions" className="block">
                                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border group">
                                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${getStatusColor(submission.status)}`}>
                                            <Send className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{submission.formName}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Badge variant="outline" className="text-xs capitalize">
                                                    {submission.status}
                                                </Badge>
                                                {submission.createdAt && (
                                                    <>
                                                        <span className="text-xs text-muted-foreground">•</span>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
