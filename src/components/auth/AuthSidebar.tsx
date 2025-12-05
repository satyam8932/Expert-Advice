import { StatsData } from '@/lib/types/auth.types';
import Image from 'next/image';
import { Zap, Shield } from 'lucide-react';

interface AuthSidebarProps {
    stats: StatsData;
}

export default function AuthSidebar({ stats }: AuthSidebarProps) {
    return (
        <div className="relative z-10 h-full flex flex-col items-center justify-center min-h-[635px] p-8 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full opacity-10 blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400 rounded-full opacity-10 blur-3xl -z-10"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full opacity-5 blur-3xl -z-10"></div>

            {/* Central Mockup (Placeholder for better image content) */}
            <div className="z-20 mb-10 w-full max-w-sm">
                {/* Replace with your actual dashboard mockup image */}
                <Image src="/01.svg" alt="AdviceExpert.io Dashboard" width={350} height={350} className="object-contain" />
            </div>

            <div className="z-20 text-center">
                <h2 className="text-3xl font-bold mb-3">AI-Powered Data Intake</h2>
                <p className="text-indigo-300 mb-6 max-w-xs mx-auto">Transform video submissions into structured JSON and Markdown automatically.</p>

                <div className="flex justify-center gap-6">
                    <div className="p-3 bg-indigo-500/20 rounded-lg border border-indigo-500/30 text-left">
                        <Zap className="w-5 h-5 text-indigo-300 mb-1" />
                        <p className="text-xl font-bold leading-none">{stats.inbox}</p>
                        <p className="text-xs text-gray-400 mt-1">Processed Forms</p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30 text-left">
                        <Shield className="w-5 h-5 text-green-300 mb-1" />
                        <p className="text-xl font-bold leading-none">{stats.engagement}%</p>
                        <p className="text-xs text-gray-400 mt-1">Video Accuracy</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
