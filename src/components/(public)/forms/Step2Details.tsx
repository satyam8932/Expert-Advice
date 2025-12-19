'use client';
import { ArrowRight, ArrowLeft, Package, Users, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CollectionFormData, HelpOption } from '@/lib/types/collection-form.types';
import { Check } from 'lucide-react';
import { ValidationErrors, validateStep2 } from '@/lib/utils/validation';

interface Step2DetailsProps {
    formData: CollectionFormData;
    onUpdate: (key: keyof CollectionFormData, value: any) => void;
    onNext: () => void;
    onBack: () => void;
    errors: ValidationErrors;
    setErrors: (errors: ValidationErrors) => void;
}

const helpOptions: HelpOption[] = [
    { id: 'labour', label: 'Moving Labour', icon: Users, desc: 'Professional movers and assistance' },
    { id: 'storage', label: 'Moving and Storage Container', icon: Package, desc: 'Portable moving container rental' },
    { id: 'both', label: 'Both Services', icon: Package, desc: 'Complete moving solution package' },
];

export default function Step2Details({ formData, onUpdate, onNext, onBack, errors, setErrors }: Step2DetailsProps) {
    const handleNext = () => {
        const validationErrors = validateStep2(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        onNext();
    };

    const inputClasses = (key: keyof ValidationErrors) =>
        `h-11 text-base bg-background border text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 transition-colors ${errors[key] ? 'border-red-500 ring-red-500' : 'border-border focus:border-indigo-500/50'}`;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-3">
                    <Info className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">How can we help</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">Tell us what you need assistance with.</p>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                            First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input id="firstName" value={formData.firstName} onChange={(e) => onUpdate('firstName', e.target.value)} placeholder="John" className={inputClasses('firstName')} />
                        {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                            Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input id="lastName" value={formData.lastName} onChange={(e) => onUpdate('lastName', e.target.value)} placeholder="Doe" className={inputClasses('lastName')} />
                        {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="zipcode" className="text-sm font-medium text-foreground">
                        Delivery Zipcode <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="zipcode"
                        type="text"
                        inputMode="numeric"
                        value={formData.zipcode}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            onUpdate('zipcode', value);
                        }}
                        placeholder="Enter your zipcode"
                        className={inputClasses('zipcode')}
                    />
                    {errors.zipcode && <p className="text-xs text-red-500 mt-1">{errors.zipcode}</p>}
                </div>

                <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">
                        Select an option below <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-1 gap-3">
                        {helpOptions.map((option) => {
                            const Icon = option.icon;
                            const isSelected = formData.helpType === option.label;
                            const hasError = !!errors.helpType;

                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => onUpdate('helpType', option.label)}
                                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left group
                                        ${isSelected ? 'border-indigo-500 bg-indigo-500/20 shadow-md shadow-indigo-500/20' : hasError ? 'border-red-500/50 bg-red-500/10 hover:border-red-500/70' : 'border-border bg-muted/30 hover:border-indigo-500/20 hover:bg-muted'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg transition-colors shadow-sm ${isSelected ? 'bg-indigo-600 text-white' : 'bg-muted text-muted-foreground group-hover:bg-muted/80'}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className={`font-semibold text-base mb-0.5 ${isSelected ? 'text-indigo-900 dark:text-white' : 'text-foreground'}`}>{option.label}</div>
                                            <div className={`text-xs ${isSelected ? 'text-indigo-700 dark:text-indigo-100' : 'text-muted-foreground'}`}>{option.desc}</div>
                                        </div>
                                        {isSelected && (
                                            <div className="shrink-0">
                                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    {errors.helpType && <p className="text-xs text-red-500 mt-1">{errors.helpType}</p>}
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onBack} size="lg" className="px-6 border-border bg-muted hover:bg-muted/80 text-foreground">
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Back
                </Button>
                <Button onClick={handleNext} size="lg" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-base font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95">
                    Continue
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
