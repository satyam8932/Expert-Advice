'use client';
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
        bgColor: 'bg-red-50',
        borderColor: 'border-red-100',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-500',
        headingColor: 'text-red-900',
        contentColor: 'text-red-700',
    },
    'not-found': {
        icon: AlertCircle,
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-100',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        headingColor: 'text-indigo-900',
        contentColor: 'text-indigo-700',
    },
};

export function StatusMessage({ type = 'error', heading, content, className, action }: StatusMessageProps) {
    const config = statusConfig[type];
    const Icon = config.icon;

    return (
        <div className={cn('flex items-center justify-center p-6', className)}>
            <Card className={cn('w-full max-w-md rounded-2xl border shadow-sm transition-all hover:shadow-lg hover:border-opacity-60', config.bgColor, config.borderColor)}>
                <CardContent className="pt-8 pb-6 px-6 flex flex-col items-center text-center">
                    <div className={cn('rounded-full p-4 mb-5 flex items-center justify-center shadow-sm', config.iconBg)}>
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
