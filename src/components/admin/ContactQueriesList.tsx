'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Calendar, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ContactQuery {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    isResolved: boolean;
    createdAt: Date | null;
}

interface ContactQueriesListProps {
    queries: ContactQuery[];
    onUpdate: () => void;
}

export default function ContactQueriesList({ queries, onUpdate }: ContactQueriesListProps) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const formatDate = (date: Date | null) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleToggleResolved = async (queryId: string, currentStatus: boolean) => {
        setLoadingId(queryId);
        try {
            const res = await fetch(`/api/admin/contact-queries/${queryId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isResolved: !currentStatus }),
            });

            if (!res.ok) {
                throw new Error('Failed to update query status');
            }

            toast.success(`Query marked as ${!currentStatus ? 'resolved' : 'unresolved'}`);
            onUpdate();
        } catch (error) {
            toast.error('Failed to update query status');
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async (queryId: string) => {
        if (!confirm('Are you sure you want to delete this query? This action cannot be undone.')) {
            return;
        }

        setLoadingId(queryId);
        try {
            const res = await fetch(`/api/admin/contact-queries/${queryId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Failed to delete query');
            }

            toast.success('Query deleted successfully');
            onUpdate();
        } catch (error) {
            toast.error('Failed to delete query');
        } finally {
            setLoadingId(null);
        }
    };

    if (queries.length === 0) {
        return (
            <div className="p-12 text-center text-muted-foreground border border-dashed rounded-lg">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No contact queries yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {queries.map((query) => (
                <Card key={query.id} className="p-4 hover:shadow-md transition-all border-border/50">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                    <Mail className="w-5 h-5 text-indigo-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm">{query.name}</div>
                                    <div className="text-xs text-muted-foreground truncate">{query.email}</div>
                                </div>
                            </div>

                            <div className="mt-3 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">{query.subject}</Badge>
                                    {query.isResolved ? (
                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                            Resolved
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                                            <XCircle className="w-3 h-3 mr-1" />
                                            Pending
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-3">{query.message}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{formatDate(query.createdAt)}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleToggleResolved(query.id, query.isResolved)} disabled={loadingId === query.id} className="h-8 text-xs">
                                    {query.isResolved ? (
                                        <>
                                            <XCircle className="w-3.5 h-3.5 mr-1" />
                                            Mark Unresolved
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                            Mark Resolved
                                        </>
                                    )}
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDelete(query.id)} disabled={loadingId === query.id} className="h-8 text-xs text-destructive hover:text-destructive">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
