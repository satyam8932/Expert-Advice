'use client';

import { CreditCard } from 'lucide-react';
import { PlanDetailsCard, InvoiceHistoryCard, SubscriptionDetails, Invoice } from './BillingWidget';

interface BillingWrapperProps {
    subscription: SubscriptionDetails;
    invoices: Invoice[];
}

export default function BillingWrapper({ subscription, invoices }: BillingWrapperProps) {
    return (
        <div className="flex flex-col p-2 gap-8 overflow-visible">
            <div className="shrink-0">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-500">Billings</h1>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Manage your subscription plan and payment history
                </p>
            </div>

            <div className="flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                    <div className="lg:col-span-2 h-fit">
                        <PlanDetailsCard subscription={subscription} />
                    </div>
                    <div className="lg:col-span-1">
                        <InvoiceHistoryCard invoices={invoices} />
                    </div>
                </div>
            </div>
        </div>
    );
}
