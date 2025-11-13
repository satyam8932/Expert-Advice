import { create } from 'zustand';
import { FormType } from '@/lib/types/forms.types';
import { toast } from 'sonner';

interface FormsState {
    forms: FormType[];
    setForms: (data: FormType[]) => void;
    addForm: (form: FormType) => void;
    updateForm: (id: string, updates: { name?: string; status?: 'active' | 'completed' }) => Promise<void>;
    deleteForm: (id: string) => Promise<void>;
    deleteMany: (ids: string[]) => Promise<void>;
}

export const useFormsStore = create<FormsState>((set) => ({
    forms: [],
    setForms: (data) => set({ forms: data }),
    addForm: (form) => set((state) => ({ forms: [form, ...state.forms] })),

    updateForm: async (id, updates) => {
        try {
            const res = await fetch('/api/forms', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updates }),
            });
            if (!res.ok) throw new Error('Failed to update form');
            const { form } = await res.json();
            set((state) => ({
                forms: state.forms.map((f) => (f.id === id ? { ...f, ...form } : f)),
            }));
            toast('Form updated successfully');
        } catch {
            toast('Failed to update form');
        }
    },

    deleteForm: async (id) => {
        try {
            const res = await fetch(`/api/forms?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete form');
            set((state) => ({ forms: state.forms.filter((f) => f.id !== id) }));
            toast('Form deleted');
        } catch {
            toast('Failed to delete form');
        }
    },

    deleteMany: async (ids) => {
        try {
            const res = await fetch('/api/forms', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids }),
            });
            if (!res.ok) throw new Error('Failed to delete forms');
            set((state) => ({ forms: state.forms.filter((f) => !ids.includes(f.id)) }));
            toast(`Deleted ${ids.length} forms`);
        } catch {
            toast('Failed to delete forms');
        }
    },
}));
