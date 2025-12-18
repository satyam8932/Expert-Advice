import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
});

// Helper to safely parse integer from env
const parseIntEnv = (value: string | undefined, fallback: number): number => {
    return value ? parseInt(value, 10) : fallback;
};

// Helper to safely parse boolean from env
const parseBoolEnv = (value: string | undefined): boolean => {
    return value === 'true';
};

export const PLAN_CONFIG = {
    go: {
        key: 'go',
        name: 'Go Plan',
        stripePriceId: {
            monthly: process.env.GO_PRICE_ID_MONTHLY!,
            yearly: process.env.GO_PRICE_ID_YEARLY!,
        },
        limits: {
            storage_bytes: parseIntEnv(process.env.GO_STORAGE_LIMIT_BYTES, 10737418240),
            forms_limit: parseIntEnv(process.env.GO_FORMS_LIMIT, 5),
            submissions_limit: parseIntEnv(process.env.GO_SUBMISSIONS_LIMIT, 20),
            audio_minutes: parseIntEnv(process.env.GO_AUDIO_MINUTES_LIMIT, 120),
            video_minutes: parseIntEnv(process.env.GO_VIDEO_MINUTES_LIMIT, 0),
            video_intelligence: parseBoolEnv(process.env.GO_VIDEO_INTELLIGENCE),
        },
    },
    pro: {
        key: 'pro',
        name: 'Pro Plan',
        stripePriceId: {
            monthly: process.env.PRO_PRICE_ID_MONTHLY!,
            yearly: process.env.PRO_PRICE_ID_YEARLY!,
        },
        limits: {
            storage_bytes: parseIntEnv(process.env.PRO_STORAGE_LIMIT_BYTES, 53687091200),
            forms_limit: parseIntEnv(process.env.PRO_FORMS_LIMIT, 20),
            submissions_limit: parseIntEnv(process.env.PRO_SUBMISSIONS_LIMIT, 100),
            audio_minutes: parseIntEnv(process.env.PRO_AUDIO_MINUTES_LIMIT, 600),
            video_minutes: parseIntEnv(process.env.PRO_VIDEO_MINUTES_LIMIT, 300),
            video_intelligence: parseBoolEnv(process.env.PRO_VIDEO_INTELLIGENCE),
        },
    },
} as const;

export type PlanKey = keyof typeof PLAN_CONFIG;
export type BillingInterval = 'monthly' | 'yearly';

export function mapStripePriceToPlanKey(priceId: string): PlanKey | null {
    for (const [key, config] of Object.entries(PLAN_CONFIG)) {
        if (config.stripePriceId.monthly === priceId || config.stripePriceId.yearly === priceId) {
            return key as PlanKey;
        }
    }
    return null;
}

export function getPlanLimits(planKey: PlanKey) {
    return PLAN_CONFIG[planKey]?.limits || null;
}
