'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubmissionsStore } from '@/store/submissions.store';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface DeleteSubmissionButtonProps {
    submissionId: string;
    videoUrl: string | null;
    jsonResultUrl: string | null;
    markdownUrl: string | null;
}

export default function DeleteSubmissionButton({ submissionId, videoUrl, jsonResultUrl, markdownUrl }: DeleteSubmissionButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const deleteSubmission = useSubmissionsStore((s) => s.deleteSubmission);

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            await deleteSubmission(submissionId, videoUrl, jsonResultUrl, markdownUrl);
            setIsOpen(false);
        } catch (error) {
            // Error is already handled in the store
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400 hover:bg-red-500/10" title="Delete submission">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border border-border">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">This will permanently delete this submission and all associated files (video, JSON, markdown). This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-muted border-border hover:bg-muted/80 text-foreground" disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
