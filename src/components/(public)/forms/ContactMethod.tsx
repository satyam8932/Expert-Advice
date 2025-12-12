'use client';
import PhoneInputField from './PhoneInputField';
import { Mail, Phone as PhoneIcon, Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ContactOption } from '@/lib/types/collection-form.types';
import { ValidationErrors } from '@/lib/utils/validation';
import type { Value } from 'react-phone-number-input';

interface ContactMethodProps {
    value: 'email' | 'phone' | '';
    onChange: (value: 'email' | 'phone') => void;
    email: string;
    phone: string;
    onEmailChange: (value: string) => void;
    onPhoneChange: (value: string) => void;
    errors: ValidationErrors;
}

const contactOptions: ContactOption[] = [
    { id: 'email', label: 'Email', icon: Mail, desc: 'Receive quote and updates via email' },
    { id: 'phone', label: 'Phone', icon: PhoneIcon, desc: "We'll call you back with next steps" },
];

export default function ContactMethod({ value, onChange, email, phone, onEmailChange, onPhoneChange, errors }: ContactMethodProps) {
    const handlePhoneChange = (val: Value) => {
        onPhoneChange(val || '');
    };

    const hasMethodError = !!errors.contactMethod;
    const isEmailError = value === 'email' && !!errors.email;
    const isPhoneError = value === 'phone' && !!errors.phone;

    const inputClasses = (isError: boolean) =>
        `h-11 text-base bg-background border text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 transition-colors ${isError ? 'border-red-500 ring-red-500' : 'border-border focus:border-indigo-500/50'}`;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contactOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = value === option.id;

                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => onChange(option.id)}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left group
                                ${isSelected ? 'border-indigo-500 bg-indigo-600/10 shadow-md shadow-indigo-900/30' : hasMethodError ? 'border-red-500/50 bg-red-500/10 hover:border-red-500/70' : 'border-border bg-muted/30 hover:border-indigo-500/20 hover:bg-muted'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg transition-colors shadow-sm ${isSelected ? 'bg-indigo-600 text-white' : 'bg-muted text-muted-foreground group-hover:bg-muted/80'}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className={`font-semibold text-base mb-0.5 ${isSelected ? 'text-white' : 'text-foreground'}`}>{option.label}</div>
                                    <div className={`text-xs ${isSelected ? 'text-indigo-300' : 'text-muted-foreground'}`}>{option.desc}</div>
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
            {errors.contactMethod && <p className="text-xs text-red-500 mt-1">{errors.contactMethod}</p>}

            {value === 'email' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input id="email" type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} placeholder="you@example.com" className={inputClasses(isEmailError)} />
                    {isEmailError && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
            )}

            {value === 'phone' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <PhoneInputField value={phone as Value} onChange={handlePhoneChange} error={errors.phone} />
                    {isPhoneError && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
            )}
        </div>
    );
}
