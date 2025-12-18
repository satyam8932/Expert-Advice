'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const PRO_BENEFITS = ['50 GB Storage', '20 forms', '100 form submissions', '600 minutes audio transcription', '300 minutes video intelligence', 'Priority Support'];

export function UpgradeCard() {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/checkout/create-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planKey: 'pro' }),
            });

            const data = await res.json();

            if (data.error) {
                toast.error(data.error);
                return;
            }

            window.location.href = data.url;
        } catch (error) {
            toast.error('Failed to start upgrade process');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />

            <CardHeader className="border-b border-indigo-500/20 pb-4 relative z-10">
                <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    Upgrade to Pro
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 relative z-10">
                <div className="space-y-3">
                    {PRO_BENEFITS.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                <Check className="w-3 h-3 text-indigo-400" />
                            </div>
                            <span className="text-sm text-gray-300">{benefit}</span>
                        </div>
                    ))}
                </div>

                <div className="pt-4 border-t border-indigo-500/20">
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-foreground">{process.env.NEXT_PUBLIC_PRO_PRICE || '$69'}</span>
                        <span className="text-sm text-gray-400">/month</span>
                    </div>

                    <Button onClick={handleUpgrade} disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold h-11 rounded-lg transition-all shadow-lg shadow-indigo-600/20">
                        {loading ? (
                            'Processing...'
                        ) : (
                            <>
                                <ArrowUp className="w-4 h-4 mr-2" />
                                Upgrade Now
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
