'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { AdminUserData } from '@/lib/types/admin.types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EditAdminStatus from './EditAdminStatus';

interface UsersTableProps {
    users: AdminUserData[];
    onUpdate: () => void;
}

export default function UsersTable({ users, onUpdate }: UsersTableProps) {
    const [search, setSearch] = useState('');

    const filteredUsers = useMemo(() => {
        const query = search.toLowerCase();
        return users.filter((user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query));
    }, [users, search]);

    const formatDate = (date: Date | null) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
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

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                </div>
                <div className="text-sm text-muted-foreground">
                    {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
                </div>
            </div>

            <div className="space-y-3">
                {filteredUsers.map((user) => (
                    <Card key={user.id} className="p-4 hover:shadow-md transition-all border-border/50">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <div>
                                        <div className="font-medium text-sm">{user.name}</div>
                                        <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {user.isSuper && <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">Admin</Badge>}
                                    <Badge className={getPlanBadgeColor(user.subscription?.plan || null)}>{user.subscription?.plan?.toUpperCase() || 'FREE'}</Badge>
                                    <Badge className={getStatusBadgeColor(user.subscription?.status || null)}>{user.subscription?.status || 'inactive'}</Badge>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-xs text-muted-foreground space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span>Forms:</span>
                                        <span className="font-medium text-foreground">{user.usage?.formsCreatedCount || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>Submissions:</span>
                                        <span className="font-medium text-foreground">{user.usage?.submissionsCount || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>Joined:</span>
                                        <span className="font-medium text-foreground">{formatDate(user.createdAt)}</span>
                                    </div>
                                </div>

                                <EditAdminStatus userId={user.id} userName={user.name} isSuper={user.isSuper} onUpdate={onUpdate} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredUsers.length === 0 && <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">No users found matching your search.</div>}
        </div>
    );
}
