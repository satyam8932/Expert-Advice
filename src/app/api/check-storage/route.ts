import { NextResponse } from 'next/server';
import { checkStorageQuota } from '@/lib/quota/checker';

export async function POST(req: Request) {
    const { userId, fileSize } = await req.json();

    if (!userId || !fileSize) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const quotaCheck = await checkStorageQuota(userId, fileSize);

    return NextResponse.json({
        allowed: quotaCheck.allowed,
        message: quotaCheck.message,
        current: quotaCheck.current,
        limit: quotaCheck.limit,
    });
}
