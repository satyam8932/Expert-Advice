'use client';
import { Check } from 'lucide-react';
import { StepConfig } from '@/lib/types/collection-form.types';

interface StepIndicatorProps {
    steps: StepConfig[];
    currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    return (
        <div className="relative mb-20 md:mb-16">
            <div className="flex items-center justify-center">
                <div className="relative flex items-center justify-between w-full max-w-md">
                    {/* Progress Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -z-10 transform -translate-y-1/2 mt-1">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out rounded-full" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} />
                    </div>

                    {steps.map((s) => {
                        const isCompleted = currentStep > s.number;
                        const isActive = currentStep === s.number;

                        return (
                            <div key={s.number} className="flex flex-col items-center relative z-10 px-1">
                                {/* Step Circle */}
                                <div
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 shadow-lg 
                                        ${isCompleted ? 'bg-indigo-500 text-white border-2 border-indigo-500/50' : isActive ? 'bg-foreground text-background ring-4 ring-indigo-500/50' : 'bg-card border-2 border-border text-muted-foreground'}
                                    `}
                                >
                                    {isCompleted ? <Check className="w-5 h-5" /> : s.number}
                                </div>

                                {/* Step Title and Description */}
                                <div className="mt-3 text-center whitespace-nowrap">
                                    <div className={`font-medium text-sm transition-colors ${currentStep >= s.number ? 'text-foreground' : 'text-muted-foreground'}`}>{s.title}</div>
                                    <div className={`text-xs transition-colors ${currentStep >= s.number ? 'text-indigo-500 dark:text-indigo-400' : 'text-muted-foreground'}`}>{s.desc}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
