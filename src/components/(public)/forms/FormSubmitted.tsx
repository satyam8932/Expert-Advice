import { Card, CardContent } from '@/components/ui/card';

export function FormSubmitted() {
    return (
        <div className="w-full max-w-2xl mx-auto">
            <Card className="border border-gray-200 shadow-lg overflow-hidden">
                <CardContent className="p-10 text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                        <p className="text-gray-600 mb-4">Your submission has been received successfully.</p>
                        <p className="text-sm text-gray-500">We'll review your information and get back to you soon.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
