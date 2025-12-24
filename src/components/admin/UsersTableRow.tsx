'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { AdminUserData } from '@/lib/types/admin.types';
import EditAdminStatus from './EditAdminStatus';

interface UsersTableRowProps {
    user: AdminUserData;
    onUpdate: () => void;
}

export default function UsersTableRow({ user, onUpdate }: UsersTableRowProps) {
    const [isExpanded, setIsExpanded] = useState(false);

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
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'cancelled':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'past_due':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <>
            <tr className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
                <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                        <button className="text-muted-foreground hover:text-foreground">{isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</button>
                        <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                            {user.isSuper && <div className="text-xs text-orange-500 font-medium mt-1">Admin</div>}
                        </div>
                    </div>
                </td>
                <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPlanBadgeColor(user.subscription?.plan || null)}`}>{user.subscription?.plan?.toUpperCase() || 'FREE'}</span>
                </td>
                <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(user.subscription?.status || null)}`}>{user.subscription?.status || 'inactive'}</span>
                </td>
                <td className="px-4 py-4">
                    <div className="text-sm">
                        <div>{user.usage?.formsCreatedCount || 0} forms</div>
                        <div className="text-muted-foreground">{user.usage?.submissionsCount || 0} submissions</div>
                    </div>
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">{formatDate(user.createdAt)}</td>
            </tr>

            {isExpanded && (
                <tr className="bg-muted/30">
                    <td colSpan={5} className="px-4 py-6">
                        <div className="ml-8">
                            <div className="mb-4">
                                <EditAdminStatus userId={user.id} userName={user.name} isSuper={user.isSuper} onUpdate={onUpdate} />
                            </div>
                            <div className="text-sm text-muted-foreground">User ID: {user.id}</div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
