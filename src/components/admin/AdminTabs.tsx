'use client';

import { Users, Settings, MessageSquare } from 'lucide-react';

interface Tab {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

const tabs: Tab[] = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'subscriptions', label: 'Subscriptions & Limits', icon: Settings },
    { id: 'queries', label: 'Contact Queries', icon: MessageSquare },
];

interface AdminTabsProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
    return (
        <div className="border-b border-border">
            <nav className="flex gap-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                flex items-center gap-2 px-4 py-3 border-b-2 transition-all
                                ${isActive ? 'border-primary text-primary font-medium' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
