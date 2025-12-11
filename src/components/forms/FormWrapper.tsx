'use client';

import { useEffect } from 'react';
import { useFormsStore } from '@/store/forms.store';
import FormsTable from '@/components/forms/FormsTable';
import CreateFormDialog from '@/components/forms/CreateFormDialog';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { FormType } from '@/lib/types/forms.types';

interface FormWrapperProps {
    initialForms: FormType[];
}

export default function FormWrapper({ initialForms }: FormWrapperProps) {
    const setForms = useFormsStore((s) => s.setForms);

    useEffect(() => {
        setForms(initialForms);
    }, [initialForms, setForms]);

    return (
        <div className="flex flex-col p-2 gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
                {/* Title and Subtitle */}
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-foreground to-muted-foreground">Forms</h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        Manage and monitor all Data Intake Forms
                    </p>
                </div>

                {/* Action Button */}
                <CreateFormDialog>
                    <Button className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 active:scale-95">
                        <Plus className="w-4 h-4 mr-2" /> Create Form
                    </Button>
                </CreateFormDialog>
            </div>

            <div className="flex-1 min-h-0">
                <FormsTable />
            </div>
        </div>
    );
}
