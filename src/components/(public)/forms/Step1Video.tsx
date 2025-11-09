'use client';
import { ArrowRight } from 'lucide-react';
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

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Video</h2>
                <p className="text-gray-600">Share a quick video to help us understand your needs</p>
            </div>

            <div>
                <VideoUploader
                    videoUrl={formData.videoUrl}
                    isUploading={formData.videoUploading}
                    onUploadStart={() => onUpdate('videoUploading', true)}
                    onUploadComplete={(url) => {
                        onUpdate('videoUrl', url);
                        onUpdate('videoUploading', false);
                    }}
                    onUploadError={() => onUpdate('videoUploading', false)}
                    formId={formId}
                />
                {errors.videoUrl && <p className="text-xs text-red-600 mt-2">{errors.videoUrl}</p>}
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleNext} disabled={formData.videoUploading || !formData.videoUrl} size="lg" className="bg-indigo-600 hover:bg-indigo-700 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    Continue
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
