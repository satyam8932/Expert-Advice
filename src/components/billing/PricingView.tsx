'use client';

import { PricingCard } from './PricingCard';
import { BillingToggle } from './BillingToggle';

interface PricingViewProps {
    isYearly: boolean;
    onToggleYearly: () => void;
    onSelectPlan: (planKey: string, interval: 'monthly' | 'yearly') => void;
    isLoading: boolean;
    loadingPlan: string | null;
    yearlyDiscountPercent: number;
}

const plans = [
    {
        name: 'Go Plan',
        key: 'go',
        price: { monthly: 27 },
        description: 'Essential tools for individuals and small teams',
        features: ['5 active forms', '20 form submissions', '120 minutes of audio transcription', '10 GB storage', 'Standard support'],
        notIncluded: ['Video Intelligence'],
    },
    {
        name: 'Pro Plan',
        key: 'pro',
        price: { monthly: 69 },
        description: 'Unlock higher potential and advanced intelligence',
        popular: true,
        features: ['20 active forms', '100 form submissions', '600 minutes of audio transcription', '300 minutes of video intelligence', '50 GB storage', 'Priority support'],
    },
];

export function PricingView({ isYearly, onToggleYearly, onSelectPlan, isLoading, loadingPlan, yearlyDiscountPercent }: PricingViewProps) {
    return (
        <div className="flex flex-col p-4 md:p-8 gap-8">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h1>
                <p className="text-muted-foreground text-lg">Select the perfect plan for your needs. Upgrade or downgrade anytime.</p>
            </div>

            <BillingToggle isYearly={isYearly} onToggle={onToggleYearly} discountPercent={yearlyDiscountPercent} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
                {plans.map((plan) => (
                    <PricingCard key={plan.key} plan={plan} isYearly={isYearly} yearlyDiscountPercent={yearlyDiscountPercent} onSelectPlan={onSelectPlan} isLoading={isLoading} loadingPlan={loadingPlan} />
                ))}
            </div>
        </div>
    );
}
