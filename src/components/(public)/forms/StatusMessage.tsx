import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StatusType = 'error' | 'not-found';

interface StatusMessageProps {
    type?: StatusType;
    heading: string;
    content: string | React.ReactNode;
    className?: string;
    action?: React.ReactNode;
}

const statusConfig = {
    error: {
        icon: XCircle,
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        iconBg: 'bg-red-500/20',
        iconColor: 'text-red-500',
        headingColor: 'text-foreground',
        contentColor: 'text-red-600 dark:text-red-400',
    },
    'not-found': {
        icon: AlertCircle,
        bgColor: 'bg-muted/30',
        borderColor: 'border-indigo-500/30',
        iconBg: 'bg-indigo-500/20',
        iconColor: 'text-indigo-500 dark:text-indigo-400',
        headingColor: 'text-foreground',
        contentColor: 'text-muted-foreground',
    },
};

export function StatusMessage({ type = 'error', heading, content, className, action }: StatusMessageProps) {
    const config = statusConfig[type];
    const Icon = config.icon;

    return (
        <div className={cn('flex items-center justify-center p-6', className)}>
            <Card className={cn('w-full max-w-md rounded-2xl border transition-all hover:shadow-xl hover:border-opacity-60 shadow-none', config.bgColor, config.borderColor)}>
                <CardContent className="pt-8 pb-6 px-6 flex flex-col items-center text-center">
                    <div className={cn('rounded-full p-4 mb-5 flex items-center justify-center shadow-xl', config.iconBg)}>
                        <Icon className={cn('h-10 w-10', config.iconColor)} />
                    </div>

                    <h2 className={cn('text-2xl font-semibold tracking-tight mb-2', config.headingColor)}>{heading}</h2>

                    <div className={cn('text-sm leading-relaxed max-w-sm mb-4', config.contentColor)}>{typeof content === 'string' ? <p>{content}</p> : content}</div>

                    {action && <div className="pt-2 w-full">{action}</div>}
                </CardContent>
            </Card>
        </div>
    );
}
