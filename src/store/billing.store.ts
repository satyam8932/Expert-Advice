import { create } from 'zustand';
import type { BillingDisplayData, PlanKey } from '@/lib/types/billing.types';
import { toast } from 'sonner';

interface BillingState {
    billingData: BillingDisplayData | null;
    isCheckoutLoading: boolean;
    isRefreshing: boolean;
    loadingPlan: string | null;
    setBillingData: (data: BillingDisplayData) => void;
    refreshBillingData: () => Promise<void>;
    createCheckout: (planKey: PlanKey, interval: 'monthly' | 'yearly') => Promise<void>;
}

export const useBillingStore = create<BillingState>((set) => ({
    billingData: null,
    isCheckoutLoading: false,
    isRefreshing: false,
    loadingPlan: null,
    setBillingData: (data) => set({ billingData: data }),

    refreshBillingData: async () => {
        set({ isRefreshing: true });
        try {
            const res = await fetch('/api/billing');
            if (!res.ok) throw new Error('Failed to fetch billing data');
            const data = await res.json();
            set({ billingData: data });
            toast.success('Billing data refreshed');
        } catch (error) {
            toast.error('Failed to refresh billing data');
        } finally {
            set({ isRefreshing: false });
        }
    },

    createCheckout: async (planKey, interval) => {
        set({ isCheckoutLoading: true, loadingPlan: `${planKey}-${interval}` });
        try {
            const res = await fetch('/api/checkout/create-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planKey, interval }),
            });

            const data = await res.json();

            if (data.error) {
                toast.error(data.error);
                set({ isCheckoutLoading: false, loadingPlan: null });
                return;
            }

            // Don't reset loading state - user is being redirected
            window.location.href = data.url;
        } catch (error) {
            toast.error('Failed to start checkout');
            set({ isCheckoutLoading: false, loadingPlan: null });
        }
    },
}));
