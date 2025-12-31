'use client';
import { ArrowLeft, Check, Loader2, Mail, Phone, User, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactMethod from './ContactMethod';
import { CollectionFormData, HelpOption } from '@/lib/types/collection-form.types';
import { Package, Users, Info, Calendar } from 'lucide-react';
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

    const serviceLabel = formData.helpType || 'N/A';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <ContactMethod email={formData.email} phone={formData.phone} onEmailChange={(v) => onUpdate('email', v)} onPhoneChange={(v) => onUpdate('phone', v)} errors={errors} />

            <div className="bg-muted/30 border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4 border-b border-border pb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">Review Summary</h3>
                </div>

                <div className="space-y-2.5">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" /> Full Name
                        </span>
                        <span className="text-sm text-foreground font-semibold capitalize">
                            {formData.firstName} {formData.lastName}
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" /> Service Type
                        </span>
                        <span className="text-sm text-foreground font-semibold">{serviceLabel}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Video className="w-4 h-4 text-muted-foreground" /> Video Uploaded
                        </span>
                        <span className="text-sm text-green-600 dark:text-green-400 font-semibold truncate max-w-[180px]">Uploaded</span>
                    </div>

                    {/* Show email if provided */}
                    {formData.email && (
                        <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" /> Email
                            </span>
                            <span className="text-sm text-indigo-500 dark:text-indigo-400 font-semibold truncate max-w-[180px]">{formData.email}</span>
                        </div>
                    )}

                    {/* Show phone if provided */}
                    {formData.phone && (
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" /> Phone
                            </span>
                            <span className="text-sm text-indigo-500 dark:text-indigo-400 font-semibold">{formData.phone}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center gap-3 pt-4">
                <Button variant="outline" onClick={onBack} size="lg" disabled={loading} className="max-w-xs px-6 border-border bg-muted hover:bg-muted/80 text-foreground">
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Back
                </Button>
                <Button onClick={handleSubmit} disabled={loading} size="lg" className="max-w-xs bg-indigo-600 hover:bg-indigo-500 text-base font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95">
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
