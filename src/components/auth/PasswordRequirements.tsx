'use client';

import { Check } from 'lucide-react';
import { PasswordRequirementsProps } from '@/lib/types/auth.types';
import { validatePassword } from '@/lib/utils/validation';

export default function PasswordRequirements({ password }: PasswordRequirementsProps) {
    const validation = validatePassword(password);

    const requirements = [
        { text: 'Least 6 characters', met: validation.hasMinLength },
        {
            text: 'Least one number (0-9) or a symbol',
            met: validation.hasNumberOrSymbol,
        },
        {
            text: 'Lowercase (a-z) and uppercase (A-Z)',
            met: validation.hasUpperAndLower,
        },
    ];

    return (
        <div className="mb-6 space-y-2">
            {requirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                    <Check className={`w-4 h-4 transition-colors ${req.met ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <span className={`transition-colors ${req.met ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'}`}>{req.text}</span>
                </div>
            ))}
        </div>
    );
}
