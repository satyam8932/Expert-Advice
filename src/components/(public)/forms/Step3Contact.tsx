'use client';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactMethod from './ContactMethod';
import { CollectionFormData, HelpOption } from '@/lib/types/collection-form.types';
import { Package, Users } from 'lucide-react';
import { ValidationErrors, validateStep3 } from '@/lib/utils/validation';

interface Step3ContactProps {
    formData: CollectionFormData;
    onUpdate: (key: keyof CollectionFormData, value: any) => void;
    onSubmit: () => void;
    onBack: () => void;
    loading: boolean;
    errors: ValidationErrors;
    setErrors: (errors: ValidationErrors) => void;
}

const helpOptions: HelpOption[] = [
    { id: 'labour', label: 'Moving Labour', icon: Users, desc: 'Professional movers to help' },
    { id: 'storage', label: 'Storage Container', icon: Package, desc: 'Portable moving container' },
    { id: 'both', label: 'Both Services', icon: Package, desc: 'Complete moving solution' },
];

export default function Step3Contact({ formData, onUpdate, onSubmit, onBack, loading, errors, setErrors }: Step3ContactProps) {
    const handleSubmit = () => {
        const validationErrors = validateStep3(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        onSubmit();
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">How Can We Reach You?</h2>
                <p className="text-gray-600">Choose your preferred contact method</p>
            </div>

            <ContactMethod value={formData.contactMethod} onChange={(v) => onUpdate('contactMethod', v)} email={formData.email} phone={formData.phone} onEmailChange={(v) => onUpdate('email', v)} onPhoneChange={(v) => onUpdate('phone', v)} errors={errors} />

            <div className="bg-linear-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-indigo-600 rounded-lg">
                        <Check className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-indigo-900">Review Your Information</h3>
                </div>
                <div className="space-y-2.5">
                    <div className="flex justify-between items-center py-2 border-b border-indigo-200/60">
                        <span className="text-sm font-medium text-indigo-700">Name</span>
                        <span className="text-sm text-indigo-900 font-semibold">
                            {formData.firstName} {formData.lastName}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-indigo-200/60">
                        <span className="text-sm font-medium text-indigo-700">Delivery Zipcode</span>
                        <span className="text-sm text-indigo-900 font-semibold">{formData.zipcode}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-indigo-200/60">
                        <span className="text-sm font-medium text-indigo-700">Service Needed</span>
                        <span className="text-sm text-indigo-900 font-semibold">{helpOptions.find((h) => h.id === formData.helpType)?.label}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-indigo-200/60">
                        <span className="text-sm font-medium text-indigo-700">Video</span>
                        <span className="text-sm text-indigo-900 font-semibold truncate max-w-[180px]">{'Uploaded'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-indigo-700">Contact</span>
                        <span className="text-sm text-indigo-900 font-semibold">{formData.contactMethod === 'email' ? formData.email : formData.phone || 'Not provided'}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onBack} size="lg" disabled={loading} className="px-6 border-2 hover:bg-gray-50">
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Back
                </Button>
                <Button onClick={handleSubmit} disabled={loading} size="lg" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            Get Expert Advice
                            <Check className="ml-2 w-5 h-5" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
