import React from 'react';
import { CheckCircle2, Lock } from 'lucide-react';

export default function PasswordUpdateSuccess() {
    return (
        <div className="flex flex-col items-center justify-center space-y-6 py-8">
            <div className="relative">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Lock className="w-10 h-10 text-green-600 dark:text-green-500" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-background">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
            </div>

            <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-foreground">Password Updated!</h2>
                <p className="text-muted-foreground max-w-md">Your password has been successfully updated. You can now sign in with your new password.</p>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 max-w-md w-full">
                <p className="text-sm text-foreground text-center">Redirecting you to the sign in page...</p>
            </div>
        </div>
    );
}
