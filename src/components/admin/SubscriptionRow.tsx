'use client';

import type { AdminUserData } from '@/lib/types/admin.types';
import EditLimits from './EditLimits';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SubscriptionRowProps {
    user: AdminUserData;
    onUpdate: () => void;
}

export default function SubscriptionRow({ user, onUpdate }: SubscriptionRowProps) {
    const formatBytes = (bytes: number | null) => {
        if (!bytes) return '0 MB';
        const mb = bytes / (1024 * 1024);
        if (mb < 1024) return `${mb.toFixed(2)} MB`;
        return `${(mb / 1024).toFixed(2)} GB`;
    };

    const getPlanBadgeColor = (plan: string | null) => {
        switch (plan) {
            case 'pro':
                return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'go':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getStatusBadgeColor = (status: string | null) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/20';
            case 'cancelled':
                return 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/20';
            case 'past_due':
                return 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/20';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const canEdit = user.subscription?.status === 'active' && (user.subscription?.plan === 'pro' || user.subscription?.plan === 'go');

    return (
        <Card className="p-4 hover:shadow-md transition-all border-border/50">
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div>
                            <div className="font-medium text-sm">{user.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getPlanBadgeColor(user.subscription?.plan || null)}>{user.subscription?.plan?.toUpperCase() || 'FREE'}</Badge>
                        <Badge className={getStatusBadgeColor(user.subscription?.status || null)}>{user.subscription?.status || 'inactive'}</Badge>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center p-2 rounded-md bg-secondary/30">
                            <span className="text-muted-foreground">Storage</span>
                            <span className="font-medium">
                                {formatBytes(user.usage?.storageUsedBytes || null)} / {formatBytes(user.limits?.storageLimitBytes || null)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-md bg-secondary/30">
                            <span className="text-muted-foreground">Forms</span>
                            <span className="font-medium">
                                {user.usage?.formsCreatedCount || 0} / {user.limits?.formsLimit || 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-md bg-secondary/30">
                            <span className="text-muted-foreground">Submissions</span>
                            <span className="font-medium">
                                {user.usage?.submissionsCount || 0} / {user.limits?.submissionsLimit || 0}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center p-2 rounded-md bg-secondary/30">
                            <span className="text-muted-foreground">Audio Min</span>
                            <span className="font-medium">
                                {user.usage?.audioMinutesTranscribed || '0.00'} / {user.limits?.audioMinutesLimit || 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-md bg-secondary/30">
                            <span className="text-muted-foreground">Video Min</span>
                            <span className="font-medium">
                                {user.usage?.videoMinutesUsed || '0.00'} / {user.limits?.videoMinutesLimit || 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-md bg-secondary/30">
                            <span className="text-muted-foreground">Video AI</span>
                            <span className={`font-medium ${user.limits?.videoIntelligenceEnabled ? 'text-emerald-600' : 'text-rose-600'}`}>{user.limits?.videoIntelligenceEnabled ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    {canEdit ? <EditLimits userId={user.id} userName={user.name} limits={user.limits} onUpdate={onUpdate} /> : <div className="text-xs text-muted-foreground px-3">{user.subscription?.plan === 'free' || !user.subscription?.plan ? 'Free Plan' : 'Inactive'}</div>}
                </div>
            </div>
        </Card>
    );
}
