import DashboardShell from '@/components/dashboard/DashboardShell';
import { supabaseServer } from '@/supabase/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/drizzle';
import { users } from '../../../../drizzle/schema';
import { eq } from 'drizzle-orm';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const [userData] = await db.select({ isSuper: users.isSuper }).from(users).where(eq(users.id, user.id)).limit(1);
    const isAdmin = userData?.isSuper ?? false;

    return <DashboardShell isAdmin={isAdmin}>{children}</DashboardShell>;
}
