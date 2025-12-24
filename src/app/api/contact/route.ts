import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { contactQueries } from '../../../../drizzle/schema';

interface ContactRequest {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export async function POST(req: Request) {
    try {
        const body: ContactRequest = await req.json();

        if (!body.name || !body.email || !body.subject || !body.message) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (body.name.length < 2 || body.name.length > 100) {
            return NextResponse.json({ error: 'Name must be between 2 and 100 characters' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
        }

        if (body.subject.length < 3 || body.subject.length > 200) {
            return NextResponse.json({ error: 'Subject must be between 3 and 200 characters' }, { status: 400 });
        }

        if (body.message.length < 10 || body.message.length > 2000) {
            return NextResponse.json({ error: 'Message must be between 10 and 2000 characters' }, { status: 400 });
        }

        await db.insert(contactQueries).values({
            name: body.name.trim(),
            email: body.email.trim().toLowerCase(),
            subject: body.subject.trim(),
            message: body.message.trim(),
        });

        return NextResponse.json({ success: true, message: 'Contact query submitted successfully' }, { status: 201 });
    } catch (error) {
        console.error('Contact form submission error:', error);
        return NextResponse.json({ error: 'Failed to submit contact query. Please try again later.' }, { status: 500 });
    }
}
