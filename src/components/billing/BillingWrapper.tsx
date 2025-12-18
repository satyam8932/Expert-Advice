'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, CreditCard, BarChart3, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBillingStore } from '@/store/billing.store';
import type { SubscriptionRow, UsageRow } from '@/lib/types/billing.types';
import { PricingView } from './PricingView';
import { PlanDetailsCard, InvoiceHistoryCard } from './BillingWidget';
import type { SubscriptionDetails } from './BillingWidget';
import { UsageQuotaCard } from './UsageQuotaCard';
import { UpgradeSection } from './UpgradeSection';

interface BillingWrapperProps {
    initialSubscription: SubscriptionRow | null;
    initialUsage: UsageRow | null;
}

const YEARLY_DISCOUNT_PERCENT = parseInt(process.env.NEXT_PUBLIC_YEARLY_DISCOUNT_PERCENT || '10', 10);

export default function BillingWrapper({ initialSubscription, initialUsage }: BillingWrapperProps) {
    const { billingData, setBillingData, refreshBillingData, createCheckout, isCheckoutLoading, isRefreshing, loadingPlan } = useBillingStore();
    const [isYearly, setIsYearly] = useState(false);

    useEffect(() => {
        async function fetchAndStore() {
            try {
                const res = await fetch('/api/billing');
                if (res.ok) {
                    const data = await res.json();
                    setBillingData(data);
                }
            } catch (error) {
                console.error('Failed to fetch billing data:', error);
            }
        }
        fetchAndStore();
    }, [setBillingData]);

    const subscription = billingData?.subscription;
    const usage = billingData?.usage;
    const invoices = billingData?.invoices || [];
    const showUpgrade = subscription?.plan === 'go';

    const handleSelectPlan = (planKey: string, interval: 'monthly' | 'yearly') => {
        createCheckout(planKey as any, interval);
    };

    // No subscription - show pricing
    if (!subscription) {
        return <PricingView isYearly={isYearly} onToggleYearly={() => setIsYearly(!isYearly)} onSelectPlan={handleSelectPlan} isLoading={isCheckoutLoading} loadingPlan={loadingPlan} yearlyDiscountPercent={YEARLY_DISCOUNT_PERCENT} />;
    }

    // Convert subscription to SubscriptionDetails format
    const subscriptionDetails: SubscriptionDetails = {
        plan: subscription.plan as 'go' | 'pro',
        status: subscription.status as 'active' | 'cancelled' | 'past_due',
        price: subscription.price,
        nextBillingDate: subscription.nextBillingDate,
    };

    // Has subscription - show tabbed interface
    return (
        <div className="flex flex-col p-4 md:p-8 gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">Billing & Usage</h1>
                    <p className="text-muted-foreground mt-1">Manage your subscription and monitor your usage</p>
                </div>
                <Button onClick={refreshBillingData} disabled={isRefreshing} variant="outline">
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
            </div>

            {/* Tabbed Content */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="overview" className="gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="hidden sm:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="usage" className="gap-2">
                        <BarChart3 className="w-4 h-4" />
                        <span className="hidden sm:inline">Usage</span>
                    </TabsTrigger>
                    <TabsTrigger value="invoices" className="gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="hidden sm:inline">Invoices</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-6">
                    <PlanDetailsCard subscription={subscriptionDetails} />
                    {showUpgrade && <UpgradeSection isYearly={isYearly} yearlyDiscountPercent={YEARLY_DISCOUNT_PERCENT} onUpgrade={(interval) => createCheckout('pro', interval)} isLoading={isCheckoutLoading} loadingPlan={loadingPlan} />}
                </TabsContent>

                <TabsContent value="usage" className="mt-6">
                    {usage && <UsageQuotaCard usage={usage} />}
                </TabsContent>

                <TabsContent value="invoices" className="mt-6">
                    <InvoiceHistoryCard invoices={invoices} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
