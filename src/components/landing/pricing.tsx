'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';

type Plan = {
    name: string;
    price: { monthly: number };
    description: string;
    features: string[];
    notIncluded?: string[];
    popular?: boolean;
};

const YEARLY_DISCOUNT_PERCENT = parseInt(process.env.NEXT_PUBLIC_YEARLY_DISCOUNT_PERCENT || '10', 10);

const plans: Plan[] = [
    {
        name: 'Go Plan',
        price: { monthly: 9 },
        description: 'Essential tools for individuals and small teams to explore features.',
        features: ['5 active forms', '20 form submissions', '2 hours of audio transcription', '10 GB storage', 'Standard support'],
        notIncluded: ['Video Intelligence'],
    },
    {
        name: 'Pro Plan',
        price: { monthly: 49 },
        description: 'Unlock unlimited potential and advanced intelligence.',
        popular: true,
        features: ['Unlimited active forms', 'Unlimited submissions', '10 hours of audio transcription', '5 hours of video intelligence', '50 GB storage', 'Priority support'],
    },
];

export function PricingTable() {
    const [isYearly, setIsYearly] = useState(false);

    const getYearlyPrice = (monthlyPrice: number) => {
        return monthlyPrice * (1 - YEARLY_DISCOUNT_PERCENT / 100);
    };

    return (
        <section className="py-24 px-4" id="pricing">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-b from-foreground to-muted-foreground mb-4">Simple, transparent pricing</h2>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Pay for the intelligence you use. Unlock full processing capabilities.</p>

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly Billing</span>
                        <button onClick={() => setIsYearly(!isYearly)} className={`relative w-14 h-7 rounded-full transition-colors ${isYearly ? 'bg-indigo-600' : 'bg-muted'}`}>
                            <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${isYearly ? 'translate-x-7' : ''}`} />
                        </button>
                        <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                            Yearly Billing <span className="text-green-500 text-xs">(Save {YEARLY_DISCOUNT_PERCENT}%)</span>
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan, index) => (
                        <div key={plan.name} className={`relative p-8 rounded-2xl border transition-all hover:scale-105 ${plan.popular ? 'bg-card border-indigo-500/50 shadow-xl shadow-indigo-900/20' : 'bg-card/50 border-border hover:border-indigo-500/30'}`}>
                            {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md shadow-indigo-900/50">Most Popular</div>}

                            <h3 className="text-2xl font-bold text-foreground mb-1">{plan.name}</h3>
                            <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                            <div className="mb-6">
                                <span className="text-5xl font-extrabold text-foreground">${isYearly ? getYearlyPrice(plan.price.monthly).toFixed(2) : plan.price.monthly}</span>
                                <span className="text-muted-foreground ml-2">/ month</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-sm text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                                {/* Not Included Features (Muted/Disabled) */}
                                {plan.notIncluded?.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600 opacity-60">
                                        <X className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-3 rounded-lg font-semibold transition-all ${plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/50' : 'bg-muted text-foreground hover:bg-accent border border-border'}`}>Get Started</button>
                        </div>
                    ))}
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-muted-foreground mt-12 max-w-xl mx-auto">Pricing is based on per-submission AI processing and storage. {YEARLY_DISCOUNT_PERCENT}% discount applied to yearly plans.</p>
            </div>
        </section>
    );
}
