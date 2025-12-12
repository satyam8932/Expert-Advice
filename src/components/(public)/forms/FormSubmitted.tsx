import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Zap } from 'lucide-react';

export function FormSubmitted() {
    return (
        <div className="w-full max-w-lg mx-auto animate-in fade-in zoom-in duration-500">
            <Card className="bg-card border border-green-500/30 shadow-2xl">
                <CardContent className="p-10 text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50 shadow-inner">
                            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400 animate-in zoom-in duration-1000" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mb-2">Form Submitted!</h2>
                        <p className="text-muted-foreground mb-4">We have received your submission.</p>
                        <div className="inline-flex items-center gap-2 text-sm font-medium text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/30">
                            <Zap className="w-4 h-4" />
                            Analysis initiated.
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">We'll review your information and get back to you soon.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
