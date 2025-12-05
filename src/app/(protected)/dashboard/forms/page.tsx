import { supabaseServer } from '@/supabase/server';
import FormWrapper from '@/components/forms/FormWrapper';

export const metadata = {
    title: 'Forms | AdviceExpert.io',
};

export default async function FormsPage() {
    const supabase = await supabaseServer();
    const { data: forms } = await supabase.from('forms').select('*').order('created_at', { ascending: false });
    return <FormWrapper initialForms={forms || []} />;
}
