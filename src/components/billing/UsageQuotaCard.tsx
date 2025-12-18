'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Database, FileText, Send, Mic, Video } from 'lucide-react';

interface UsageData {
    storage: { used: number; limit: number; percentage: number };
    forms: { used: number; limit: number | null; unlimited: boolean };
    submissions: { used: number; limit: number | null; unlimited: boolean };
    audioMinutes: { used: number; limit: number; percentage: number };
    videoMinutes?: { used: number; limit: number; percentage: number };
}

interface UsageQuotaCardProps {
    usage: UsageData;
}

function QuotaItem({ icon: Icon, label, used, limit, unlimited, percentage, unit = '' }: { icon: any; label: string; used: number; limit: number | null; unlimited?: boolean; percentage?: number; unit?: string }) {
    const isNearLimit = percentage !== undefined && percentage >= 80;
    const isAtLimit = percentage !== undefined && percentage >= 100;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
                <span className="text-sm text-gray-400">
                    {unlimited ? (
                        <span className="text-green-400 font-semibold">Unlimited</span>
                    ) : unit === ' GB' && used < 0.1 ? (
                        <>
                            {(used * 1024).toFixed(2)} MB / {limit} GB
                        </>
                    ) : (
                        <>
                            {used.toFixed(unit === ' GB' ? 2 : 0)}
                            {unit} / {limit}
                            {unit}
                        </>
                    )}
                </span>
            </div>
            {!unlimited && percentage !== undefined && <Progress value={Math.min(percentage, 100)} className={`h-2 ${isAtLimit ? 'bg-red-500/20 [&>div]:bg-red-500' : isNearLimit ? 'bg-yellow-500/20 [&>div]:bg-yellow-500' : 'bg-indigo-500/20 [&>div]:bg-indigo-500'}`} />}
        </div>
    );
}

export function UsageQuotaCard({ usage }: UsageQuotaCardProps) {
    return (
        <Card className="bg-card border border-border shadow-xl">
            <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-lg font-medium text-foreground">Usage & Quotas</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <QuotaItem icon={Database} label="Storage" used={usage.storage.used / (1024 * 1024 * 1024)} limit={usage.storage.limit / (1024 * 1024 * 1024)} percentage={usage.storage.percentage} unit=" GB" />

                <QuotaItem icon={FileText} label="Forms Created" used={usage.forms.used} limit={usage.forms.limit} unlimited={usage.forms.unlimited} percentage={usage.forms.limit && !usage.forms.unlimited ? Math.round((usage.forms.used / usage.forms.limit) * 100) : undefined} />

                <QuotaItem
                    icon={Send}
                    label="Submissions"
                    used={usage.submissions.used}
                    limit={usage.submissions.limit}
                    unlimited={usage.submissions.unlimited}
                    percentage={usage.submissions.limit && !usage.submissions.unlimited ? Math.round((usage.submissions.used / usage.submissions.limit) * 100) : undefined}
                />

                <QuotaItem icon={Mic} label="Audio Transcription (minutes)" used={usage.audioMinutes.used} limit={usage.audioMinutes.limit} percentage={usage.audioMinutes.percentage} />

                {usage.videoMinutes && <QuotaItem icon={Video} label="Video Intelligence (minutes)" used={usage.videoMinutes.used} limit={usage.videoMinutes.limit} percentage={usage.videoMinutes.percentage} />}
            </CardContent>
        </Card>
    );
}
