'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useFormsStore } from '@/store/forms.store';
import { Loader2, Pencil } from 'lucide-react';

interface EditFormDialogProps {
    formId: string;
    currentName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditFormDialog({ formId, currentName, open, onOpenChange }: EditFormDialogProps) {
    const [name, setName] = useState(currentName);
    const [loading, setLoading] = useState(false);
    const updateForm = useFormsStore((s) => s.updateForm);

    useEffect(() => {
        if (open) {
            setName(currentName);
        }
    }, [currentName, open]);

    const handleUpdate = async () => {
        if (!name.trim()) return toast.error('Form name required.');
        if (name === currentName) {
            onOpenChange(false);
            return;
        }

        setLoading(true);
        try {
            await updateForm(formId, { name });
            toast.success(`Form updated to "${name}"`);
            onOpenChange(false);
        } catch (error) {
            console.error('Update Error:', error);
            toast.error('Error updating form.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm bg-card border-border text-foreground shadow-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Pencil className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                        <DialogTitle className="text-xl font-semibold text-foreground">Edit Form Name</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <Input
                        placeholder="Enter new form name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-indigo-500 focus-visible:ring-offset-0 transition-colors"
                    />

                    <Button onClick={handleUpdate} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 active:scale-95" disabled={loading || name.trim() === currentName}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Update'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
