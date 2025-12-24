'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { AdminUserData } from '@/lib/types/admin.types';
import SubscriptionRow from './SubscriptionRow';

interface SubscriptionsTableProps {
    users: AdminUserData[];
    onUpdate: () => void;
}

export default function SubscriptionsTable({ users, onUpdate }: SubscriptionsTableProps) {
    const [search, setSearch] = useState('');

    const filteredUsers = useMemo(() => {
        const query = search.toLowerCase();
        return users.filter((user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query));
    }, [users, search]);

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
                    <SubscriptionRow key={user.id} user={user} onUpdate={onUpdate} />
                ))}
            </div>

            {filteredUsers.length === 0 && <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">No users found matching your search.</div>}
        </div>
    );
}
