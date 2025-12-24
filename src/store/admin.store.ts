import { create } from 'zustand';
import type { AdminUsersResponse, AdminUserData, AdminStats } from '@/lib/types/admin.types';

interface AdminState {
    users: AdminUserData[];
    stats: AdminStats | null;
    isLoading: boolean;
    setAdminData: (data: AdminUsersResponse) => void;
    refreshAdminData: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
    users: [],
    stats: null,
    isLoading: false,

    setAdminData: (data) =>
        set({
            users: data.users,
            stats: data.stats,
        }),

    refreshAdminData: async () => {
        set({ isLoading: true });
        try {
            const res = await fetch('/api/admin/users');
            if (!res.ok) throw new Error('Failed to fetch admin data');
            const data = await res.json();
            set({ users: data.users, stats: data.stats });
        } catch (error) {
            console.error('Failed to refresh admin data:', error);
        } finally {
            set({ isLoading: false });
        }
    },
}));
