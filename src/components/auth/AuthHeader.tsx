import { ArrowLeft } from 'lucide-react';
import { AuthHeaderProps } from '@/lib/types/auth.types';
import Link from 'next/link';

export default function AuthHeader({ title, subtitle, linkText, linkHref }: AuthHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => window.history.back()} className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg" aria-label="Go back">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-sm text-gray-600">
                    {linkText}{' '}
                    <Link href={linkHref} className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                        {linkHref === '/auth/login' ? 'Sign in' : 'Sign up'}
                    </Link>
                </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-500">{subtitle}</p>
        </div>
    );
}
