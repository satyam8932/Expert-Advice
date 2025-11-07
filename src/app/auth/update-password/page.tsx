'use client';

import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthHeader from '@/components/auth/AuthHeader';
import InputField from '@/components/auth/InputField';
import PasswordRequirements from '@/components/auth/PasswordRequirements';
import PasswordUpdateSuccess from '@/components/auth/PasswordUpdateSuccess';
import { Button } from '@/components/ui/button';
import { isPasswordValid } from '@/lib/utils/validation';
import { supabaseClient } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setLoading(true);

        const loadingToast = toast.loading('Updating Password', {
            description: 'Please wait while we update your password...',
        });

        const { error } = await supabaseClient.auth.updateUser({
            password: formData.password,
        });

        toast.dismiss(loadingToast);
        setLoading(false);

        if (error) {
            toast.error('Failed to Update Password', {
                description: error.message || 'Unable to update password. Please try again.',
            });
            return;
        }

        setSuccess(true);
        toast.success('Password Updated!', {
            description: 'Your password has been successfully updated.',
        });

        setTimeout(() => {
            router.push('/auth/login');
        }, 2000);
    };

    const isPasswordStrong = isPasswordValid(formData.password);
    const doPasswordsMatch = formData.confirmPassword === formData.password && formData.confirmPassword.length > 0;
    const isFormValid = isPasswordStrong && doPasswordsMatch;

    return (
        <AuthLayout stats={{ inbox: '176,18', engagement: '46' }}>
            {success ? (
                <PasswordUpdateSuccess />
            ) : (
                <div className="flex flex-col h-full justify-between min-h-[500px]">
                    <div>
                        <AuthHeader title="Update Password" subtitle="Enter your new password below" linkText="Back to sign in" linkHref="/auth/login" />

                        <div className="space-y-4">
                            <InputField
                                type="password"
                                name="password"
                                placeholder="New Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                icon={Lock}
                                showPasswordToggle
                                showPassword={showPassword}
                                onTogglePassword={() => setShowPassword(!showPassword)}
                                validated={isPasswordStrong}
                            />

                            <PasswordRequirements password={formData.password} />

                            <InputField
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm New Password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                icon={Lock}
                                showPasswordToggle
                                showPassword={showConfirmPassword}
                                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                                validated={doPasswordsMatch}
                            />
                        </div>
                    </div>

                    <Button onClick={handleUpdate} disabled={!isFormValid || loading} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 mt-6">
                        {loading ? (
                            <>
                                <span className="mr-2">Updating...</span>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </>
                        ) : (
                            <>
                                <span>Update Password</span>
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            )}
        </AuthLayout>
    );
}
