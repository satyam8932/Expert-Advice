'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export type PlanType = 'free' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due';

export interface SubscriptionDetails {
    plan: PlanType;
    status: SubscriptionStatus;
    price: string;
    nextBillingDate: string | null;
    paymentMethod?: string;
}

export interface Invoice {
    id: string;
    date: string;
    amount: string;
    status: 'paid' | 'pending' | 'failed';
    downloadUrl: string;
}

const getPlanGradient = (plan: PlanType) => {
    switch (plan) {
        case 'pro':
            return 'bg-gradient-to-br from-indigo-600 to-purple-600';
        case 'enterprise':
            return 'bg-gradient-to-br from-slate-800 to-black border border-white/10';
        default:
            return 'bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10';
    }
};

export function PlanDetailsCard({ subscription }: { subscription: SubscriptionDetails }) {
    return (
        <Card className="bg-card border border-border shadow-xl flex flex-col h-full">
            <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-lg font-medium text-foreground flex items-center justify-between">
                    Current Plan
                    <Badge variant="outline" className={`capitalize ${subscription.status === 'active' ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'}`}>
                        {subscription.status.replace('_', ' ')}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-6">
                    <div className={`relative flex items-center justify-between p-6 rounded-2xl text-white overflow-hidden ${getPlanGradient(subscription.plan)}`}>
                        <div className="relative z-10">
                            <p className="text-sm font-medium opacity-90 mb-1 uppercase tracking-wider">{subscription.plan} Plan</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold">{subscription.price}</span>
                                <span className="text-sm opacity-80 font-medium">/month</span>
                            </div>
                        </div>
                        <CreditCard className="w-16 h-16 opacity-20 absolute -right-2 -bottom-4 rotate-12" />
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between text-sm py-3 border-b border-white/5">
                            <span className="text-gray-400 flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Next billing date
                            </span>
                            <span className="font-medium text-foreground">{subscription.nextBillingDate || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm py-3 border-b border-white/5">
                            <span className="text-gray-400 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" /> Payment method
                            </span>
                            <span className="font-medium text-foreground">{subscription.paymentMethod || '•••• •••• •••• ••••'}</span>
                        </div>
                    </div>

                    <Button className="w-full bg-white text-black hover:bg-gray-200 font-semibold h-11 rounded-lg transition-all">Manage Subscription</Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function InvoiceHistoryCard({ invoices }: { invoices: Invoice[] }) {
    return (
        <Card className="bg-card border border-border shadow-xl flex flex-col h-full">
            <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-lg font-medium text-foreground">Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent className="p-2 overflow-y-auto custom-scrollbar">
                <div className="space-y-3">
                    {invoices.length === 0 ? (
                        <div className="text-center text-gray-500 py-8 text-sm">No invoices found</div>
                    ) : (
                        invoices.map((invoice) => (
                            <div key={invoice.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${invoice.status === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{invoice.status === 'paid' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}</div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{invoice.amount}</p>
                                        <p className="text-xs text-gray-500">{invoice.date}</p>
                                    </div>
                                </div>
                                <Button asChild variant="ghost" size="icon" className="text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10">
                                    <Link href={invoice.downloadUrl} target="_blank">
                                        <Download className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
