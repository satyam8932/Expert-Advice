'use client';
import PhoneInputField from './PhoneInputField';
import { Mail, Phone as PhoneIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ValidationErrors } from '@/lib/utils/validation';
import type { Value } from 'react-phone-number-input';

interface ContactMethodProps {
    email: string;
    phone: string;
    onEmailChange: (value: string) => void;
    onPhoneChange: (value: string) => void;
    errors: ValidationErrors;
}

export default function ContactMethod({ email, phone, onEmailChange, onPhoneChange, errors }: ContactMethodProps) {
    const handlePhoneChange = (val: Value) => {
        onPhoneChange(val || '');
    };

    const isEmailError = !!errors.email;
    const isPhoneError = !!errors.phone;
    const hasMethodError = !!errors.contactMethod;

    const inputClasses = (isError: boolean) =>
        `h-11 text-base bg-background border text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 transition-colors ${isError ? 'border-red-500 ring-red-500' : 'border-border focus:border-indigo-500/50'}`;

    return (
        <div className="space-y-4">
            {/* Error message if neither contact method is provided */}
            {hasMethodError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-sm text-red-600 dark:text-red-400 text-center">{errors.contactMethod}</p>
                </div>
            )}

            <div className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        placeholder="you@example.com"
                        className={inputClasses(isEmailError)}
                    />
                    {isEmailError && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                {/* OR Divider */}
                <div className="relative flex items-center justify-center py-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-card px-3 py-1 rounded-full border border-border text-xs font-semibold text-muted-foreground">OR</span>
                    </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                        Phone Number
                    </Label>
                    <PhoneInputField value={phone as Value} onChange={handlePhoneChange} error={errors.phone} />
                    {isPhoneError && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
            </div>

            {/* Helper text */}
            <p className="text-xs text-muted-foreground text-center">
                Provide at least one contact method. You can add both if you'd like.
            </p>
        </div>
    );
}
