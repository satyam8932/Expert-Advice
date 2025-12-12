'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useFormsStore } from '@/store/forms.store';
import { FormType } from '@/lib/types/forms.types';
import { Loader2 } from 'lucide-react';

interface CreateFormDialogProps {
    children: React.ReactNode;
}

export default function CreateFormDialog({ children }: CreateFormDialogProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const addForm = useFormsStore((s) => s.addForm);

    const handleCreate = async () => {
        if (!name.trim()) return toast.error('Form name required.');
        setLoading(true);
        try {
            const res = await fetch('/api/forms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            const json: { form?: FormType; error?: string } = await res.json();

            if (!res.ok || !json.form) throw new Error(json.error || 'Failed to create form.');

            addForm(json.form);
            toast.success('Form created successfully!');
            setOpen(false);
            setName('');
        } catch (error) {
            console.error('API Error:', error);
            toast.error(error instanceof Error ? error.message : 'Error creating form.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-sm bg-card border-border text-foreground shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-foreground">Create New Form</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                    <Input
                        placeholder="Enter form name (e.g., Damage Claim Intake)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-indigo-500 focus-visible:ring-offset-0 transition-colors"
                    />
                    <Button onClick={handleCreate} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
