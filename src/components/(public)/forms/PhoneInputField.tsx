'use client';
import PhoneInput, { type Value } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Label } from '@/components/ui/label';

interface PhoneInputFieldProps {
    value: Value;
    onChange: (value: Value) => void;
    error?: string;
}

export default function PhoneInputField({ value, onChange, error }: PhoneInputFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                Phone Number <span className="text-red-500">*</span>
            </Label>
            <div className="phone-input-themed">
                <PhoneInput international defaultCountry="US" value={value} onChange={onChange} className={error ? 'phone-input-error' : ''} />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            <style jsx global>{`
                /* Global styles to override react-phone-number-input for theme support */

                .phone-input-themed .PhoneInput {
                    display: flex;
                    align-items: center;
                    background: hsl(var(--background));
                    border: 1px solid ${error ? '#ef4444' : 'hsl(var(--border))'};
                    border-radius: 0.75rem;
                    padding: 0;
                    height: 2.75rem;
                    transition: all 0.2s;
                }

                .phone-input-themed .PhoneInput:focus-within {
                    border-color: ${error ? '#ef4444' : '#6366f1'};
                    outline: none;
                    box-shadow:
                        0 0 0 1px ${error ? '#ef4444' : '#6366f1'},
                        0 0 0 3px ${error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)'};
                }

                .phone-input-themed .PhoneInputCountry {
                    padding: 0 0.75rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border-right: 1px solid hsl(var(--border));
                    margin-right: 0.5rem;
                    color: hsl(var(--foreground));
                }

                .phone-input-themed .PhoneInputCountrySelect {
                    background: transparent;
                }

                .phone-input-themed .PhoneInputCountryIcon {
                    width: 1.5rem;
                    height: 1.5rem;
                    border-radius: 0.25rem;
                    overflow: hidden;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                }

                .phone-input-themed .PhoneInputCountrySelectArrow {
                    width: 0.75rem;
                    height: 0.75rem;
                    color: hsl(var(--muted-foreground));
                    opacity: 0.8;
                    margin-left: 0.25rem;
                }

                .phone-input-themed .PhoneInputInput {
                    flex: 1;
                    border: none;
                    outline: none;
                    font-size: 1rem;
                    padding: 0 0.75rem 0 0;
                    height: 100%;
                    background: transparent;
                    color: hsl(var(--foreground));
                }

                .phone-input-themed .PhoneInputInput::placeholder {
                    color: hsl(var(--muted-foreground));
                }
            `}</style>
        </div>
    );
}
