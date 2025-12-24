export interface AdminUserData {
    id: string;
    name: string;
    email: string;
    isSuper: boolean;
    createdAt: Date | null;
    subscription: {
        id: string | null;
        plan: 'free' | 'pro' | 'go' | null;
        status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'unpaid' | null;
        subscriptionStart: Date | null;
    } | null;
    limits: {
        storageLimitBytes: number | null;
        formsLimit: number | null;
        submissionsLimit: number | null;
        audioMinutesLimit: number | null;
        videoMinutesLimit: number | null;
        videoIntelligenceEnabled: boolean | null;
    } | null;
    usage: {
        storageUsedBytes: number | null;
        formsCreatedCount: number | null;
        submissionsCount: number | null;
        audioMinutesTranscribed: string | null;
        videoMinutesUsed: string | null;
    } | null;
}

export interface AdminStats {
    totalUsers: number;
    totalForms: number;
    totalSubmissions: number;
    activeSubscriptions: number;
}

export interface AdminUsersResponse {
    users: AdminUserData[];
    stats: AdminStats;
}
