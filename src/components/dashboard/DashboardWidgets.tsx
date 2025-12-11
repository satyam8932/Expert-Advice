'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Zap, FileText } from 'lucide-react';
import { getIcon } from './IconMap';

export interface ActivityItem {
    text: string;
    time: number;
    iconName: string;
    color: 'indigo' | 'green' | 'pink' | 'yellow';
}

export function RecentActivityCard({ activities }: { activities: ActivityItem[] }) {
    const colorStyles = {
        indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        green: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
        pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
        yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    };

    return (
        <Card className="bg-card border border-border shadow-xl flex flex-col h-full">
            <CardHeader className="border-b border-border pb-4 shrink-0">
                <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                    {activities.map((item, index) => {
                        const Icon = getIcon(item.iconName);
                        return (
                            <div key={index} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border group">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border group-hover:scale-105 transition-transform ${colorStyles[item.color]}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">{item.text}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{item.time} minutes ago</p>
                                </div>
                                <div className="text-xs font-medium text-indigo-500 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-foreground">View</div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

export interface PopularFormItem {
    name: string;
    count: number;
}

export function PopularFormsCard({ forms }: { forms: PopularFormItem[] }) {
    return (
        <Card className="bg-card border border-border shadow-xl flex flex-col h-full">
            <CardHeader className="border-b border-border pb-4 shrink-0">
                <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    Popular Forms
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                    {forms.map((form, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border group">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors">
                                    <FileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{form.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Submissions</p>
                                </div>
                            </div>
                            <div className="text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">{form.count}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
