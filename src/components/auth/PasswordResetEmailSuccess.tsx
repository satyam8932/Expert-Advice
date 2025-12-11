import { Mail, CheckCircle2 } from 'lucide-react';

interface PasswordResetEmailSuccessProps {
    email: string;
}

export default function PasswordResetEmailSuccess({ email }: PasswordResetEmailSuccessProps) {
    return (
        <div className="flex flex-col items-center justify-center space-y-6 py-8">
            <div className="relative">
                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center">
                    <Mail className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-background">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
            </div>

            <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-foreground">Check Your Email</h2>
                <p className="text-muted-foreground max-w-md">
                    We&apos;ve sent a password reset link to
                    <span className="block font-semibold text-foreground mt-1">{email}</span>
                </p>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 max-w-md w-full">
                <p className="text-sm text-foreground text-center">
                    Click the link in the email to reset your password. The link will expire in <span className="font-semibold">10 minutes</span>.
                </p>
            </div>

            {/* <div className="text-center space-y-2 pt-4">
                <p className="text-sm text-gray-600">Didn&apos;t receive the email?</p>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">Resend Email</button>
            </div> */}
        </div>
    );
}
