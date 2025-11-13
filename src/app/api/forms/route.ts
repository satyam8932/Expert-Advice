import { supabaseServer } from '@/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

    const supabase = await supabaseServer();
    const { data: user } = await supabase.auth.getUser();
    const userId = user?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    const { data, error } = await supabase
        .from('forms')
        .insert([{ user_id: userId, name }])
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ form: data });
}

export async function PATCH(req: Request) {
    const { id, name, status } = await req.json();

    if (!id) return NextResponse.json({ error: 'Form ID required' }, { status: 400 });
    if (!name && !status) {
        return NextResponse.json({ error: 'At least one field (name or status) required' }, { status: 400 });
    }

    const supabase = await supabaseServer();
    const { data: user } = await supabase.auth.getUser();
    const userId = user?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    const updateData: { name?: string; status?: 'active' | 'completed' } = {};
    if (name) updateData.name = name;
    if (status) updateData.status = status.toLowerCase() as 'active' | 'completed';

    const { data, error } = await supabase.from('forms').update(updateData).eq('id', id).eq('user_id', userId).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ form: data });
}

export async function DELETE(req: Request) {
    const supabase = await supabaseServer();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    let ids: string[] | undefined;
    try {
        const body = await req.json().catch(() => ({}));
        if (Array.isArray(body?.ids)) ids = body.ids;
    } catch {
        // ignore
    }

    if (!id && (!ids || !ids.length)) {
        return NextResponse.json({ error: 'No form ID(s) provided' }, { status: 400 });
    }

    const { data: user } = await supabase.auth.getUser();
    const userId = user?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    const deleteIds = ids?.length ? ids : [id!];
    const { error } = await supabase.from('forms').delete().in('id', deleteIds).eq('user_id', userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, deleted: deleteIds });
}
