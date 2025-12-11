import BillingWrapper from '@/components/billing/BillingWrapper';
import { SubscriptionDetails, Invoice, PlanType, SubscriptionStatus } from '@/components/billing/BillingWidget';

export const metadata = {
    title: 'Billings | AdviceExpert.io',
};

async function getBillingData() {
    const mockSubscription: SubscriptionDetails = {
        plan: 'pro' as PlanType,
        status: 'active' as SubscriptionStatus,
        price: '$29.00',
        nextBillingDate: 'June 1, 2023',
        paymentMethod: 'Visa ending in 4242',
    };

    const mockInvoices: Invoice[] = [
        { id: '1', date: 'May 1, 2023', amount: '$29.00', status: 'paid', downloadUrl: '#' },
        { id: '2', date: 'Apr 1, 2023', amount: '$29.00', status: 'paid', downloadUrl: '#' },
        { id: '3', date: 'Mar 1, 2023', amount: '$29.00', status: 'paid', downloadUrl: '#' },
        { id: '4', date: 'Feb 1, 2023', amount: '$29.00', status: 'paid', downloadUrl: '#' },
        { id: '5', date: 'Jan 1, 2023', amount: '$29.00', status: 'failed', downloadUrl: '#' },
    ];

    return {
        subscription: mockSubscription,
        invoices: mockInvoices,
    };
}

export default async function BillingsPage() {
    const data = await getBillingData();

    return (
        <div className="bg-background text-foreground">
            <BillingWrapper subscription={data.subscription} invoices={data.invoices} />
        </div>
    );
}
