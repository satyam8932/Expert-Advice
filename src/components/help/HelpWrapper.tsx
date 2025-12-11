'use client';

import { HelpCircle, BookOpen, MessageCircle, Video, FileText, Mail, ExternalLink, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function HelpWrapper() {
    const helpResources = [
        {
            icon: BookOpen,
            title: 'Documentation',
            description: 'Comprehensive guides and API references',
            items: ['Getting Started Guide', 'API Documentation', 'Integration Tutorials', 'Best Practices'],
            color: 'indigo',
        },
        {
            icon: Video,
            title: 'Video Tutorials',
            description: 'Step-by-step video walkthroughs',
            items: ['Platform Overview', 'Creating Your First Form', 'Analyzing Submissions', 'Advanced Features'],
            color: 'purple',
        },
        {
            icon: MessageCircle,
            title: 'Community Forum',
            description: 'Connect with other users and share insights',
            items: ['Ask Questions', 'Share Tips', 'Feature Requests', 'Bug Reports'],
            color: 'green',
        },
        {
            icon: FileText,
            title: 'Knowledge Base',
            description: 'Searchable articles and FAQs',
            items: ['Common Issues', 'Troubleshooting', 'Account Management', 'Billing Questions'],
            color: 'blue',
        },
        {
            icon: Mail,
            title: 'Email Support',
            description: 'Get help from our support team',
            items: ['Technical Support', 'Billing Inquiries', 'Feature Questions', 'General Help'],
            color: 'pink',
        },
    ];

    const quickLinks = [
        { label: 'How to create a form', href: '#' },
        { label: 'Understanding AI analysis', href: '#' },
        { label: 'Managing submissions', href: '#' },
        { label: 'Billing and pricing', href: '#' },
        { label: 'API integration guide', href: '#' },
        { label: 'Security and privacy', href: '#' },
    ];

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; text: string; border: string }> = {
            indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/30' },
            purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/30' },
            green: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30' },
            blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30' },
            pink: { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/30' },
        };
        return colors[color] || colors.indigo;
    };

    return (
        <div className="flex flex-col p-2 gap-8 overflow-visible">
            <div className="shrink-0">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">Help & Information</h1>
                <p className="text-muted-foreground mt-1 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    Find answers, tutorials, and support resources
                </p>
            </div>

            {/* Search Bar */}
            <Card className="p-6 bg-card border border-border rounded-xl shadow-lg">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search for help articles, guides, or FAQs..." className="pl-10 h-12 bg-background border-border" />
                    </div>
                    <Button className="h-12 bg-indigo-600 hover:bg-indigo-500 text-white px-6">Search</Button>
                </div>
            </Card>

            {/* Help Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {helpResources.map((resource) => {
                    const colorClasses = getColorClasses(resource.color);
                    return (
                        <Card key={resource.title} className={`p-6 bg-card border ${colorClasses.border} rounded-xl hover:shadow-xl transition-all duration-200`}>
                            <div className="flex flex-col gap-4">
                                <div className={`p-3 ${colorClasses.bg} rounded-lg w-fit`}>
                                    <resource.icon className={`w-6 h-6 ${colorClasses.text}`} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-1">{resource.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                                    <ul className="space-y-2">
                                        {resource.items.map((item) => (
                                            <li key={item} className="text-sm text-muted-foreground flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Links */}
            <Card className="p-6 bg-card border border-border rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-foreground mb-4">Popular Articles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {quickLinks.map((link) => (
                        <a key={link.label} href={link.href} className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted transition-colors text-sm text-foreground hover:text-indigo-500">
                            <FileText className="w-4 h-4 shrink-0" />
                            <span>{link.label}</span>
                        </a>
                    ))}
                </div>
            </Card>

            {/* Contact Support */}
            <Card className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl shadow-lg">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-foreground mb-2">Still need help?</h3>
                    <p className="text-muted-foreground mb-4">Our support team is here to assist you</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
                            <Mail className="w-4 h-4 mr-2" />
                            Contact Support
                        </Button>
                        <Button variant="outline" className="border-border hover:bg-muted">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Live Chat
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
