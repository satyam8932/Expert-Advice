import { ArrowLeft } from 'lucide-react';
import { AuthHeaderProps } from '@/lib/types/auth.types';
import Link from 'next/link';

export default function AuthHeader({ title, subtitle, linkText, linkHref }: AuthHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => window.history.back()} className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-lg" aria-label="Go back">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-sm text-muted-foreground">
                    {linkText}{' '}
                    <Link href={linkHref} className="text-indigo-500 dark:text-indigo-400 font-semibold hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">
                        {linkHref === '/auth/login' ? 'Sign in' : 'Sign up'}
                    </Link>
                </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
        </div>
    );
}
