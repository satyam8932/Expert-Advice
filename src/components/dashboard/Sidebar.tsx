'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Send, CreditCard, HelpCircle, LogOut, Ghost, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { supabaseClient } from '@/supabase/client';

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    isAdmin: boolean;
}

export default function Sidebar({ isCollapsed, onToggle, isAdmin }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (error) console.error('Logout error:', error);
        router.push('/auth/login');
    };

    const mainItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
        { icon: FileText, label: 'Forms', href: '/dashboard/forms' },
        { icon: Send, label: 'Submissions', href: '/dashboard/submissions' },
        { icon: CreditCard, label: 'Billings', href: '/dashboard/billings' },
        // { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    if (isAdmin) {
        mainItems.push({ icon: Shield, label: 'Admin', href: '/dashboard/admin' });
    }

    const bottomItems = [
        { icon: HelpCircle, label: 'Help & Information', href: '/contact' },
        { icon: LogOut, label: 'Log out', onClick: handleLogout },
    ];

    return (
        <>
            <aside className={cn('fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out', 'bg-sidebar border-r border-sidebar-border', isCollapsed ? 'w-20 -translate-x-full lg:translate-x-0' : 'w-64 translate-x-0')}>
                <div className="flex flex-col h-full p-4">
                    {/* Logo Area */}
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8 h-10`}>
                        <Link href="/" className="flex items-center gap-2 overflow-hidden">
                            <div className="flex items-center gap-2 w-full justify-center cursor-pointer">
                                {/* Replaced Fan with Ghost/Logo Icon for Brand Consistency */}
                                <Ghost className="w-8 h-8 text-sidebar-primary" />
                                {!isCollapsed && (
                                    <span className="text-xl font-bold text-sidebar-foreground whitespace-nowrap transition-opacity duration-200">
                                        Advice<span className="text-sidebar-primary">Expert.io</span>
                                    </span>
                                )}
                            </div>
                        </Link>
                    </div>

                    {/* Main Navigation */}
                    <nav className="flex-1 space-y-2">
                        {mainItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 p-3 rounded-lg transition-colors group relative',
                                        isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-indigo-900/20' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                    )}
                                >
                                    <item.icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-sidebar-primary-foreground' : 'text-muted-foreground group-hover:text-sidebar-accent-foreground')} />
                                    {!isCollapsed && <span className="font-medium whitespace-nowrap transition-opacity duration-200">{item.label}</span>}
                                    {isCollapsed && <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border shadow-md">{item.label}</div>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="mt-auto space-y-2 pt-4 border-t border-sidebar-border">
                        {bottomItems.map((item) =>
                            item.onClick ? (
                                <button key={item.label} onClick={item.onClick} className={cn('flex w-full items-center gap-3 p-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group relative cursor-pointer', isCollapsed && 'justify-center')}>
                                    <item.icon className="w-5 h-5 shrink-0" />
                                    {!isCollapsed && <span className="font-medium whitespace-nowrap transition-opacity duration-200">{item.label}</span>}
                                    {isCollapsed && <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border shadow-md">{item.label}</div>}
                                </button>
                            ) : (
                                <Link key={item.href} href={item.href} className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group relative">
                                    <item.icon className="w-5 h-5 shrink-0" />
                                    {!isCollapsed && <span className="font-medium whitespace-nowrap transition-opacity duration-200">{item.label}</span>}
                                    {isCollapsed && <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border shadow-md">{item.label}</div>}
                                </Link>
                            )
                        )}

                        <div className="mt-4 flex justify-center">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {!isCollapsed && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onToggle} />}
        </>
    );
}
