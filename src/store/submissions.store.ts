import { create } from 'zustand';
import { SubmissionDisplayData } from '@/lib/types/submission.types';
import { toast } from 'sonner';

interface SubmissionsState {
    submissions: SubmissionDisplayData[];
    setSubmissions: (data: SubmissionDisplayData[]) => void;
    deleteSubmission: (id: string, videoUrl: string | null, jsonResultUrl: string | null, markdownUrl: string | null) => Promise<void>;
    // deleteMany: (ids: string[]) => Promise<void>;
}

export const useSubmissionsStore = create<SubmissionsState>((set) => ({
    submissions: [],
    setSubmissions: (data) => set({ submissions: data }),

    deleteSubmission: async (id) => {
        try {
            const res = await fetch(`/api/submissions?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete submission');

            set((state) => ({
                submissions: state.submissions.filter((s) => s.id !== id),
            }));

            toast.success('Submission deleted successfully!');
        } catch (error: any) {
            console.error('Error deleting submission:', error);
            toast.error(error.message || 'Failed to delete submission');
            throw error;
        }
    },

    // deleteMany: async (ids) => {
    //     try {
    //         const res = await fetch('/api/submissions', {
    //             method: 'DELETE',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ ids }),
    //         });
    //         if (!res.ok) throw new Error('Failed to delete submissions');

    //         set((state) => ({
    //             submissions: state.submissions.filter((s) => !ids.includes(s.id)),
    //         }));

    //         toast.success(`Deleted ${ids.length} submission${ids.length > 1 ? 's' : ''}`);
    //     } catch (error: any) {
    //         console.error('Error deleting submissions:', error);
    //         toast.error(error.message || 'Failed to delete submissions');
    //         throw error;
    //     }
    // },
}));
