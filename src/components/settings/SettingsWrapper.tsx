'use client';

import { Settings, User, Bell, Lock, Palette, Globe, Mail, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function SettingsWrapper() {
    const settingsSections = [
        {
            icon: User,
            title: 'Profile Settings',
            description: 'Manage your personal information and account details',
            items: ['Name', 'Email', 'Profile Photo', 'Bio'],
        },
        {
            icon: Bell,
            title: 'Notifications',
            description: 'Configure how and when you receive notifications',
            items: ['Email Notifications', 'Push Notifications', 'SMS Alerts', 'Digest Frequency'],
        },
        {
            icon: Lock,
            title: 'Security & Privacy',
            description: 'Control your security settings and privacy preferences',
            items: ['Change Password', 'Two-Factor Authentication', 'Active Sessions', 'Privacy Settings'],
        },
        {
            icon: Palette,
            title: 'Appearance',
            description: 'Customize the look and feel of your dashboard',
            items: ['Theme (Light/Dark)', 'Color Scheme', 'Font Size', 'Layout Density'],
        },
        {
            icon: Globe,
            title: 'Language & Region',
            description: 'Set your preferred language and regional settings',
            items: ['Language', 'Timezone', 'Date Format', 'Currency'],
        },
        {
            icon: Mail,
            title: 'Email Preferences',
            description: 'Manage your email subscription preferences',
            items: ['Marketing Emails', 'Product Updates', 'Weekly Reports', 'Unsubscribe'],
        },
        {
            icon: Shield,
            title: 'API & Integrations',
            description: 'Manage API keys and third-party integrations',
            items: ['API Keys', 'Webhooks', 'Connected Apps', 'OAuth Tokens'],
        },
    ];

    return (
        <div className="flex flex-col p-2 gap-8 overflow-visible">
            <div className="shrink-0">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">Settings</h1>
                <p className="text-muted-foreground mt-1 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Manage your account preferences and configurations
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settingsSections.map((section) => (
                    <Card key={section.title} className="p-6 bg-card border border-border rounded-xl hover:border-indigo-500/30 transition-all duration-200 shadow-lg hover:shadow-xl">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-indigo-500/10 rounded-lg">
                                <section.icon className="w-6 h-6 text-indigo-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-foreground mb-1">{section.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                                <ul className="space-y-2">
                                    {section.items.map((item) => (
                                        <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-4 p-6 bg-muted/30 border border-border rounded-xl">
                <p className="text-sm text-muted-foreground text-center">
                    <span className="font-semibold text-foreground">Note:</span> Settings functionality is coming soon. This page shows available configuration options.
                </p>
            </div>
        </div>
    );
}
