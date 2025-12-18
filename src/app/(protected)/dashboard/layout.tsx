import DashboardShell from '@/components/dashboard/DashboardShell';
import { supabaseServer } from '@/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = await supabaseServer();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    return <DashboardShell>{children}</DashboardShell>;
}
