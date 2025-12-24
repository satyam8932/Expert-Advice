'use client';

import { Zap, Check, Sparkles, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

interface UpgradeSectionProps {
    yearlyDiscountPercent: number;
}

const proFeatures = [
    { icon: Zap, text: '20 active forms', highlight: true },
    { icon: Zap, text: '100 form submissions', highlight: true },
    { icon: Zap, text: '600 minutes of audio transcription', highlight: true },
    { icon: Sparkles, text: '300 minutes of video intelligence', highlight: true },
    { icon: Check, text: '50 GB storage', highlight: true },
    { icon: Check, text: 'Priority support', highlight: true },
];

export function UpgradeSection({ yearlyDiscountPercent }: UpgradeSectionProps) {
    const [isYearly, setIsYearly] = useState(false);

    const getYearlyPrice = (monthlyPrice: number) => {
        return monthlyPrice * (1 - yearlyDiscountPercent / 100);
    };

    const monthlyPrice = 69; // Pro plan monthly price
    const displayPrice = isYearly ? getYearlyPrice(monthlyPrice) : monthlyPrice;

    return (
        <Card className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800 shadow-sm">
            <div className="p-6 md:p-8 space-y-8">
                {/* Header with Toggle */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold">Upgrade to Pro</h3>
                        </div>
                        <p className="text-sm text-muted-foreground ml-11">Unlock advanced AI features & more storage</p>
                    </div>

                    {/* Monthly/Yearly Toggle */}
                    <div className="flex items-center bg-muted/50 p-1 rounded-lg border ml-11 md:ml-0">
                        <button onClick={() => setIsYearly(false)} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${!isYearly ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                            Monthly
                        </button>
                        <button onClick={() => setIsYearly(true)} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${isYearly ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                            Yearly
                            <span className="ml-1.5 text-[10px] uppercase font-bold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full">-{yearlyDiscountPercent}%</span>
                        </button>
                    </div>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tight">${displayPrice % 1 === 0 ? displayPrice.toFixed(0) : displayPrice.toFixed(2)}</span>
                    <span className="text-lg text-muted-foreground font-medium">/{isYearly ? 'year' : 'month'}</span>
                </div>

                {isYearly && (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium -mt-4">
                        <Check className="w-4 h-4" />
                        Save ${((monthlyPrice - displayPrice) * 12).toFixed(2)} per year
                    </div>
                )}

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {proFeatures.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <div className={`p-1.5 rounded-md ${feature.highlight ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-muted'}`}>
                                <feature.icon className={`w-4 h-4 ${feature.highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground'}`} />
                            </div>
                            <span className="text-sm leading-relaxed">{feature.text}</span>
                        </div>
                    ))}
                </div>

                {/* Instructions Box */}
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                    <div className="flex gap-3">
                        <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground">How to upgrade</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Click the <span className="font-semibold text-indigo-600 dark:text-indigo-400">"Manage Subscription"</span> button in your Current Plan card above. You'll be redirected to the Stripe billing portal where you can upgrade your plan, update payment methods, and manage all subscription settings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
