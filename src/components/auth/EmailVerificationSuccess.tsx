import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmailVerificationSuccessProps {
    email: string;
}

export default function EmailVerificationSuccess({ email }: EmailVerificationSuccessProps) {
    return (
        <div className="flex flex-col h-full justify-center items-center text-center min-h-[500px] py-8">
            {/* Success Icon with Animation */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-green-500 rounded-full p-6">
                    <Mail className="w-12 h-12 text-white" />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                </div>
            </div>

            {/* Success Message */}
            <div className="space-y-4 mb-8">
                <h2 className="text-3xl font-bold text-foreground">Check Your Email</h2>
                <div className="space-y-2">
                    <p className="text-muted-foreground text-lg">We&apos;ve sent a verification link to</p>
                    <p className="text-indigo-600 font-semibold text-lg break-all px-4">{email}</p>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8 max-w-md">
                <h3 className="font-semibold text-foreground mb-3 flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    Next Steps
                </h3>
                <ol className="text-left text-sm text-foreground space-y-2">
                    <li className="flex gap-2">
                        <span className="font-semibold text-blue-600">1.</span>
                        <span>Open your email inbox</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="font-semibold text-blue-600">2.</span>
                        <span>Click the verification link we sent you</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="font-semibold text-blue-600">3.</span>
                        <span>You&apos;ll be redirected to your dashboard</span>
                    </li>
                </ol>
            </div>

            {/* Additional Actions */}
            <div className="space-y-4 w-full max-w-md">
                <p className="text-sm text-muted-foreground">Didn&apos;t receive the email? Check your spam folder.</p>

                <Link href="/auth/login" className="block">
                    <Button variant="outline" className="w-full h-12 border-2 hover:border-indigo-500 hover:bg-indigo-500/10 font-semibold rounded-xl transition-all duration-200">
                        <span>Back to Sign In</span>
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
