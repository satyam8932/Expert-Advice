// Raw subscription data from database
export interface SubscriptionRow {
    id: string;
    user_id: string;
    plan_key: string;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    status: string;
    subscription_start: string | null;
    subscription_end: string | null;
    last_billed_at: string | null;
    created_at: string;
    updated_at: string;
}

// Raw usage data from database
export interface UsageRow {
    id: string;
    user_id: string;
    storage_used_bytes: number;
    forms_created_count: number;
    submissions_count: number;
    audio_minutes_transcribed: number;
    video_minutes_used: number;
    created_at: string;
    updated_at: string;
}

// Display data for UI
export interface BillingDisplayData {
    subscription: SubscriptionDisplay | null;
    usage: UsageDisplay | null;
    invoices: InvoiceDisplay[];
}

export interface SubscriptionDisplay {
    plan: 'go' | 'pro';
    planName: string;
    status: string;
    price: string;
    nextBillingDate: string | null;
    stripeCustomerId: string | null;
}

export interface UsageDisplay {
    storage: {
        used: number;
        limit: number;
        percentage: number;
    };
    forms: {
        used: number;
        limit: number | null;
        unlimited: boolean;
    };
    submissions: {
        used: number;
        limit: number | null;
        unlimited: boolean;
    };
    audioMinutes: {
        used: number;
        limit: number;
        percentage: number;
    };
    videoMinutes?: {
        used: number;
        limit: number;
        percentage: number;
    };
}

export interface InvoiceDisplay {
    id: string;
    date: string;
    amount: string;
    status: 'paid' | 'open' | 'void' | 'uncollectible';
    pdfUrl: string | null;
}

export type PlanKey = 'go' | 'pro';
