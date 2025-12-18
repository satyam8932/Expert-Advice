import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/config';
export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');
    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }
    // Verify signature
    let event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error('[Webhook] Signature verification failed:', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    // Forward verified event to N8N
    const n8nUrl = process.env.N8N_STRIPE_WEBHOOK_URL!;
    if (n8nUrl) {
        try {
            await fetch(n8nUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
            });
        } catch (error) {
            console.error('[Webhook] Failed to forward to N8N:', error);
        }
    }
    return NextResponse.json({ received: true });
}