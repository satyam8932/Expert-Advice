'use client';
import { ArrowRight, Video, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoUploader from './VideoUploader';
import { CollectionFormData } from '@/lib/types/collection-form.types';
import { ValidationErrors, validateStep1 } from '@/lib/utils/validation';

interface Step1VideoProps {
    formData: CollectionFormData;
    onUpdate: (key: keyof CollectionFormData, value: any) => void;
    onNext: () => void;
    errors: ValidationErrors;
    setErrors: (errors: ValidationErrors) => void;
    formId: string;
}

export default function Step1Video({ formData, onUpdate, onNext, errors, setErrors, formId }: Step1VideoProps) {
    const handleNext = () => {
        const validationErrors = validateStep1(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        onNext();
    };

    const isVideoReady = formData.videoUrl && !formData.videoUploading;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-3">
                    <Video className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Take a video and show us how we can help</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">While you are videoing tell us what's moving, what's staying, and what's storing.</p>
            </div>

            <div className="space-y-4">
                <VideoUploader
                    videoUrl={formData.videoUrl}
                    isUploading={formData.videoUploading}
                    onUploadStart={() => onUpdate('videoUploading', true)}
                    onUploadComplete={(data) => {
                        onUpdate('videoUrl', data.url);
                        onUpdate('videoUrlPath', data.path);
                        onUpdate('fileSubmissionId', data.fileSubmissionId);
                        onUpdate('videoUploading', false);
                    }}
                    onUploadError={() => onUpdate('videoUploading', false)}
                    formId={formId}
                />

                {errors.videoUrl && (
                    <div className="flex items-center justify-center text-sm">
                        <p className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 mt-2 w-fit">{errors.videoUrl}</p>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between text-muted-foreground">
                    <div className="text-sm font-medium">Video Status:</div>
                    <div className="flex items-center gap-2">
                        {formData.videoUploading && <span className="text-yellow-500 dark:text-yellow-400 text-sm animate-pulse">Processing...</span>}
                        {isVideoReady && (
                            <span className="text-green-600 dark:text-green-400 text-sm flex items-center gap-1">
                                <FileText className="w-4 h-4" /> Ready for Analysis
                            </span>
                        )}
                        {!formData.videoUrl && !formData.videoUploading && <span className="text-muted-foreground text-sm">Awaiting Upload</span>}
                    </div>
                </div>

                <Button onClick={handleNext} disabled={formData.videoUploading || !formData.videoUrl} size="lg" className="w-full bg-indigo-600 hover:bg-indigo-500 px-8 text-base font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none">
                    Continue to Details
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
