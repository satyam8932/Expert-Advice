'use client';
import { useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileVideoCaptureProps {
    onVideoCapture: (file: File) => void;
    onCancel: () => void;
}

export default function MobileVideoCapture({ onVideoCapture, onCancel }: MobileVideoCaptureProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('video/')) {
            onVideoCapture(file);
        }
    };

    const triggerCapture = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-indigo-500/30 bg-indigo-500/10 rounded-xl p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-indigo-600 rounded-full">
                        <Camera className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-foreground mb-1">Record Video</p>
                        <p className="text-sm text-muted-foreground">Tap below to open your camera</p>
                    </div>
                </div>
            </div>

            <input ref={fileInputRef} type="file" accept="video/*" capture="environment" onChange={handleFileChange} className="hidden" />

            <div className="flex gap-3">
                <Button onClick={onCancel} variant="outline" className="flex-1">
                    <X className="mr-2 w-4 h-4" />
                    Cancel
                </Button>
                <Button onClick={triggerCapture} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                    <Camera className="mr-2 w-4 h-4" />
                    Open Camera
                </Button>
            </div>
        </div>
    );
}
