'use client';

import { Zap, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface UpgradeSectionProps {
    isYearly: boolean;
    yearlyDiscountPercent: number;
    onUpgrade: (interval: 'monthly' | 'yearly') => void;
    isLoading: boolean;
    loadingPlan: string | null;
}

const proFeatures = [
    { icon: Zap, text: '20 active forms', highlight: true },
    { icon: Zap, text: '100 form submissions', highlight: true },
    { icon: Zap, text: '600 minutes of audio transcription' },
    { icon: Sparkles, text: '300 minutes of video intelligence', highlight: true },
    { icon: Check, text: '50 GB storage' },
    { icon: Check, text: 'Priority support' },
];

export function UpgradeSection({ isYearly, yearlyDiscountPercent, onUpgrade, isLoading, loadingPlan }: UpgradeSectionProps) {
    const getYearlyPrice = (monthlyPrice: number) => {
        return monthlyPrice * (1 - yearlyDiscountPercent / 100);
    };

    const monthlyPrice = 69; // Pro plan monthly price
    const displayPrice = isYearly ? getYearlyPrice(monthlyPrice) : monthlyPrice;
    const isCurrentLoading = loadingPlan === `pro-${isYearly ? 'yearly' : 'monthly'}`;

    return (
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-indigo-600">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Upgrade to Pro</h3>
                        <p className="text-sm text-muted-foreground">Unlock the full potential of your workflow</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Features List */}
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-4">What you'll get:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                            {proFeatures.map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${feature.highlight ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-card/50'}`}>
                                        <div className={`p-1.5 rounded-md ${feature.highlight ? 'bg-indigo-600' : 'bg-muted'}`}>
                                            <Icon className={`w-4 h-4 ${feature.highlight ? 'text-white' : 'text-muted-foreground'}`} />
                                        </div>
                                        <span className="text-sm font-medium">{feature.text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="flex flex-col justify-center">
                        <div className="p-6 rounded-xl bg-card border border-border shadow-xl">
                            <div className="text-center mb-6">
                                <div className="flex items-baseline justify-center gap-2 mb-2">
                                    <span className="text-5xl font-bold">${displayPrice.toFixed(0)}</span>
                                    <span className="text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
                                </div>
                                {isYearly && (
                                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm font-semibold">
                                        <Sparkles className="w-3 h-3" />
                                        Save ${(monthlyPrice * 12 - displayPrice * 12).toFixed(0)}/year
                                    </div>
                                )}
                            </div>

                            <Button onClick={() => onUpgrade(isYearly ? 'yearly' : 'monthly')} disabled={isLoading} className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30">
                                {isCurrentLoading ? (
                                    'Processing...'
                                ) : (
                                    <>
                                        Upgrade Now
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-center text-muted-foreground mt-4">Cancel anytime. No questions asked.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
