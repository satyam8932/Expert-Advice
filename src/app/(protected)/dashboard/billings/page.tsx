import { supabaseServer } from '@/supabase/server';
import BillingWrapper from '@/components/billing/BillingWrapper';
import type { SubscriptionRow, UsageRow } from '@/lib/types/billing.types';

export const metadata = {
    title: 'Billings | AdviceExpert.io',
};

export default async function BillingsPage() {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const { data: subscriptionRaw } = await supabase.from('subscriptions').select('*').eq('user_id', user!.id).single();
    const { data: usageRaw } = await supabase.from('usage').select('*').eq('user_id', user!.id).single();

    return <BillingWrapper initialSubscription={subscriptionRaw as SubscriptionRow | null} initialUsage={usageRaw as UsageRow | null} />;
}
