'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthHeader from '@/components/auth/AuthHeader';
import InputField from '@/components/auth/InputField';
import PasswordResetEmailSuccess from '@/components/auth/PasswordResetEmailSuccess';
import { Button } from '@/components/ui/button';
import { validateEmail } from '@/lib/utils/validation';
import { supabaseClient } from '@/supabase/client';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEmailValid) return;

        setLoading(true);

        const loadingToast = toast.loading('Sending Reset Link', {
            description: 'Please wait while we send you a password reset email...',
        });

        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/update-password`,
        });

        toast.dismiss(loadingToast);
        setLoading(false);

        if (error) {
            toast.error('Failed to Send Reset Link', {
                description: error.message || 'Unable to send password reset email. Please try again.',
            });
            return;
        }

        setSuccess(true);
        toast.success('Reset Link Sent!', {
            description: 'Please check your email for the password reset link.',
        });
    };

    const isEmailValid = validateEmail(email);

    return (
        <AuthLayout stats={{ inbox: '176,18', engagement: '46' }}>
            {success ? (
                <PasswordResetEmailSuccess email={email} />
            ) : (
                <div className="flex flex-col h-full justify-between min-h-[500px]">
                    <div>
                        <AuthHeader title="Forgot Password" subtitle="Enter your email and we'll send you a reset link" linkText="Remember your password?" linkHref="/auth/login" />

                        <div className="space-y-4">
                            <InputField type="email" name="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} validated={isEmailValid} />
                        </div>
                    </div>

                    <Button onClick={handleReset} disabled={!isEmailValid || loading} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 mt-6">
                        {loading ? (
                            <>
                                <span className="mr-2">Sending...</span>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </>
                        ) : (
                            <>
                                <span>Send Reset Link</span>
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            )}
        </AuthLayout>
    );
}
