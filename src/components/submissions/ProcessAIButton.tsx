import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface ProcessAIButtonProps {
    submissionId: string;
    videoUrl: string | null;
}

export default function ProcessAIButton({ submissionId, videoUrl }: ProcessAIButtonProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleProcess = async () => {
        if (!videoUrl) {
            toast.error('No video available to process');
            setIsOpen(false);
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch('/api/submissions/process-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    submissionId,
                    filesSubmissionId: submissionId,
                    videoUrl,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.requiresUpgrade) {
                    if (data.feature === 'videoIntelligence') {
                        toast.error('Video Intelligence is not available on your plan. Please upgrade to Pro.');
                    } else if (data.current !== undefined && data.limit !== undefined) {
                        toast.error('You have used all your video processing credits. Please upgrade your plan for more credits.');
                    } else {
                        toast.error(data.error || 'Upgrade required to use this feature');
                    }
                } else {
                    toast.error(data.error || 'Failed to start AI processing');
                }
                setIsOpen(false);
                return;
            }

            toast.success(data.message || 'Video processing started! Check back in a few minutes to an hour depending on video length.');
            setIsOpen(false);
        } catch (error) {
            toast.error('Failed to start AI processing. Please try again.');
            console.error('AI Processing error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-violet-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all" disabled={!videoUrl}>
                    <Sparkles className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border border-border">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-violet-500" />
                        Process Video with AI
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">This will start AI processing on the submitted video. The video will be analyzed and processed using advanced AI algorithms. This may take a few minutes depending on the video length.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-muted border-border hover:bg-muted/80 text-foreground" disabled={isProcessing}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleProcess();
                        }}
                        disabled={isProcessing}
                        className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/20"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Start Processing
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
