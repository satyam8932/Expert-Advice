'use client';

import { Check, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PricingCardProps {
    plan: {
        name: string;
        key: string;
        price: { monthly: number };
        description: string;
        popular?: boolean;
        features: string[];
        notIncluded?: string[];
    };
    isYearly: boolean;
    yearlyDiscountPercent: number;
    onSelectPlan: (planKey: string, interval: 'monthly' | 'yearly') => void;
    isLoading: boolean;
    loadingPlan: string | null;
}

export function PricingCard({ plan, isYearly, yearlyDiscountPercent, onSelectPlan, isLoading, loadingPlan }: PricingCardProps) {
    const getYearlyPrice = (monthlyPrice: number) => {
        return monthlyPrice * (1 - yearlyDiscountPercent / 100);
    };

    const displayPrice = isYearly ? getYearlyPrice(plan.price.monthly) : plan.price.monthly;
    const isCurrentLoading = loadingPlan === `${plan.key}-${isYearly ? 'yearly' : 'monthly'}`;

    return (
        <div className={`relative p-8 rounded-2xl border transition-all ${plan.popular ? 'bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500/50 shadow-2xl scale-105' : 'bg-card border-border hover:border-indigo-500/30'}`}>
            {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full">Most Popular</div>}

            <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
            </div>

            <div className="mb-6">
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">${displayPrice.toFixed(0)}</span>
                    <span className="text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
                </div>
                {isYearly && <p className="text-sm text-green-500 mt-1">Save ${(plan.price.monthly * 12 - displayPrice * 12).toFixed(0)}/year</p>}
            </div>

            <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-green-500" />
                        </div>
                        <span className="text-sm">{feature}</span>
                    </li>
                ))}
                {plan.notIncluded?.map((feature, idx) => (
                    <li key={`not-${idx}`} className="flex items-start gap-3 opacity-50">
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                            <X className="w-3 h-3" />
                        </div>
                        <span className="text-sm line-through">{feature}</span>
                    </li>
                ))}
            </ul>

            <Button
                onClick={() => onSelectPlan(plan.key, isYearly ? 'yearly' : 'monthly')}
                disabled={isLoading}
                className={`w-full h-12 text-base font-semibold ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30' : 'bg-muted hover:bg-accent text-foreground border border-border'}`}
            >
                {isCurrentLoading ? 'Processing...' : 'Get Started'}
            </Button>
        </div>
    );
}
