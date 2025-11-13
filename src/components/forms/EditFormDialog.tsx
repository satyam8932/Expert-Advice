'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useFormsStore } from '@/store/forms.store';

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
        setName(currentName);
    }, [currentName, open]);

    const handleUpdate = async () => {
        if (!name.trim()) return toast('Form name required.');
        if (name === currentName) {
            onOpenChange(false);
            return;
        }
        setLoading(true);
        try {
            await updateForm(formId, { name });
            onOpenChange(false);
        } catch {
            toast('Error updating form.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit Form Name</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 mt-2">
                    <Input placeholder="Enter form name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} className="focus-visible:ring-indigo-500" />
                    <Button onClick={handleUpdate} className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
